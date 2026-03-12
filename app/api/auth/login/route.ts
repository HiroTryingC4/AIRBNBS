import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // For now, accept any email/password combination
    // In a real app, you would validate against a database
    if (email && password) {
      // You would typically:
      // 1. Hash the password and compare with stored hash
      // 2. Create a JWT token or session
      // 3. Set authentication cookies
      
      return NextResponse.json(
        { 
          message: 'Login successful',
          user: {
            email,
            name: 'Admin User'
          }
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}