import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/properties/[id]/availability - Get property availability
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    const whereClause: any = { propertyId }
    
    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } else {
      // Default to next 12 months
      const today = new Date()
      const nextYear = new Date()
      nextYear.setFullYear(today.getFullYear() + 1)
      
      whereClause.date = {
        gte: today,
        lte: nextYear
      }
    }
    
    const availability = await prisma.availability.findMany({
      where: whereClause,
      orderBy: { date: 'asc' }
    })
    
    return NextResponse.json(availability)
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}

// POST /api/properties/[id]/availability - Update availability (owner only)
export async function POST(
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
    
    const { dates, status } = await request.json()
    
    if (!Array.isArray(dates) || !status) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }
    
    // Upsert availability for each date
    const upsertPromises = dates.map((dateStr: string) =>
      prisma.availability.upsert({
        where: {
          propertyId_date: {
            propertyId,
            date: new Date(dateStr)
          }
        },
        update: { status },
        create: {
          propertyId,
          date: new Date(dateStr),
          status
        }
      })
    )
    
    const updatedAvailability = await Promise.all(upsertPromises)
    
    return NextResponse.json(updatedAvailability)
  } catch (error) {
    console.error('Error updating availability:', error)
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    )
  }
}

// PUT /api/properties/[id]/availability - Bulk update availability (owner only)
export async function PUT(
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
    
    const { startDate, endDate, status } = await request.json()
    
    if (!startDate || !endDate || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Generate array of dates between startDate and endDate
    const dates = []
    const currentDate = new Date(startDate)
    const end = new Date(endDate)
    
    while (currentDate <= end) {
      dates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    // Upsert availability for each date
    const upsertPromises = dates.map((date) =>
      prisma.availability.upsert({
        where: {
          propertyId_date: {
            propertyId,
            date
          }
        },
        update: { status },
        create: {
          propertyId,
          date,
          status
        }
      })
    )
    
    const updatedAvailability = await Promise.all(upsertPromises)
    
    return NextResponse.json(updatedAvailability)
  } catch (error) {
    console.error('Error bulk updating availability:', error)
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    )
  }
}