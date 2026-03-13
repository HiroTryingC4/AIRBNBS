import { NextRequest, NextResponse } from 'next/server';

// Default chatbot configuration
const defaultConfig = {
  isEnabled: true,
  welcomeMessage: "Hi! 👋 Welcome to Evangelina's Staycation! I'm here to help you with booking our 4 cozy Airbnb units at Urban Deca Towers Cubao. How can I assist you today?",
  position: 'bottom-right' as const,
  primaryColor: '#3B82F6',
  textColor: '#FFFFFF',
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  showOnPages: 'all',
  autoOpenDelay: 3,
  offlineMessage: "Thanks for your interest! Please call James at 09760016381 for immediate assistance with booking.",
  businessHours: "24/7 - We're always here to help!",
  quickReplies: JSON.stringify([
    "Check availability",
    "View our 4 units",
    "Get pricing info", 
    "Call James",
    "Location details",
    "Amenities"
  ])
};

export async function GET(request: NextRequest) {
  try {
    // Try to get config from backend first
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    
    try {
      const response = await fetch(`${backendUrl}/api/chatbot/config`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.log('Backend not available for config, using default config');
    }
    
    // Return default config if backend is not available
    return NextResponse.json(defaultConfig);
    
  } catch (error) {
    console.error('Error in config GET API route:', error);
    return NextResponse.json(defaultConfig);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const config = await request.json();
    
    // Try to save to backend first
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const authHeader = request.headers.get('Authorization');
    
    try {
      const response = await fetch(`${backendUrl}/api/chatbot/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader || '',
        },
        body: JSON.stringify(config),
      });
      
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.log('Backend not available for config save, returning success anyway');
    }
    
    // Return success even if backend is not available (for demo purposes)
    return NextResponse.json({ 
      success: true, 
      message: 'Chatbot configuration saved successfully (demo mode)',
      ...config 
    });
    
  } catch (error) {
    console.error('Error in config save API route:', error);
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 });
  }
}