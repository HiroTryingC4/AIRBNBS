import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper function to parse dates from natural language
function parseDateFromMessage(message: string): { startDate?: Date, endDate?: Date, dateQuery?: string } {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const lowerMessage = message.toLowerCase();
  
  // Common date patterns
  const datePatterns = [
    // Specific dates (YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY)
    /(\d{4}-\d{2}-\d{2})/g,
    /(\d{1,2}\/\d{1,2}\/\d{4})/g,
    /(\d{1,2}-\d{1,2}-\d{4})/g,
  ];
  
  // Relative date keywords
  if (lowerMessage.includes('today')) {
    return { startDate: today, dateQuery: 'today' };
  }
  
  if (lowerMessage.includes('tomorrow')) {
    return { startDate: tomorrow, dateQuery: 'tomorrow' };
  }
  
  if (lowerMessage.includes('this weekend')) {
    const friday = new Date(today);
    const daysUntilFriday = (5 - today.getDay() + 7) % 7;
    friday.setDate(today.getDate() + daysUntilFriday);
    
    const sunday = new Date(friday);
    sunday.setDate(friday.getDate() + 2);
    
    return { startDate: friday, endDate: sunday, dateQuery: 'this weekend' };
  }
  
  if (lowerMessage.includes('next week')) {
    const nextMonday = new Date(today);
    const daysUntilNextMonday = (8 - today.getDay()) % 7 || 7;
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);
    
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);
    
    return { startDate: nextMonday, endDate: nextSunday, dateQuery: 'next week' };
  }
  
  if (lowerMessage.includes('next month')) {
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    nextMonth.setDate(1);
    
    const endOfNextMonth = new Date(nextMonth);
    endOfNextMonth.setMonth(nextMonth.getMonth() + 1);
    endOfNextMonth.setDate(0);
    
    return { startDate: nextMonth, endDate: endOfNextMonth, dateQuery: 'next month' };
  }
  
  // Try to extract specific dates
  for (const pattern of datePatterns) {
    const matches = message.match(pattern);
    if (matches && matches.length > 0) {
      const startDate = new Date(matches[0]);
      if (!isNaN(startDate.getTime())) {
        const endDate = matches.length > 1 ? new Date(matches[1]) : undefined;
        return { 
          startDate, 
          endDate: endDate && !isNaN(endDate.getTime()) ? endDate : undefined,
          dateQuery: matches.join(' to ')
        };
      }
    }
  }
  
  return {};
}

// Helper function to check availability for properties
async function checkAvailability(startDate: Date, endDate?: Date): Promise<any[]> {
  try {
    // Get all published properties (fallback to mock data if no database)
    let properties;
    try {
      properties = await prisma.property.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          name: true,
          pricePerNight: true,
          location: true,
          guestCapacity: true,
          bedCount: true,
          bathroomCount: true
        }
      });
    } catch (dbError) {
      // Fallback to mock data if database is not available
      console.log('Database not available, using mock data for availability check');
      properties = [
        {
          id: '1',
          name: 'Cozy Studio Unit',
          pricePerNight: 2500,
          location: 'Urban Deca Towers Cubao',
          guestCapacity: 2,
          bedCount: 1,
          bathroomCount: 1
        },
        {
          id: '2',
          name: 'Deluxe Family Unit',
          pricePerNight: 3500,
          location: 'Urban Deca Towers Cubao',
          guestCapacity: 4,
          bedCount: 2,
          bathroomCount: 1
        },
        {
          id: '3',
          name: 'Premium City View',
          pricePerNight: 4000,
          location: 'Urban Deca Towers Cubao',
          guestCapacity: 6,
          bedCount: 3,
          bathroomCount: 2
        },
        {
          id: '4',
          name: 'Executive Suite',
          pricePerNight: 4500,
          location: 'Urban Deca Towers Cubao',
          guestCapacity: 6,
          bedCount: 3,
          bathroomCount: 2
        }
      ];
    }

    const availabilityResults = [];
    
    for (const property of properties) {
      try {
        // Generate all dates to check (including single date or date range)
        const datesToCheck = [];
        const currentDate = new Date(startDate);
        const finalDate = endDate || new Date(startDate);
        
        while (currentDate <= finalDate) {
          datesToCheck.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Check availability for each date
        let isFullyAvailable = true;
        const availabilityDetails = [];
        
        for (const dateToCheck of datesToCheck) {
          // Normalize date to start of day for comparison
          const normalizedDate = new Date(dateToCheck);
          normalizedDate.setHours(0, 0, 0, 0);
          
          const availability = await prisma.availability.findUnique({
            where: {
              propertyId_date: {
                propertyId: property.id,
                date: normalizedDate
              }
            }
          });
          
          // CRITICAL: If admin has set availability, respect it
          // If no availability record exists, assume BLOCKED (not available) for safety
          const dateStatus = availability ? availability.status : 'BLOCKED';
          
          availabilityDetails.push({
            date: normalizedDate,
            status: dateStatus
          });
          
          // Property is only available if ALL dates are AVAILABLE
          if (dateStatus !== 'AVAILABLE') {
            isFullyAvailable = false;
          }
        }
        
        if (isFullyAvailable) {
          availabilityResults.push({
            ...property,
            available: true,
            availabilityDates: availabilityDetails
          });
        }
      } catch (availError) {
        // If availability check fails for database, assume NOT available for safety
        console.log('Availability check failed for property:', property.id);
        // Don't add to available results - be conservative
      }
    }
    
    return availabilityResults;
  } catch (error) {
    console.error('Error checking availability:', error);
    // For safety, return empty array if there's an error
    // This ensures we don't show false availability
    return [];
  }
}

// Enhanced message processing with availability checking
async function processMessage(message: string, sessionId: string, guestName?: string, guestEmail?: string) {
  const lowerMessage = message.toLowerCase();
  
  // Check if message is asking about availability
  const availabilityKeywords = [
    'available', 'availability', 'book', 'reserve', 'dates', 'check-in', 'check-out',
    'stay', 'nights', 'weekend', 'week', 'month', 'today', 'tomorrow'
  ];
  
  const isAvailabilityQuery = availabilityKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  if (isAvailabilityQuery) {
    const { startDate, endDate, dateQuery } = parseDateFromMessage(message);
    
    if (startDate) {
      // Check availability for the parsed dates
      const availableProperties = await checkAvailability(startDate, endDate);
      
      if (availableProperties.length > 0) {
        const dateStr = dateQuery || startDate.toLocaleDateString();
        const propertyList = availableProperties.slice(0, 3).map(prop => 
          `• **${prop.name}** - ₱${prop.pricePerNight}/night (${prop.guestCapacity} guests, ${prop.bedCount} bed${prop.bedCount > 1 ? 's' : ''})`
        ).join('\n');
        
        return {
          message: `Yes! 🎉 I found ${availableProperties.length} available unit${availableProperties.length > 1 ? 's' : ''} for ${dateStr}:\n\n${propertyList}\n\n${availableProperties.length > 3 ? `And ${availableProperties.length - 3} more units available!\n\n` : ''}Ready to book? Call James at **09760016381** to secure your reservation!\n\nWhat else can I help you with?`,
          type: 'availability_results',
          data: {
            availableProperties,
            searchDates: { startDate, endDate, dateQuery }
          }
        };
      } else {
        const dateStr = dateQuery || startDate.toLocaleDateString();
        return {
          message: `Sorry! 😔 All our units are fully booked for ${dateStr}.\n\n**But don't worry!** Here are your options:\n• **Different dates** - Try nearby dates\n• **Waitlist** - I can check for cancellations\n• **Alternative dates** - Let me suggest available dates\n\nCall James at **09760016381** - he might have last-minute availability or can suggest the best alternative dates!\n\nWould you like me to check different dates for you?`,
          type: 'no_availability'
        };
      }
    } else {
      // General availability inquiry without specific dates
      return {
        message: `I'd be happy to help you check availability! 📅\n\nTo find the perfect dates for your stay, could you let me know:\n• **When would you like to check in?** (e.g., "this weekend", "next Friday", "December 15")\n• **How many nights?** (optional)\n• **Number of guests?** (optional)\n\nYou can also say things like:\n• "Check availability for this weekend"\n• "Are you available tomorrow?"\n• "Show me dates for next month"\n\nWhat dates work best for you?`,
        type: 'availability_inquiry'
      };
    }
  }
  
  // Existing keyword-based responses...
  const responses = {
    // Booking and reservation keywords
    'booking|reserve|book|reservation': `I'd love to help you book your stay! 🏠\n\nTo get started, I need to know:\n• **Your preferred dates** (check-in and check-out)\n• **Number of guests**\n• **Which unit interests you most**\n\nOnce I have these details, I can check availability and connect you with James at **09760016381** to finalize your reservation.\n\nWhat dates are you thinking about?`,
    
    // Location and address
    'location|address|where|directions|how to get': `📍 **Evangelina's Staycation Location:**\n\n**Urban Deca Towers Cubao**\nQuezon City, Metro Manila\n\nWe're perfectly located in the heart of Cubao - close to shopping centers, restaurants, and public transportation. Easy access to MRT/LRT stations!\n\n🚇 **Nearby:**\n• Gateway Mall (5 mins walk)\n• Smart Araneta Coliseum (10 mins walk)\n• MRT Cubao Station (8 mins walk)\n• Various restaurants and shops\n\n🚗 **By Car:** Easy access via EDSA\n🚌 **By Bus:** Multiple bus routes to Cubao\n\nNeed specific directions or transport options?`,
    
    // Pricing information
    'price|cost|rate|how much|pricing|rates|expensive|cheap|budget': `💰 **Pricing Information:**\n\nOur rates vary by unit and season, but here's what you can expect:\n\n• **Cozy Studio:** ₱2,500-3,000/night (2 guests)\n• **Family Unit:** ₱3,500-4,000/night (4 guests)\n• **City View:** ₱4,000-4,500/night (6 guests)\n• **Executive Suite:** ₱4,500-5,000/night (6 guests)\n\n**Rate Factors:**\n• Weekend rates are higher\n• Holiday rates apply during peak seasons\n• Long stays get discounts\n• Group bookings get special rates\n\nCall James at **09760016381** for exact pricing and current promotions!`,
    
    // Contact information
    'contact|phone|call|james|number|reach|talk': `📞 **Contact James:**\n\n**Phone:** 09760016381\n**Available:** 24/7 for inquiries and bookings\n**Response Time:** Usually within 30 minutes\n\nJames is our friendly host who can help you with:\n• Instant booking confirmation\n• Special requests and arrangements\n• Local recommendations\n• Check-in coordination\n• Emergency assistance\n\n**Preferred Contact Methods:**\n• Call for immediate response\n• Text/SMS for quick questions\n• WhatsApp available\n\nFeel free to call or text him directly! 😊`,
    
    // Amenities and facilities
    'amenities|facilities|what.*included|features|wifi|kitchen|aircon|tv': `🏠 **Our Amazing Amenities:**\n\n**In Every Unit:**\n• Free high-speed WiFi (50+ Mbps)\n• Air conditioning (inverter type)\n• Fully equipped kitchen (stove, microwave, ref)\n• Smart TV with Netflix/streaming\n• Premium bedding & fresh linens\n• Hot shower with toiletries\n• Dining table and chairs\n• Work desk and chair\n• Iron and ironing board\n\n**Building Facilities:**\n• 24/7 security with CCTV\n• High-speed elevators\n• Parking spaces (limited)\n• Backup power generator\n• Water filtration system\n\n**Free Extras:**\n• Welcome snacks and drinks\n• Coffee and tea supplies\n• Basic cooking essentials\n\nWhich amenities are most important for your stay?`,
    
    // Units and capacity
    'units|rooms|how many|capacity|types|which unit|studio|family|suite': `🏠 **Our 4 Cozy Units:**\n\n**1. Cozy Studio Unit** (₱2,500/night)\n• 2 guests max • 1 queen bed • 1 bathroom\n• Perfect for couples or solo travelers\n\n**2. Deluxe Family Unit** (₱3,500/night)\n• 4 guests max • 2 beds • 1 bathroom\n• Great for small families or friends\n\n**3. Premium City View** (₱4,000/night)\n• 6 guests max • 3 beds • 2 bathrooms\n• Amazing city views, perfect for groups\n\n**4. Executive Suite** (₱4,500/night)\n• 6 guests max • 3 beds • 2 bathrooms\n• Luxury amenities, best for special occasions\n\n**All units include:**\n• Full kitchen • WiFi • AC • Smart TV\n• Fresh linens • Toiletries • Welcome treats\n\nWhich unit sounds perfect for your group?`,
    
    // Check-in/check-out
    'check.?in|check.?out|time|arrival|departure|early|late': `⏰ **Check-in & Check-out Details:**\n\n**Standard Times:**\n• **Check-in:** 3:00 PM onwards\n• **Check-out:** 11:00 AM\n\n**Flexible Options Available:**\n• **Early check-in:** From 12:00 PM (subject to availability)\n• **Late check-out:** Until 2:00 PM (₱500 fee)\n• **Luggage storage:** Free before/after your stay\n• **Express check-in:** Via mobile key (advance arrangement)\n\n**Check-in Process:**\n1. James will meet you at the lobby\n2. Quick orientation of the unit\n3. Key handover and emergency contacts\n4. Local recommendations if needed\n\n**What to Bring:**\n• Valid ID for all guests\n• Confirmation details\n• Contact number\n\nNeed special timing arrangements? James is very flexible!`,
    
    // Parking
    'parking|car|vehicle|drive|garage': `🚗 **Parking Information:**\n\n**Building Parking:**\n• Limited slots available (₱200/night)\n• Covered and secure\n• First-come, first-served basis\n• Must reserve in advance\n\n**Alternative Options:**\n• Street parking nearby (free but limited)\n• Gateway Mall parking (₱40/day)\n• 24-hour parking lots within 2 blocks\n\n**Important Notes:**\n• Inform James when booking if you need parking\n• Provide car details (plate number, model)\n• Parking is subject to availability\n• No overnight street parking allowed\n\n**Directions for Drivers:**\n• Take EDSA to Cubao\n• Turn at Gateway Mall\n• Urban Deca Towers is behind Gateway\n\nAre you planning to drive to your stay?`,
    
    // Pets
    'pet|dog|cat|animal|bring pet': `🐕 **Pet Policy - Pets Welcome!**\n\n**We love furry friends!** Well-behaved pets are welcome:\n\n**Pet Fees:**\n• Small pets (under 10kg): ₱300/night\n• Large pets (over 10kg): ₱500/night\n• Maximum 2 pets per unit\n\n**Requirements:**\n• Must be house-trained and supervised\n• Updated vaccination records\n• Pet carrier/leash required in common areas\n• Owner responsible for any damages\n\n**Pet Amenities:**\n• Pet bowls available upon request\n• Nearby pet stores and vet clinics\n• Dog walking areas in the vicinity\n\n**House Rules:**\n• No pets on beds/furniture (unless arranged)\n• Clean up after your pet immediately\n• Keep noise levels considerate of neighbors\n\n**Please inform James at 09760016381 when booking!**\n\nTell us about your furry companion! 🐾`,
    
    // Cancellation and policies
    'cancel|refund|policy|change|modify': `📋 **Booking Policies:**\n\n**Cancellation Policy:**\n• **Free cancellation:** Up to 48 hours before check-in\n• **50% refund:** 24-48 hours before check-in\n• **No refund:** Less than 24 hours (except emergencies)\n• **Full refund:** Weather emergencies, health issues\n\n**Modification Policy:**\n• Date changes: Free if available (48hrs notice)\n• Guest count changes: Subject to unit capacity\n• Unit upgrades: Pay difference only\n\n**Payment Terms:**\n• 50% deposit to confirm booking\n• Balance due upon check-in\n• Accepted: Cash, GCash, bank transfer\n• Credit cards accepted (3% processing fee)\n\n**House Rules:**\n• No smoking inside units\n• No parties or loud gatherings\n• Respect quiet hours (10 PM - 7 AM)\n• Maximum occupancy strictly enforced\n\n**Damage Policy:**\n• Security deposit: ₱2,000 (refundable)\n• Damages charged at replacement cost\n\nQuestions about policies? Call James at **09760016381**!`,
    
    // Safety and security
    'safe|safety|security|secure|crime|dangerous': `🛡️ **Safety & Security:**\n\n**Building Security:**\n• 24/7 professional security guards\n• CCTV monitoring all common areas\n• Keycard access to floors\n• Visitor registration required\n• Emergency response protocols\n\n**Unit Security:**\n• Digital door locks with backup keys\n• Peephole and door chain\n• Emergency contact numbers provided\n• Fire extinguisher in each unit\n\n**Area Safety:**\n• Cubao is a busy, well-lit commercial area\n• Heavy foot traffic during day and evening\n• Police station within 1km\n• Hospital nearby (St. Luke's Medical Center)\n\n**Safety Tips:**\n• Keep valuables in provided safe\n• Don't leave doors/windows open when out\n• Use official transportation (Grab, taxi)\n• Stay in well-lit areas at night\n\n**Emergency Contacts:**\n• James (Host): 09760016381\n• Building Security: Available 24/7\n• Police: 117 • Fire: 116 • Medical: 911\n\nYour safety is our top priority! 🏠`,
    
    // Food and dining
    'food|restaurant|eat|dining|kitchen|cook|grocery': `🍽️ **Food & Dining Options:**\n\n**In-Unit Cooking:**\n• Fully equipped kitchen in every unit\n• Stove, microwave, refrigerator\n• Cookware, plates, utensils provided\n• Basic seasonings and cooking oil\n• Coffee maker and electric kettle\n\n**Nearby Restaurants:**\n• **Gateway Mall Food Court** (5 mins walk)\n• **Jollibee, McDonald's** (3 mins walk)\n• **Local Filipino restaurants** (walking distance)\n• **24-hour convenience stores** (2 mins walk)\n• **Shakey's, Pizza Hut** (Gateway Mall)\n\n**Grocery Shopping:**\n• **SM Hypermarket** (Gateway Mall)\n• **7-Eleven** (multiple locations nearby)\n• **Puregold** (10 mins walk)\n• **Wet market** (traditional Filipino market)\n\n**Food Delivery:**\n• GrabFood, Foodpanda available\n• Most restaurants deliver to the building\n• James can recommend local favorites\n\n**Welcome Treats:**\n• Complimentary snacks upon arrival\n• Coffee, tea, and bottled water\n• Local delicacies (seasonal)\n\nLove to cook or prefer dining out? We've got you covered! 👨‍🍳`,
    
    // Transportation
    'transport|transportation|mrt|lrt|bus|taxi|grab|jeepney': `🚇 **Transportation Guide:**\n\n**MRT/LRT Access:**\n• **MRT Cubao Station** - 8 minutes walk\n• **LRT Roosevelt Station** - 15 minutes walk\n• Direct connections to Makati, Ortigas, Manila\n• Operating hours: 5:00 AM - 10:30 PM\n\n**Bus Routes:**\n• EDSA Carousel (BRT) - 5 minutes walk\n• Provincial buses to nearby cities\n• City buses to Manila, Makati, BGC\n• 24-hour bus services available\n\n**Ride-Hailing:**\n• **Grab** - Very accessible in Cubao\n• **Angkas** (motorcycle) for quick trips\n• Pickup points at Gateway Mall\n\n**Traditional Transport:**\n• **Jeepneys** - Cheapest option (₱12-15)\n• **Tricycles** - For short distances (₱20-50)\n• **FX/UV Express** - To specific destinations\n\n**Taxi Services:**\n• Regular metered taxis available\n• Airport taxis (₱200-300 to NAIA)\n• 24-hour availability\n\n**Walking Distance:**\n• Gateway Mall: 5 minutes\n• Araneta Coliseum: 10 minutes\n• Most restaurants: 3-8 minutes\n\n**Pro Tips:**\n• Download Grab app before arrival\n• Keep small bills for jeepneys\n• Rush hours: 7-9 AM, 5-8 PM\n\nNeed help planning your routes? James knows all the shortcuts! 🗺️`,
    
    // Greetings and general
    'hello|hi|hey|good morning|good afternoon|good evening': `Hi there! 👋 Welcome to **Evangelina's Staycation**!\n\nI'm here to help you with our 4 cozy Airbnb units at Urban Deca Towers Cubao. How can I assist you today?\n\n**I can help with:**\n• **Checking availability** for your dates\n• **Pricing and booking** information\n• **Unit details and amenities**\n• **Location and directions**\n• **Local recommendations**\n• **Contact information**\n\nWhat would you like to know about your perfect staycation? ✨`,
    
    // Thank you responses
    'thank|thanks|appreciate': `You're very welcome! 😊 We're excited to potentially host you at Evangelina's Staycation.\n\n**Next Steps:**\n• Call James at **09760016381** for booking\n• Check our availability for your dates\n• Ask any other questions you might have\n\n**Follow us:**\n• 1.3K followers • 12 following\n• Regular updates on availability and promotions\n\nHave a wonderful day and we hope to welcome you soon! 🌟`,
    
    // Goodbye responses
    'bye|goodbye|see you|talk later': `Thank you for your interest in Evangelina's Staycation! 👋\n\n**Don't forget:**\n• Call James at **09760016381** for bookings\n• We have 4 cozy units waiting for you\n• Located at Urban Deca Towers Cubao\n\n**We're here 24/7** whenever you're ready to book your perfect staycation!\n\nSafe travels and hope to see you soon! 🏠✨`
  };
  
  // Find matching response
  for (const [pattern, response] of Object.entries(responses)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(message)) {
      return { message: response, type: 'keyword_match' };
    }
  }
  
  // Default response for unmatched queries
  return {
    message: `Thanks for your message! I want to make sure I give you the best information. 😊\n\n**I can help you with:**\n• **Availability** - "Check dates for this weekend"\n• **Booking** - "How do I reserve a unit?"\n• **Pricing** - "What are your rates?"\n• **Location** - "Where are you located?"\n• **Amenities** - "What's included?"\n• **Contact** - "How do I reach James?"\n\nOr feel free to contact James directly at **09760016381** for personalized assistance!\n\nWhat specific information can I help you find?`,
    type: 'default'
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, message, guestName, guestEmail } = body;

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Process message with enhanced availability checking
    const result = await processMessage(message, sessionId, guestName, guestEmail);

    // Create response object
    const response = {
      id: `response_${Date.now()}`,
      sessionId,
      message: result.message,
      isFromGuest: false,
      createdAt: new Date().toISOString(),
      guestName,
      guestEmail,
      type: result.type,
      data: result.data || null
    };

    return NextResponse.json({
      success: true,
      response
    });

  } catch (error) {
    console.error('Error processing chat message:', error);
    
    // Fallback response
    const fallbackResponse = {
      id: `response_${Date.now()}`,
      sessionId: 'fallback',
      message: "I'm having a small technical issue, but I'm still here to help! 😊 For immediate assistance with availability and bookings, please call James at **09760016381**. He's available 24/7 and can help you with everything you need!",
      isFromGuest: false,
      createdAt: new Date().toISOString(),
      type: 'fallback'
    };
    
    return NextResponse.json({
      success: true,
      response: fallbackResponse
    });
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}