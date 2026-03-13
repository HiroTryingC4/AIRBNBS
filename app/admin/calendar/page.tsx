'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout, CalendarManager } from '@/components/admin'

export const dynamic = 'force-dynamic'

interface Property {
  id: string
  name: string
  slug: string
  status: string
}

const CalendarPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      if (response.ok) {
        const data = await response.json()
        setProperties(data.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          status: p.status || 'PUBLISHED'
        })))
        if (data.length > 0) {
          setSelectedProperty(data[0])
        }
      } else {
        console.error('Failed to load properties')
        setProperties([])
      }
    } catch (error) {
      console.error('Error loading properties:', error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      </AdminLayout>
    )
  }

  if (properties.length === 0) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Properties Found</h2>
          <p className="text-gray-600 mb-6">
            You need to create a property before you can manage its calendar.
          </p>
          <button
            onClick={() => router.push('/admin/properties/new')}
            className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
          >
            Create Your First Property
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Calendar Management</h1>
        </div>

        {/* Property Selector */}
        {properties.length > 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Select Property</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((property) => (
                <button
                  key={property.id}
                  onClick={() => setSelectedProperty(property)}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedProperty?.id === property.id
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{property.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Status: <span className={`capitalize ${
                      property.status === 'PUBLISHED' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {property.status.toLowerCase()}
                    </span>
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Calendar Manager */}
        {selectedProperty && (
          <CalendarManager 
            propertyId={selectedProperty.id}
            propertyName={selectedProperty.name}
          />
        )}

        {/* Calendar Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-3">Calendar Management Tips</h2>
          <ul className="space-y-2 text-yellow-700">
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span><strong>Available:</strong> Dates when guests can book your property</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span><strong>Booked:</strong> Dates that are already reserved by guests</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span><strong>Blocked:</strong> Dates when you don't want to accept bookings</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span>Click individual dates to select them, then use action buttons</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span>Select multiple dates to update them all at once</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}

export default CalendarPage