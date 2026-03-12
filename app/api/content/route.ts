import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In-memory storage for content (in production, use database)
let contentStore: Record<string, any> = {
  hero: {
    title: 'Welcome to Evangelina\'s',
    subtitle: 'Staycation at Urban Deca Towers Cubao',
    backgroundImage: '/images/hero-bg.jpg',
  },
  about: {
    title: 'About Our Properties',
    description: 'We offer premium accommodations with exceptional service and amenities. Our properties are located in the heart of the city, providing easy access to attractions, restaurants, and entertainment.',
    features: [
      'Prime locations',
      'Modern amenities',
      '24/7 support',
      'Flexible booking'
    ]
  },
  contact: {
    phone: '09760016381',
    email: 'info@propertyshowcase.com',
    address: 'Urban Deca Towers, Cubao, Quezon City',
    hours: 'Available 24/7'
  },
  footer: {
    companyName: 'Evangelina\'s Staycation',
    description: 'Your trusted partner for premium accommodations in Cubao',
    socialLinks: {
      facebook: 'https://facebook.com/evangelinasstaycation',
      instagram: 'https://instagram.com/evangelinasstaycation',
      twitter: 'https://twitter.com/evangelinasstaycation'
    }
  }
};

// GET /api/content - Get all content or specific section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    const response = section 
      ? NextResponse.json(contentStore[section] || {})
      : NextResponse.json(contentStore);

    // Prevent caching to ensure fresh content
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// PUT /api/content - Update content section
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!(session as any)?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { section, content } = await request.json();

    if (!section || !content) {
      return NextResponse.json(
        { error: 'Section and content are required' },
        { status: 400 }
      );
    }

    // Update the content store
    contentStore[section] = content;

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      section,
      content
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}
