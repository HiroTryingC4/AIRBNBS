import { Property, PropertyMedia, Availability, Inquiry, Review, Attraction, User } from '@prisma/client'

// Extended types with relations
export type PropertyWithDetails = Property & {
  media: PropertyMedia[]
  availability?: Availability[]
  attractions?: Attraction[]
  reviews?: Review[]
  owner?: Pick<User, 'name' | 'email'>
  averageRating?: number | null
  reviewCount?: number
  _count?: {
    inquiries: number
    reviews: number
  }
}

export type InquiryWithProperty = Inquiry & {
  property: Pick<Property, 'name' | 'slug'>
}

// API Response types
export type ApiResponse<T> = {
  data?: T
  error?: string
  message?: string
}

// Form data types
export type PropertyFormData = {
  name: string
  description?: string
  location: string
  bedCount: number
  bathroomCount: number
  guestCapacity: number
  amenities: string[]
  latitude?: number
  longitude?: number
  status?: 'PUBLISHED' | 'UNPUBLISHED' | 'DRAFT'
}

export type InquiryFormData = {
  guestName: string
  guestEmail: string
  checkInDate?: string
  checkOutDate?: string
  guestCount?: number
  message: string
}

export type ContactFormData = {
  name: string
  email: string
  message: string
}

export type RegisterFormData = {
  name: string
  email: string
  password: string
}

// Filter types
export type PropertyFilters = {
  location?: string
  minBeds?: number
  amenities?: string[]
  status?: 'PUBLISHED' | 'UNPUBLISHED' | 'DRAFT'
}

// Availability types
export type AvailabilityUpdate = {
  dates: string[]
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED'
}

export type AvailabilityBulkUpdate = {
  startDate: string
  endDate: string
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED'
}