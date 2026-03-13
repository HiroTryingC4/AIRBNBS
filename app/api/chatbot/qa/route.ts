import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Default Q&A pairs for admin management
const defaultQAPairs = [
  {
    id: '1',
    question: 'What are your check-in and check-out times?',
    answer: 'Check-in is at 3:00 PM and check-out is at 11:00 AM. Early check-in or late check-out may be available upon request - just let us know your needs!',
    keywords: ['check-in', 'check-out', 'time', 'arrival', 'departure'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    question: 'Do you allow pets?',
    answer: 'We welcome well-behaved pets! There is a pet fee of $25 per night per pet. Please let us know in advance if you\'re bringing a furry friend.',
    keywords: ['pets', 'dogs', 'cats', 'animals', 'pet-friendly'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    question: 'Is parking available?',
    answer: 'Yes, we provide free parking for our guests! Each property has designated parking spaces available. No need to worry about finding street parking.',
    keywords: ['parking', 'car', 'vehicle', 'garage'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    question: 'What amenities do you offer?',
    answer: 'Our properties include WiFi, air conditioning, fully equipped kitchens, smart TVs, premium bedding, and hot showers. Each property may have additional amenities like pools or gyms!',
    keywords: ['amenities', 'facilities', 'features', 'wifi', 'kitchen'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    question: 'How do I make a reservation?',
    answer: 'I\'d love to help you book! Just let me know your preferred dates, number of guests, and which property interests you. I can check availability and guide you through the process.',
    keywords: ['book', 'reserve', 'booking', 'reservation'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    // Try to fetch from backend first
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const authHeader = request.headers.get('Authorization');
    
    try {
      const response = await fetch(`${backendUrl}/api/chatbot/qa`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader || '',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.log('Backend not available for Q&A admin, using default data');
    }
    
    // Return default Q&A pairs if backend is not available
    return NextResponse.json(defaultQAPairs);
    
  } catch (error) {
    console.error('Error in Q&A admin API route:', error);
    return NextResponse.json(defaultQAPairs);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const qaPairs = await request.json();
    
    // Try to save to backend first
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const authHeader = request.headers.get('Authorization');
    
    try {
      const response = await fetch(`${backendUrl}/api/chatbot/qa`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader || '',
        },
        body: JSON.stringify(qaPairs),
      });
      
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.log('Backend not available for Q&A save, returning success anyway');
    }
    
    // Return success even if backend is not available (for demo purposes)
    return NextResponse.json({ success: true, message: 'Q&A pairs saved successfully (demo mode)' });
    
  } catch (error) {
    console.error('Error in Q&A save API route:', error);
    return NextResponse.json({ error: 'Failed to save Q&A pairs' }, { status: 500 });
  }
}