import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('Database connected successfully')
    
    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 12)
    
    const user = await prisma.user.upsert({
      where: { email: 'demo@example.com' },
      update: {},
      create: {
        email: 'demo@example.com',
        name: 'Demo Property Owner',
        password: hashedPassword,
      },
    })

    // Create sample property
    const property = await prisma.property.upsert({
      where: { slug: 'evangelinas-staycation-studio' },
      update: {},
      create: {
        name: 'Evangelina\'s Staycation - Cozy Studio Unit',
        description: 'A beautiful and cozy studio unit perfect for couples or solo travelers.',
        location: 'Trees Residences, Quezon City',
        bedCount: 1,
        bathroomCount: 1,
        guestCapacity: 2,
        pricePerNight: 2500,
        extraPersonPrice: 500,
        propertyType: 'studio',
        amenities: JSON.stringify(['WiFi', 'Air Conditioning', 'Smart TV', 'Kitchen']),
        slug: 'evangelinas-staycation-studio',
        latitude: 14.6760,
        longitude: 121.0437,
        status: 'PUBLISHED',
        ownerId: user.id,
      },
    })

    return Response.json({ 
      success: true, 
      message: 'Database initialized successfully',
      user: user.email,
      property: property.name
    })
  } catch (error) {
    console.error('Database setup error:', error)
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}