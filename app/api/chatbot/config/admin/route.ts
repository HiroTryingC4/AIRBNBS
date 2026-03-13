import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Default chatbot configuration
const defaultConfig = {
  isEnabled: true,
  welcomeMessage: "Hi! How can I help you today?",
  position: "bottom-right",
  primaryColor: "#3B82F6",
  textColor: "#FFFFFF",
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  showOnPages: "all",
  autoOpenDelay: null,
  offlineMessage: "We're currently offline. Please leave a message and we'll get back to you!",
  businessHours: null,
  quickReplies: JSON.stringify([
    "Check availability",
    "What dates are available?",
    "Property information", 
    "Booking inquiry",
    "Contact host"
  ])
};

export async function GET(request: NextRequest) {
  try {
    // Try to fetch from backend first
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const authHeader = request.headers.get('Authorization');
    
    try {
      const response = await fetch(`${backendUrl}/api/chatbot/config/admin`, {
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
      console.log('Backend not available for admin config, using default');
    }
    
    // Return default config if backend is not available
    return NextResponse.json(defaultConfig);
    
  } catch (error) {
    console.error('Error in admin config API route:', error);
    return NextResponse.json(defaultConfig);
  }
}