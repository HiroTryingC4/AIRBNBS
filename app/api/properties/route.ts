import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/properties - Get all published properties (public) or user's properties (authenticated)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    
    // If authenticated, return user's properties
    if ((session as any)?.user?.id) {
      const properties = await prisma.property.findMany({
        where: {
                ownerId: (session as any).user.id
        },
        include: {
          media: {
            orderBy: { displayOrder: 'asc' }
          },
          _count: {
            select: {
              inquiries: true,
              reviews: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      
      return NextResponse.json(properties)
    }
    
    // Public endpoint - only return published properties
    const properties = await prisma.property.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        media: {
          where: { displayOrder: 0 }, // Only thumbnail for listing
          take: 1
        },
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // Calculate average ratings
    const propertiesWithRatings = properties.map(property => ({
      ...property,
      averageRating: property.reviews.length > 0 
        ? property.reviews.reduce((sum, review) => sum + review.rating, 0) / property.reviews.length
        : null,
      reviewCount: property.reviews.length
    }))
    
    return NextResponse.json(propertiesWithRatings)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

// POST /api/properties - Create new property (authenticated only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!(session as any)?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const data = await request.json()
    const {
      name,
      description,
      location,
      bedCount,
      bathroomCount,
      guestCapacity,
      pricePerNight,
      extraPersonPrice,
      propertyType,
      amenities,
      latitude,
      longitude,
      status = 'DRAFT'
    } = data
    
    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    // Check if slug already exists
    const existingProperty = await prisma.property.findUnique({
      where: { slug }
    })
    
    if (existingProperty) {
      return NextResponse.json(
        { error: 'A property with this name already exists' },
        { status: 400 }
      )
    }
    
    // Create property
    const property = await prisma.property.create({
      data: {
        name,
        description,
        location,
        bedCount: parseInt(bedCount),
        bathroomCount: parseInt(bathroomCount),
        guestCapacity: parseInt(guestCapacity),
        pricePerNight: parseFloat(pricePerNight),
        extraPersonPrice: extraPersonPrice ? parseFloat(extraPersonPrice) : 0,
        propertyType: propertyType || 'Apartment',
        amenities: JSON.stringify(amenities || []),
        slug,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        status,
        ownerId: (session as any).user.id
      }
    })
    
    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
}