// Mock data for development and testing

export const mockProperties = [
  {
    id: '1',
    name: 'Moonplace - Cozy Studio Unit',
    location: 'Trees Residences, Quezon City',
    bedCount: 1,
    bathroomCount: 1,
    guestCapacity: 2,
    thumbnailUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    amenities: ['WiFi', 'Air Conditioning', 'Smart TV', 'Kitchen', 'Swimming Pool Access', 'Gym Access'],
    slug: 'moonplace-studio',
    latitude: 14.6760,
    longitude: 121.0437,
  },
];

export type MockProperty = typeof mockProperties[0];

// Mock media data for PropertyGallery
export const mockMediaGallery = [
  {
    id: '1',
    mediaType: 'IMAGE' as const,
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=150&fit=crop',
    displayOrder: 0,
  },
  {
    id: '2',
    mediaType: 'IMAGE' as const,
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=150&fit=crop',
    displayOrder: 1,
  },
  {
    id: '3',
    mediaType: 'IMAGE' as const,
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&h=150&fit=crop',
    displayOrder: 2,
  },
  {
    id: '4',
    mediaType: 'VIDEO' as const,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    displayOrder: 3,
  },
  {
    id: '5',
    mediaType: 'IMAGE' as const,
    url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=200&h=150&fit=crop',
    displayOrder: 4,
  },
  {
    id: '6',
    mediaType: 'IMAGE' as const,
    url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&h=150&fit=crop',
    displayOrder: 5,
  },
  {
    id: '7',
    mediaType: 'VIDEO' as const,
    url: 'https://vimeo.com/148751763',
    displayOrder: 6,
  },
  {
    id: '8',
    mediaType: 'IMAGE' as const,
    url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=200&h=150&fit=crop',
    displayOrder: 7,
  },
  {
    id: '9',
    mediaType: 'IMAGE' as const,
    url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=200&h=150&fit=crop',
    displayOrder: 8,
  },
  {
    id: '10',
    mediaType: 'IMAGE' as const,
    url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200&h=150&fit=crop',
    displayOrder: 9,
  },
  {
    id: '11',
    mediaType: 'IMAGE' as const,
    url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=200&h=150&fit=crop',
    displayOrder: 10,
  },
  {
    id: '12',
    mediaType: 'IMAGE' as const,
    url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200&h=150&fit=crop',
    displayOrder: 11,
  },
];

export type MockMediaItem = typeof mockMediaGallery[0];

// Mock availability data for AvailabilityCalendar
export const mockAvailabilityData = (() => {
  const data: Array<{ date: string; status: 'AVAILABLE' | 'BOOKED' }> = [];
  const today = new Date();
  
  // Generate 12 months of availability data
  for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
    const year = today.getFullYear();
    const month = today.getMonth() + monthOffset;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      
      // Skip past dates
      if (date < today) continue;
      
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      // Randomly mark some dates as booked (about 30% of dates)
      const isBooked = Math.random() < 0.3;
      
      data.push({
        date: dateStr,
        status: isBooked ? 'BOOKED' : 'AVAILABLE',
      });
    }
  }
  
  return data;
})();

export type MockAvailabilityData = typeof mockAvailabilityData[0];
