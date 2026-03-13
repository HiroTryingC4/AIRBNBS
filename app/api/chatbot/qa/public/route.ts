import { NextResponse } from 'next/server';

// Fallback Q&A data when backend is not available
const fallbackQAPairs = [
  {
    id: '1',
    question: 'What are your check-in and check-out times?',
    answer: 'Check-in is at 3:00 PM and check-out is at 11:00 AM. Early check-in or late check-out may be available upon request - just call James at 09760016381!',
    keywords: ['check-in', 'check-out', 'time', 'arrival', 'departure'],
    isActive: true
  },
  {
    id: '2',
    question: 'How many units do you have available?',
    answer: 'We have 4 cozy Airbnb units at Urban Deca Towers Cubao! Each unit is perfect for your city getaway with modern amenities and great city views. 🏙️',
    keywords: ['units', 'rooms', 'how many', 'available', 'properties'],
    isActive: true
  },
  {
    id: '3',
    question: 'Where exactly are you located?',
    answer: 'We\'re located at Urban Deca Towers Cubao in Quezon City - right in the heart of Cubao! Perfect location with easy access to malls, restaurants, and transportation. 📍',
    keywords: ['location', 'address', 'where', 'cubao', 'quezon city'],
    isActive: true
  },
  {
    id: '4',
    question: 'How can I contact James for booking?',
    answer: 'You can call or message James directly at 09760016381! He\'s available to help with bookings, answer questions, and ensure you have a great stay. 📲',
    keywords: ['contact', 'james', 'phone', 'booking', 'call'],
    isActive: true
  },
  {
    id: '5',
    question: 'What amenities do your units have?',
    answer: 'Our units include WiFi, air conditioning, fully equipped kitchen, comfortable beds, hot shower, and beautiful city views! Perfect for a relaxing staycation. ✨',
    keywords: ['amenities', 'facilities', 'features', 'wifi', 'kitchen', 'aircon'],
    isActive: true
  },
  {
    id: '6',
    question: 'Is parking available?',
    answer: 'Yes! Urban Deca Towers has parking facilities available. Please mention if you need parking when you contact James for booking. 🚗',
    keywords: ['parking', 'car', 'vehicle', 'garage'],
    isActive: true
  },
  {
    id: '7',
    question: 'What\'s the price per night?',
    answer: 'Our rates are very competitive for the location and amenities! Please call James at 09760016381 for current pricing and any special offers. Rates may vary by season and length of stay. 💰',
    keywords: ['price', 'cost', 'rate', 'how much', 'pricing'],
    isActive: true
  },
  {
    id: '8',
    question: 'Can I book for multiple nights?',
    answer: 'Absolutely! We welcome both short stays and longer bookings. Contact James at 09760016381 to discuss your dates and get the best rates for extended stays. 🗓️',
    keywords: ['multiple nights', 'long stay', 'extended', 'weekly', 'monthly'],
    isActive: true
  },
  {
    id: '9',
    question: 'Are your units family-friendly?',
    answer: 'Yes! Our units are perfect for families and couples alike. Each unit can comfortably accommodate guests with all the amenities you need for a comfortable stay. 👨‍👩‍👧‍👦',
    keywords: ['family', 'kids', 'children', 'family-friendly', 'couples'],
    isActive: true
  },
  {
    id: '10',
    question: 'How do I make a reservation?',
    answer: 'Easy! Just call or message James at 09760016381 with your preferred dates and number of guests. He\'ll check availability and help you book your perfect staycation! 🎉',
    keywords: ['book', 'reserve', 'booking', 'reservation', 'how to book'],
    isActive: true
  }
];

export async function GET() {
  try {
    // Try to fetch from backend first
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    
    try {
      const response = await fetch(`${backendUrl}/api/chatbot/qa/public`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.log('Backend not available, using fallback Q&A data');
    }
    
    // Return fallback data if backend is not available
    return NextResponse.json(fallbackQAPairs);
    
  } catch (error) {
    console.error('Error in Q&A API route:', error);
    return NextResponse.json(fallbackQAPairs);
  }
}