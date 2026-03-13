'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin'

export const dynamic = 'force-dynamic'
import ConfirmationModal from '@/components/ConfirmationModal'
import { useConfirmation } from '@/lib/hooks/useConfirmation'

interface Property {
  id: string
  name: string
  location: string
  bedCount: number
  bathroomCount: number
  guestCapacity: number
  status: string
  slug: string
  thumbnailUrl: string
  amenities: string[]
}

const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const confirmation = useConfirmation()

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/properties')
      if (response.ok) {
        const data = await response.json()
        setProperties(data.map((p: any) => ({
          ...p,
          status: p.status || 'PUBLISHED'
        })))
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

  const handleDelete = async (propertyId: string, propertyName: string) => {
    confirmation.showConfirmation(
      {
        title: 'Delete Property',
        message: `Are you sure you want to delete "${propertyName}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger',
      },
      async () => {
        const response = await fetch(`/api/properties/${propertyId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setProperties(prev => prev.filter(p => p.id !== propertyId))
        } else {
          throw new Error('Failed to delete property')
        }
      }
    )
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
          <Link
            href="/admin/properties/new"
            className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            Add New Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Properties Yet</h2>
            <p className="text-gray-600 mb-6">
              Create your first property to start showcasing your rental business.
            </p>
            <Link
              href="/admin/properties/new"
              className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              Create Your First Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Property Image */}
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={property.thumbnailUrl}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {property.status}
                    </span>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {property.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{property.location}</p>
                  
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>{property.bedCount} bed{property.bedCount !== 1 ? 's' : ''}</span>
                    <span>{property.bathroomCount} bath{property.bathroomCount !== 1 ? 's' : ''}</span>
                    <span>{property.guestCapacity} guest{property.guestCapacity !== 1 ? 's' : ''}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="flex-1 px-4 py-2 bg-brand-600 text-white text-center rounded hover:bg-brand-700 transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/calendar?property=${property.id}`}
                      className="flex-1 px-4 py-2 bg-green-500 text-white text-center rounded hover:bg-green-600 transition-colors"
                    >
                      Calendar
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id, property.name)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>

                  {/* View Property Link */}
                  <div className="mt-3">
                    <Link
                      href={`/properties/${property.slug}`}
                      target="_blank"
                      className="text-sm text-brand-600 hover:text-brand-800 flex items-center gap-1"
                    >
                      View Public Page
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {properties.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-600">{properties.length}</div>
                <div className="text-sm text-gray-600">Total Properties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {properties.filter(p => p.status === 'PUBLISHED').length}
                </div>
                <div className="text-sm text-gray-600">Published</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {properties.filter(p => p.status !== 'PUBLISHED').length}
                </div>
                <div className="text-sm text-gray-600">Draft</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">Total Inquiries</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={confirmation.hideConfirmation}
        onConfirm={confirmation.handleConfirm}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        type={confirmation.type}
        loading={confirmation.loading}
      />
    </AdminLayout>
  )
}

export default PropertiesPage