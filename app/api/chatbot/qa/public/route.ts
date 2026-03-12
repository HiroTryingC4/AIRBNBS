import { NextResponse } from 'next/server';

// Fallback Q&A data when backend is not available
const fallbackQAPairs = [
  {
    id: '1',
    question: 'What are your check-in and check-out times?',
    answer: 'Check-in is at 3:00 PM and check-out is at 11:00 AM. Early check-in or late check-out may be available upon request - just let us know your needs!',
    keywords: ['check-in', 'check-out', 'time', 'arrival', 'departure']
  },
  {
    id: '2',
    question: 'Do you allow pets?',
    answer: 'We welcome well-behaved pets! There is a pet fee of $25 per night per pet. Please let us know in advance if you\'re bringing a furry friend.',
    keywords: ['pets', 'dogs', 'cats', 'animals', 'pet-friendly']
  },
  {
    id: '3',
    question: 'Is parking available?',
    answer: 'Yes, we provide free parking for our guests! Each property has designated parking spaces available. No need to worry about finding street parking.',
    keywords: ['parking', 'car', 'vehicle', 'garage']
  },
  {
    id: '4',
    question: 'What amenities do you offer?',
    answer: 'Our properties include WiFi, air conditioning, fully equipped kitchens, smart TVs, premium bedding, and hot showers. Each property may have additional amenities like pools or gyms!',
    keywords: ['amenities', 'facilities', 'features', 'wifi', 'kitchen']
  },
  {
    id: '5',
    question: 'How do I make a reservation?',
    answer: 'I\'d love to help you book! Just let me know your preferred dates, number of guests, and which property interests you. I can check availability and guide you through the process.',
    keywords: ['book', 'reserve', 'booking', 'reservation']
  },
  {
    id: '6',
    question: 'What\'s your cancellation policy?',
    answer: 'We offer flexible cancellation! You can cancel up to 48 hours before check-in for a full refund. For cancellations within 48 hours, we charge one night\'s stay.',
    keywords: ['cancel', 'cancellation', 'refund', 'policy']
  },
  {
    id: '7',
    question: 'Are your properties family-friendly?',
    answer: 'Absolutely! Our properties are perfect for families. We can provide cribs, high chairs, and other baby equipment upon request. Many properties have pools and family amenities.',
    keywords: ['family', 'kids', 'children', 'baby', 'family-friendly']
  },
  {
    id: '8',
    question: 'What\'s included in the price?',
    answer: 'Your stay includes WiFi, utilities, basic toiletries, fresh linens, towels, and access to all listed amenities. Cleaning fee and taxes are separate - no hidden charges!',
    keywords: ['price', 'cost', 'included', 'fees', 'utilities']
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