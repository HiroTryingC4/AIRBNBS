import { NextRequest, NextResponse } from 'next/server';

// Mock data for fallback responses
const mockResponses = [
  {
    keywords: ['availability', 'available', 'dates', 'when', 'calendar'],
    response: "I'd be happy to help you check availability! What dates are you interested in? I can show you our current availability and help you find the perfect time for your stay."
  },
  {
    keywords: ['price', 'cost', 'rate', 'pricing', 'how much'],
    response: "Our rates vary by season and length of stay. I'd be happy to get you a personalized quote! Could you let me know your preferred dates and number of guests?"
  },
  {
    keywords: ['amenities', 'facilities', 'what', 'include', 'features'],
    response: "Our properties include WiFi, air conditioning, fully equipped kitchens, smart TVs, and premium bedding. Each property may have additional amenities like pools or gyms. Which property interests you most?"
  },
  {
    keywords: ['location', 'where', 'address', 'nearby', 'area'],
    response: "We have properties in prime locations throughout the city. Each offers unique advantages - some are near beaches, others in the city center. What type of location would you prefer?"
  },
  {
    keywords: ['book', 'reserve', 'booking', 'reservation'],
    response: "I'd love to help you book! To get started, I'll need to know: 1) Your preferred dates, 2) Number of guests, 3) Which property interests you. What dates work best for you?"
  },
  {
    keywords: ['pets', 'pet', 'dog', 'cat', 'animal'],
    response: "We welcome well-behaved pets! There is a pet fee of $25 per night. Please let us know in advance if you're bringing a pet so we can ensure everything is ready for your furry friend."
  },
  {
    keywords: ['parking', 'car', 'vehicle', 'drive'],
    response: "Yes, we provide free parking for our guests. Each property has designated parking spaces available. You won't need to worry about finding street parking!"
  },
  {
    keywords: ['check-in', 'check-out', 'checkin', 'checkout', 'arrival', 'departure'],
    response: "Check-in is at 3:00 PM and check-out is at 11:00 AM. Early check-in or late check-out may be available upon request. Just let us know your travel plans!"
  }
];

function findBestResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Check for availability-related queries
  if (lowerMessage.includes('available') || lowerMessage.includes('dates') || lowerMessage.includes('when')) {
    return "I'd be happy to help you check availability! What dates are you interested in? I can show you our current availability and help you find the perfect time for your stay.\n\nWhat would be most helpful next?\n• See available dates\n• Get pricing information\n• Learn about amenities\n• Make an inquiry";
  }
  
  // Find matching response based on keywords
  for (const mockResponse of mockResponses) {
    if (mockResponse.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return mockResponse.response + "\n\nWhat would be most helpful next?\n• Check availability\n• Get pricing\n• Learn more about amenities\n• Contact us directly";
    }
  }
  
  // Default conversational response
  return "Thanks for your message! I'm here to help you with information about our properties, availability, pricing, and bookings. What would you like to know more about?\n\n• Property availability\n• Pricing and rates\n• Amenities and features\n• Booking process\n• Location details";
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

    // Generate intelligent response
    const responseMessage = findBestResponse(message);

    // Create response object
    const response = {
      id: `response_${Date.now()}`,
      sessionId,
      message: responseMessage,
      isFromGuest: false,
      createdAt: new Date().toISOString(),
      guestName,
      guestEmail
    };

    return NextResponse.json({
      success: true,
      response
    });

  } catch (error) {
    console.error('Error processing chat message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}