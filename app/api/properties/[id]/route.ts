import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/properties/[id] - Get single property by id or slug
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id
    const isSlug = !propertyId.startsWith('c')

    const property = await prisma.property.findUnique({
      where: isSlug ? { slug: propertyId } : { id: propertyId },
      include: {
        media: { orderBy: { displayOrder: 'asc' } },
        availability: { where: { date: { gte: new Date() } }, orderBy: { date: 'asc' } },
        reviews: { orderBy: { date: 'desc' } },
        owner: { select: { id: true, name: true, email: true } }
      }
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // hide unpublished property for non-owners
    const session = await getServerSession(authOptions)
    const isOwner = !!(session as any)?.user?.id && property.ownerId === (session as any).user.id
    if (!isOwner && property.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const averageRating = property.reviews.length > 0
      ? property.reviews.reduce((s, r) => s + r.rating, 0) / property.reviews.length
      : null

    return NextResponse.json({ ...property, averageRating, reviewCount: property.reviews.length })
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 })
  }
}

// PUT /api/properties/[id] - Update property (owner only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!(session as any)?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const propertyId = params.id
    const body = await request.json()

    const existingProperty = await prisma.property.findUnique({ where: { id: propertyId } })
    if (!existingProperty || existingProperty.ownerId !== (session as any).user.id) {
      return NextResponse.json({ error: 'Property not found or unauthorized' }, { status: 404 })
    }

    const {
      name, description, location, bedCount, bathroomCount, guestCapacity,
      amenities, latitude, longitude, status
    } = body

    let slug = existingProperty.slug
    if (name && name !== existingProperty.name) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const slugExists = await prisma.property.findFirst({ where: { slug, id: { not: propertyId } } })
      if (slugExists) slug = `${slug}-${Date.now()}`
    }

    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(location && { location }),
        ...(bedCount !== undefined && { bedCount: Number(bedCount) }),
        ...(bathroomCount !== undefined && { bathroomCount: Number(bathroomCount) }),
        ...(guestCapacity !== undefined && { guestCapacity: Number(guestCapacity) }),
        ...(amenities !== undefined && { amenities: Array.isArray(amenities) ? JSON.stringify(amenities) : JSON.stringify([]) }),
        ...(latitude !== undefined && { latitude: latitude ? Number(latitude) : null }),
        ...(longitude !== undefined && { longitude: longitude ? Number(longitude) : null }),
        ...(status && { status }),
        slug
      },
      include: { media: { orderBy: { displayOrder: 'asc' } } }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 })
  }
}

// DELETE /api/properties/[id] - Delete property (owner only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!(session as any)?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const propertyId = params.id
    const existingProperty = await prisma.property.findUnique({ where: { id: propertyId } })
    if (!existingProperty || existingProperty.ownerId !== (session as any).user.id) {
      return NextResponse.json({ error: 'Property not found or unauthorized' }, { status: 404 })
    }

    await prisma.property.delete({ where: { id: propertyId } })
    return NextResponse.json({ message: 'Property deleted successfully' })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 })
  }
}
