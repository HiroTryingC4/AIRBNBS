export const mockProperties = [
  {
    id: '1',
    slug: 'evangelinas-staycation-unit-1',
    name: "Evangelina's Staycation - Unit 1",
    location: 'Urban Deca Towers Cubao, Quezon City',
    bedCount: 1,
    bathroomCount: 1,
    guestCapacity: 4,
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Free Parking', 'City View'],
    thumbnailUrl: '/images/hero/hero1.jpg',
    latitude: 14.6760,
    longitude: 121.0437,
    description: 'Cozy Airbnb unit perfect for your city getaway at Urban Deca Towers Cubao. Contact James at 09760016381 to book your stay.',
    pricePerNight: 2500,
    propertyType: 'Condo',
    status: 'PUBLISHED'
  },
  {
    id: '2',
    slug: 'evangelinas-staycation-unit-2',
    name: "Evangelina's Staycation - Unit 2",
    location: 'Urban Deca Towers Cubao, Quezon City',
    bedCount: 1,
    bathroomCount: 1,
    guestCapacity: 4,
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Free Parking', 'City View'],
    thumbnailUrl: '/images/hero/hero2.jpg',
    latitude: 14.6760,
    longitude: 121.0437,
    description: 'Another cozy Airbnb unit perfect for your city getaway at Urban Deca Towers Cubao. Contact James at 09760016381 to book your stay.',
    pricePerNight: 2500,
    propertyType: 'Condo',
    status: 'PUBLISHED'
  },
]

export const mockMediaGallery = [
  { id: 'm1', url: '/images/interior/room1.jpg', mediaType: 'IMAGE' },
  { id: 'm2', url: '/images/interior/room2.jpg', mediaType: 'IMAGE' },
]

export const mockAvailabilityData = [
  { date: new Date().toISOString().slice(0, 10), available: true },
  { date: new Date(Date.now() + 86400000).toISOString().slice(0, 10), available: false },
]

export default {};
