"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import ImageUpload from '@/components/admin/ImageUpload'
import LocationPicker from '@/components/admin/LocationPicker'

interface ImageFile {
id: string
file: File
preview: string
uploading?: boolean
}

export default function NewPropertyPage() {
const router = useRouter()
const [saving, setSaving] = useState(false)
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

const handleSubmit = async (e: any) => {
e.preventDefault()
setSaving(true)
try {
const res = await fetch('/api/properties', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ ...formData })
})
if (!res.ok) {
const err = await res.json().catch(() => ({}))
throw new Error(err.error || 'Create failed')
}
const created = await res.json()
router.push('/admin/properties')
} catch (err) {
console.error(err)
alert('Failed to create property: ' + (err as Error).message)
} finally {
setSaving(false)
}
}

const commonAmenities = [
'WiFi', 'Air Conditioning', 'Kitchen', 'Swimming Pool', 'Free Parking',
'Gym Access', 'Beach Access', 'Garden', 'BBQ Area', 'Fireplace'
]

return (
<AdminLayout>
<div className="max-w-4xl mx-auto p-6">
<h1 className="text-2xl font-bold mb-4">Add New Property</h1>
<form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
<div>
<label className="block text-sm font-medium text-gray-700">Name</label>
<input name="name" value={formData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
</div>

<div>
<label className="block text-sm font-medium text-gray-700">Location</label>
<input name="location" value={formData.location} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
</div>

<div>
<label className="block text-sm font-medium text-gray-700">Description</label>
<textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={4} required />
</div>

<div className="grid grid-cols-3 gap-4">
<div>
<label className="block text-sm font-medium text-gray-700">Bedrooms</label>
<input type="number" name="bedCount" value={formData.bedCount} onChange={handleChange} className="w-full border rounded px-3 py-2" min="1" required />
</div>
<div>
<label className="block text-sm font-medium text-gray-700">Bathrooms</label>
<input type="number" name="bathroomCount" value={formData.bathroomCount} onChange={handleChange} className="w-full border rounded px-3 py-2" min="1" required />
</div>
<div>
<label className="block text-sm font-medium text-gray-700">Max Guests</label>
<input type="number" name="guestCapacity" value={formData.guestCapacity} onChange={handleChange} className="w-full border rounded px-3 py-2" min="1" required />
</div>
</div>

<div className="grid grid-cols-2 gap-4">
<div>
<label className="block text-sm font-medium text-gray-700">Price per Night (₱)</label>
<input type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleChange} className="w-full border rounded px-3 py-2" min="0" required />
</div>
<div>
<label className="block text-sm font-medium text-gray-700">Extra Person Price (₱)</label>
<input type="number" name="extraPersonPrice" value={formData.extraPersonPrice} onChange={handleChange} className="w-full border rounded px-3 py-2" min="0" />
</div>
</div>

<div>
<label className="block text-sm font-medium text-gray-700">Property Type</label>
<select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full border rounded px-3 py-2">
<option value="Apartment">Apartment</option>
<option value="House">House</option>
<option value="Villa">Villa</option>
<option value="Condo">Condo</option>
<option value="Studio">Studio</option>
</select>
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

<div className="flex gap-3">
<button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
<button type="submit" disabled={saving} className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700 disabled:opacity-50">{saving ? 'Creating...' : 'Create Property'}</button>
</div>
</form>
</div>
</AdminLayout>
)
}
