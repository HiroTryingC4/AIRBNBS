import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create a demo user
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

  console.log('👤 Created demo user:', user.email)

  // Create a demo property
  const property = await prisma.property.upsert({
    where: { slug: 'evangelinas-staycation-studio' },
    update: {},
    create: {
      name: 'Evangelina\'s Staycation - Cozy Studio Unit',
      description: 'A beautiful and cozy studio unit perfect for couples or solo travelers. Located in the heart of Quezon City with easy access to shopping centers, restaurants, and public transportation.',
      location: 'Trees Residences, Quezon City',
      bedCount: 1,
      bathroomCount: 1,
      guestCapacity: 2,
      pricePerNight: 2500,
      extraPersonPrice: 500,
      propertyType: 'studio',
      amenities: JSON.stringify(['WiFi', 'Air Conditioning', 'Smart TV', 'Kitchen', 'Swimming Pool Access', 'Gym Access']),
      slug: 'evangelinas-staycation-studio',
      latitude: 14.6760,
      longitude: 121.0437,
      status: 'PUBLISHED',
      ownerId: user.id,
    },
  })

  console.log('🏠 Created demo property:', property.name)

  // Create sample media for the property
  const mediaItems = [
    {
      type: 'IMAGE' as const,
      url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop',
      displayOrder: 0,
    },
    {
      type: 'IMAGE' as const,
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
      displayOrder: 1,
    },
    {
      type: 'IMAGE' as const,
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
      displayOrder: 2,
    },
  ]

  for (const media of mediaItems) {
    await prisma.propertyMedia.create({
      data: {
        ...media,
        propertyId: property.id,
      }
    })
  }

  console.log('📸 Created demo media items')

  // Create sample availability (next 3 months)
  const today = new Date()
  const availabilityData = []
  
  for (let i = 0; i < 90; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    // Randomly mark some dates as booked (about 30% of dates)
    const isBooked = Math.random() < 0.3
    
    availabilityData.push({
      propertyId: property.id,
      date,
      status: isBooked ? 'BOOKED' : 'AVAILABLE',
    })
  }

  for (const availability of availabilityData) {
    await prisma.availability.create({
      data: availability,
    })
  }

  console.log('📅 Created demo availability data')

  // Create sample attractions
  const attractions = [
    {
      name: 'SM North EDSA',
      description: 'Large shopping mall with restaurants, shops, and entertainment',
      distance: '0.5 km',
      category: 'shopping',
    },
    {
      name: 'Quezon Memorial Circle',
      description: 'Historic park and monument with jogging paths and recreational areas',
      distance: '2 km',
      category: 'tourist_destination',
    },
    {
      name: 'Jollibee Quezon Avenue',
      description: 'Popular Filipino fast food chain',
      distance: '0.3 km',
      category: 'restaurant',
    },
  ]

  for (const attraction of attractions) {
    await prisma.attraction.create({
      data: {
        ...attraction,
        propertyId: property.id,
      },
    })
  }

  console.log('🎯 Created demo attractions')

  // Create sample reviews
  const reviews = [
    {
      guestName: 'Maria Santos',
      rating: 5,
      comment: 'Amazing place! Very clean and comfortable. The location is perfect with easy access to everything.',
      date: new Date('2024-01-15'),
    },
    {
      guestName: 'John Smith',
      rating: 4,
      comment: 'Great studio unit with all the amenities needed. The pool and gym access were a nice bonus.',
      date: new Date('2024-02-20'),
    },
    {
      guestName: 'Lisa Chen',
      rating: 5,
      comment: 'Highly recommend! The host was very responsive and the place exceeded our expectations.',
      date: new Date('2024-03-10'),
    },
  ]

  for (const review of reviews) {
    await prisma.review.create({
      data: {
        ...review,
        propertyId: property.id,
      },
    })
  }

  console.log('⭐ Created demo reviews')

  // Create a sample inquiry
  await prisma.inquiry.create({
    data: {
      guestName: 'Sarah Johnson',
      guestEmail: 'sarah.johnson@example.com',
      checkInDate: new Date('2024-04-15'),
      checkOutDate: new Date('2024-04-18'),
      guestCount: 2,
      message: 'Hi! I would like to book your studio for a weekend getaway. Is it available for the dates mentioned?',
      status: 'UNREAD',
      propertyId: property.id,
    },
  })

  console.log('💬 Created demo inquiry')

  console.log('✅ Database seed completed successfully!')
  console.log('\n📋 Demo credentials:')
  console.log('Email: demo@example.com')
  console.log('Password: demo123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })