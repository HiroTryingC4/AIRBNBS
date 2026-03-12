'use client'

import React, { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin'
import Image from 'next/image'

interface Property {
  id: string
  name: string
  slug: string
  media: MediaItem[]
}

interface MediaItem {
  id: string
  mediaType: 'IMAGE' | 'VIDEO'
  url: string
  displayOrder: number
  propertyId: string
}

export default function AdminGalleryPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [uploading, setUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadPropertyId, setUploadPropertyId] = useState<string>('')

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/properties')
      if (response.ok) {
        const data = await response.json()
        setProperties(data.map((property: any) => ({
          id: property.id,
          name: property.name,
          slug: property.slug,
          media: property.media || []
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

  const handleDelete = async (propertyId: string, mediaId: string, mediaType: string) => {
    if (!confirm(`Are you sure you want to delete this ${mediaType.toLowerCase()}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/properties/${propertyId}/media/${mediaId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await loadProperties()
        alert('Media deleted successfully!')
      } else {
        throw new Error('Failed to delete media')
      }
    } catch (error) {
      console.error('Error deleting media:', error)
      alert('Failed to delete media.')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !uploadPropertyId) return

    setUploading(true)
    try {
      let successCount = 0
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not a valid image file`)
          continue
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name} is too large. Maximum size is 10MB`)
          continue
        }

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(`/api/properties/${uploadPropertyId}/media`, {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          successCount++
        } else {
          console.error(`Failed to upload ${file.name}`)
        }
      }
      
      await loadProperties()
      setShowUploadModal(false)
      setUploadPropertyId('')
      alert(`Successfully uploaded ${successCount} photo(s)!`)
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Failed to upload some images. Please try again.')
    } finally {
      setUploading(false)
      // Reset file input
      e.target.value = ''
    }
  }

  const openUploadModal = (propertyId?: string) => {
    if (propertyId) {
      setUploadPropertyId(propertyId)
    } else if (properties.length > 0) {
      setUploadPropertyId(properties[0].id)
    }
    setShowUploadModal(true)
  }

  // Filter media based on selected property
  const filteredProperties = selectedProperty === 'all' 
    ? properties 
    : properties.filter(p => p.id === selectedProperty)

  // Get all media items
  const allMedia = filteredProperties.flatMap(property => 
    (property.media || []).map(media => ({
      ...media,
      propertyName: property.name,
      propertySlug: property.slug,
      propertyId: property.id
    }))
  )

  // Count total media
  const totalImages = allMedia.filter(m => m.mediaType === 'IMAGE').length
  const totalVideos = allMedia.filter(m => m.mediaType === 'VIDEO').length

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Management</h1>
          <p className="text-gray-600">
            View and manage all photos and videos across your properties
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-brand-600">{properties.length}</div>
            <div className="text-sm text-gray-600">Properties</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{totalImages}</div>
            <div className="text-sm text-gray-600">Photos</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600">{totalVideos}</div>
            <div className="text-sm text-gray-600">Videos</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-orange-600">{allMedia.length}</div>
            <div className="text-sm text-gray-600">Total Media</div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Property Filter */}
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Property
              </label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
              >
                <option value="all">All Properties ({properties.length})</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name} ({property.media?.length || 0} items)
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Button */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Photos
              </label>
              <button
                onClick={() => openUploadModal(selectedProperty !== 'all' ? selectedProperty : undefined)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload Photos
              </button>
            </div>

            {/* View Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg ${
                    viewMode === 'grid'
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg ${
                    viewMode === 'list'
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upload Photos</h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false)
                    setUploadPropertyId('')
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Property
                </label>
                <select
                  value={uploadPropertyId}
                  onChange={(e) => setUploadPropertyId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                  disabled={uploading}
                >
                  <option value="">Choose a property...</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Photos
                </label>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading || !uploadPropertyId}
                    className="hidden"
                    id="gallery-upload-input"
                  />
                  <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    uploading || !uploadPropertyId
                      ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                      : 'border-brand-300 hover:border-brand-400 hover:bg-brand-50 cursor-pointer'
                  }`}>
                    <div className="text-4xl mb-2">📸</div>
                    {uploading ? (
                      <div>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-2"></div>
                        <span className="text-gray-600">Uploading...</span>
                      </div>
                    ) : !uploadPropertyId ? (
                      <span className="text-gray-500">Select a property first</span>
                    ) : (
                      <div>
                        <span className="text-brand-600 font-medium">Click to choose photos</span>
                        <p className="text-sm text-gray-500 mt-2">
                          JPG, PNG, GIF up to 10MB each
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Hold Ctrl/Cmd to select multiple files
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div className="bg-brand-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-brand-900 mb-2">📌 Note:</h4>
                <p className="text-sm text-brand-800">
                  Photos uploaded here will be visible to all visitors on the property's public page and in the gallery.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Media Display */}
        {allMedia.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No media found</h3>
            <p className="text-gray-600 mb-6">
              {selectedProperty === 'all'
                ? 'Upload photos and videos to your properties to see them here'
                : 'This property has no media yet'}
            </p>
            <a
              href="/admin/properties"
              className="inline-block px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
            >
              Go to Properties
            </a>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allMedia.map((media) => (
              <div key={media.id} className="bg-white rounded-lg shadow overflow-hidden group">
                {/* Media Display */}
                <div className="aspect-video bg-gray-100 relative">
                  {media.mediaType === 'IMAGE' ? (
                    <Image
                      src={media.url}
                      alt={media.propertyName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🎥</div>
                        <div className="text-sm">Video</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                      <a
                        href={`/admin/properties/${media.propertyId}/edit`}
                        className="p-2 bg-brand-500 text-white rounded-full shadow-lg hover:bg-brand-600"
                        title="Edit property"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </a>
                      <button
                        onClick={() => handleDelete(media.propertyId, media.id, media.mediaType)}
                        className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Media Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {media.propertyName}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      {media.mediaType === 'IMAGE' ? '📷' : '🎥'} {media.mediaType}
                    </span>
                    <span>#{media.displayOrder + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allMedia.map((media) => (
                  <tr key={media.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden relative">
                        {media.mediaType === 'IMAGE' ? (
                          <Image
                            src={media.url}
                            alt={media.propertyName}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🎥
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{media.propertyName}</div>
                      <div className="text-sm text-gray-500">{media.propertySlug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        media.mediaType === 'IMAGE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {media.mediaType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{media.displayOrder + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a
                        href={`/admin/properties/${media.propertyId}/edit`}
                        className="text-brand-600 hover:text-brand-900 mr-4"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => handleDelete(media.propertyId, media.id, media.mediaType)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}