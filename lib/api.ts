import { 
  PropertyWithDetails, 
  InquiryWithProperty, 
  PropertyFormData, 
  InquiryFormData, 
  ContactFormData,
  RegisterFormData,
  AvailabilityUpdate,
  AvailabilityBulkUpdate 
} from './types'

const API_BASE = '/api'

// Generic API client
async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// Properties API
export const propertiesApi = {
  // Get all properties (public or user's properties if authenticated)
  getAll: () => apiClient<PropertyWithDetails[]>('/properties'),
  
  // Get single property by ID or slug
  getById: (id: string) => apiClient<PropertyWithDetails>(`/properties/${id}`),
  
  // Create new property (authenticated)
  create: (data: PropertyFormData) => 
    apiClient<PropertyWithDetails>('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Update property (authenticated)
  update: (id: string, data: Partial<PropertyFormData>) =>
    apiClient<PropertyWithDetails>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Delete property (authenticated)
  delete: (id: string) =>
    apiClient<{ message: string }>(`/properties/${id}`, {
      method: 'DELETE',
    }),
}

// Media API
export const mediaApi = {
  // Get property media
  getByProperty: (propertyId: string) =>
    apiClient<any[]>(`/properties/${propertyId}/media`),
  
  // Upload image
  uploadImage: (propertyId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('mediaType', 'IMAGE')
    
    return apiClient<any>(`/properties/${propertyId}/media`, {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    })
  },
  
  // Add video URL
  addVideo: (propertyId: string, url: string) =>
    apiClient<any>(`/properties/${propertyId}/media`, {
      method: 'POST',
      body: JSON.stringify({ mediaType: 'VIDEO', url }),
    }),
  
  // Reorder media
  reorder: (propertyId: string, mediaOrder: string[]) =>
    apiClient<any[]>(`/properties/${propertyId}/media`, {
      method: 'PUT',
      body: JSON.stringify({ mediaOrder }),
    }),
  
  // Delete media
  delete: (propertyId: string, mediaId: string) =>
    apiClient<{ message: string }>(`/properties/${propertyId}/media/${mediaId}`, {
      method: 'DELETE',
    }),
}

// Availability API
export const availabilityApi = {
  // Get property availability
  getByProperty: (propertyId: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    
    const query = params.toString() ? `?${params.toString()}` : ''
    return apiClient<any[]>(`/properties/${propertyId}/availability${query}`)
  },
  
  // Update specific dates
  updateDates: (propertyId: string, data: AvailabilityUpdate) =>
    apiClient<any[]>(`/properties/${propertyId}/availability`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Bulk update date range
  bulkUpdate: (propertyId: string, data: AvailabilityBulkUpdate) =>
    apiClient<any[]>(`/properties/${propertyId}/availability`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}

// Inquiries API
export const inquiriesApi = {
  // Get all inquiries for authenticated user
  getAll: (status?: string) => {
    const params = status ? `?status=${status}` : ''
    return apiClient<InquiryWithProperty[]>(`/inquiries${params}`)
  },
  
  // Get inquiries for specific property
  getByProperty: (propertyId: string) =>
    apiClient<InquiryWithProperty[]>(`/properties/${propertyId}/inquiries`),
  
  // Create inquiry (public)
  create: (propertyId: string, data: InquiryFormData) =>
    apiClient<InquiryWithProperty>(`/properties/${propertyId}/inquiries`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Update inquiry status
  updateStatus: (id: string, status: string) =>
    apiClient<InquiryWithProperty>(`/inquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  
  // Delete inquiry
  delete: (id: string) =>
    apiClient<{ message: string }>(`/inquiries/${id}`, {
      method: 'DELETE',
    }),
}

// Contact API
export const contactApi = {
  // Get all contact messages (authenticated)
  getAll: () => apiClient<any[]>('/contact'),
  
  // Create contact message (public)
  create: (data: ContactFormData) =>
    apiClient<any>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// Auth API
export const authApi = {
  // Register new user
  register: (data: RegisterFormData) =>
    apiClient<{ message: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}