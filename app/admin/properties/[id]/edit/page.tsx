"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AdminLayout, ImageUpload, LocationPicker } from '@/components/admin'

interface ImageFile {
	id: string
	file: File
	preview: string
	uploading?: boolean
}

export default function EditPropertyPage() {
	const router = useRouter()
	const params = useParams() as { id?: string }
	const propertyId = params?.id

	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [existingMedia, setExistingMedia] = useState<Array<{ id: string; url: string }>>([])
	const [images, setImages] = useState<ImageFile[]>([])
	const [formData, setFormData] = useState<any>({
		name: '',
		location: '',
		description: '',
		bedCount: 1,
		bathroomCount: 1,
		guestCapacity: 2,
		propertyType: 'Apartment',
		amenities: [] as string[],
		pricePerNight: 0,
		extraPersonPrice: 0,
		latitude: 14.6760,
		longitude: 121.0437,
		status: 'DRAFT'
	})

	useEffect(() => {
		if (!propertyId) return
		const fetchProperty = async () => {
			setLoading(true)
			try {
				const res = await fetch(`/api/properties/${propertyId}`)
				if (!res.ok) throw new Error('Failed to fetch property')
				const data = await res.json()
				setFormData({
					name: data.name || '',
					location: data.location || '',
					description: data.description || '',
					bedCount: data.bedCount || 1,
					bathroomCount: data.bathroomCount || 1,
					guestCapacity: data.guestCapacity || 2,
					propertyType: data.propertyType || 'Apartment',
					amenities: typeof data.amenities === 'string' ? JSON.parse(data.amenities || '[]') : (data.amenities || []),
					pricePerNight: data.pricePerNight || 0,
					extraPersonPrice: data.extraPersonPrice || 0,
					latitude: data.latitude ?? 14.6760,
					longitude: data.longitude ?? 121.0437,
					status: data.status || 'DRAFT'
				})
				if (Array.isArray(data.media)) setExistingMedia(data.media.map((m: any) => ({ id: m.id, url: m.url })))
			} catch (err) {
				console.error(err)
			} finally {
				setLoading(false)
			}
		}
		fetchProperty()
	}, [propertyId])

	const handleChange = (e: any) => {
		const { name, value } = e.target
		setFormData((p: any) => ({ ...p, [name]: value }))
	}

	const handleAmenityToggle = (amenity: string) => {
		setFormData((p: any) => ({
			...p,
			amenities: p.amenities.includes(amenity) ? p.amenities.filter((a: string) => a !== amenity) : [...p.amenities, amenity]
		}))
	}

	const handleLocationChange = (lat: number, lng: number, address?: string) => {
		setFormData((p: any) => ({ ...p, latitude: lat, longitude: lng, location: address || p.location }))
	}

	const uploadImages = async (id: string) => {
		for (const image of images) {
			if (image.file) {
				const fd = new FormData()
				fd.append('file', image.file)
				fd.append('mediaType', 'IMAGE')
				const res = await fetch(`/api/properties/${id}/media`, { method: 'POST', body: fd })
				if (!res.ok) throw new Error('Failed to upload image')
			}
		}
	}

	const deleteMedia = async (mediaId: string) => {
		if (!propertyId) return
		try {
			const res = await fetch(`/api/properties/${propertyId}/media/${mediaId}`, { method: 'DELETE' })
			if (!res.ok) throw new Error('Delete failed')
			setExistingMedia(prev => prev.filter(m => m.id !== mediaId))
		} catch (err) {
			console.error(err)
			alert('Failed to delete media')
		}
	}

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		if (!propertyId) return
		setSaving(true)
		try {
			const res = await fetch(`/api/properties/${propertyId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...formData })
			})
			if (!res.ok) {
				const err = await res.json().catch(() => ({}))
				throw new Error(err.error || 'Update failed')
			}
			const updated = await res.json()
			if (images.length > 0) await uploadImages(updated.id || propertyId)
			router.push('/admin/properties')
		} catch (err) {
			console.error(err)
			alert('Failed to update property')
		} finally {
			setSaving(false)
		}
	}

	if (loading) return (
		<AdminLayout>
			<div className="p-8">Loading...</div>
		</AdminLayout>
	)

	const commonAmenities = [
		'WiFi', 'Air Conditioning', 'Kitchen', 'Swimming Pool', 'Free Parking',
		'Gym Access', 'Beach Access', 'Garden', 'BBQ Area', 'Fireplace'
	]

	return (
		<AdminLayout>
			<div className="max-w-4xl mx-auto p-6">
				<h1 className="text-2xl font-bold mb-4">Edit Property</h1>
				<form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
					<div>
						<label className="block text-sm font-medium text-gray-700">Name</label>
						<input name="name" value={formData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">Location</label>
						<input name="location" value={formData.location} onChange={handleChange} className="w-full border rounded px-3 py-2" />
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">Description</label>
						<textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={4} />
					</div>

					<div className="grid grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">Bedrooms</label>
							<input type="number" name="bedCount" value={formData.bedCount} onChange={handleChange} className="w-full border rounded px-3 py-2" />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Bathrooms</label>
							<input type="number" name="bathroomCount" value={formData.bathroomCount} onChange={handleChange} className="w-full border rounded px-3 py-2" />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Max Guests</label>
							<input type="number" name="guestCapacity" value={formData.guestCapacity} onChange={handleChange} className="w-full border rounded px-3 py-2" />
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">Amenities</label>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
							{commonAmenities.map(a => (
								<label key={a} className="flex items-center gap-2">
									<input type="checkbox" checked={formData.amenities.includes(a)} onChange={() => handleAmenityToggle(a)} />
									<span>{a}</span>
								</label>
							))}
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">Location Picker</label>
						<LocationPicker latitude={formData.latitude} longitude={formData.longitude} onLocationChange={handleLocationChange} height="300px" />
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">Existing Images</label>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							{existingMedia.map((m) => (
								<div key={m.id} className="relative bg-gray-100 rounded overflow-hidden aspect-video">
									<img src={m.url} className="object-cover w-full h-full" alt="media" />
									<button type="button" onClick={() => deleteMedia(m.id)} className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">Delete</button>
								</div>
							))}
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">Upload New Images</label>
						<ImageUpload images={images} onImagesChange={setImages} maxImages={15} maxFileSize={10} />
					</div>

					<div className="flex gap-3">
						<button type="button" onClick={() => router.back()} className="px-4 py-2 border">Cancel</button>
						<button type="submit" disabled={saving} className="px-4 py-2 bg-brand-600 text-white rounded">{saving ? 'Saving...' : 'Save Changes'}</button>
					</div>
				</form>
			</div>
		</AdminLayout>
	)
}

