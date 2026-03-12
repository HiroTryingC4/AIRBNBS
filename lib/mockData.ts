export const mockProperties = [
  {
    id: '1',
    slug: 'seaside-villa',
    name: "Seaside Villa",
    location: 'Cebu, Philippines',
    bedCount: 3,
    bathroomCount: 2,
    guestCapacity: 6,
    amenities: ['WiFi', 'Kitchen', 'Swimming Pool'],
    thumbnailUrl: '/images/hero/hero1.jpg',
    latitude: 10.3157,
    longitude: 123.8854,
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
