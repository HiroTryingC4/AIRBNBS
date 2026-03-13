import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Mock chat sessions for fallback
const mockSessions = [
  {
    sessionId: 'session_demo_1',
    messageCount: 5,
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    guestName: 'John Doe',
    guestEmail: 'john@example.com'
  },
  {
    sessionId: 'session_demo_2',
    messageCount: 3,
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    guestName: null,
    guestEmail: null
  },
  {
    sessionId: 'session_demo_3',
    messageCount: 8,
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    guestName: 'Sarah Wilson',
    guestEmail: 'sarah@example.com'
  }
];

export async function GET(request: NextRequest) {
  try {
    // Try to fetch from backend first
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const authHeader = request.headers.get('Authorization');
    
    try {
      const response = await fetch(`${backendUrl}/api/chatbot/sessions`, {
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
      console.log('Backend not available for sessions, using mock data');
    }
    
    // Return mock sessions if backend is not available
    return NextResponse.json(mockSessions);
    
  } catch (error) {
    console.error('Error in sessions API route:', error);
    return NextResponse.json(mockSessions);
  }
}