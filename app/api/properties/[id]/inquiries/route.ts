import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/properties/[id]/inquiries - Get property inquiries (owner only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!(session as any)?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const propertyId = params.id
    
    // Check if user owns the property
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    })
    
      if (!property || property.ownerId !== (session as any).user.id) {
      return NextResponse.json(
        { error: 'Property not found or unauthorized' },
        { status: 404 }
      )
    }
    
    const inquiries = await prisma.inquiry.findMany({
      where: { propertyId },
      include: {
        property: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(inquiries)
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}

// POST /api/properties/[id]/inquiries - Create inquiry (public)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id
    
    // Check if property exists and is published
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    })
    
    if (!property || property.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }
    
    const {
      guestName,
      guestEmail,
      checkInDate,
      checkOutDate,
      guestCount,
      message
    } = await request.json()
    
    // Validate required fields
    if (!guestName || !guestEmail || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(guestEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    const inquiry = await prisma.inquiry.create({
      data: {
        propertyId,
        guestName,
        guestEmail,
        checkInDate: checkInDate ? new Date(checkInDate) : null,
        checkOutDate: checkOutDate ? new Date(checkOutDate) : null,
        guestCount: guestCount ? parseInt(guestCount) : null,
        message,
        status: 'UNREAD'
      },
      include: {
        property: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    })
    
    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}