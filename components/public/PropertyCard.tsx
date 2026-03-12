'use client';

import Link from 'next/link';
import Image from 'next/image';

export interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    location: string;
    bedCount: number;
    bathroomCount: number;
    guestCapacity: number;
    thumbnailUrl: string;
    amenities?: string[];
    slug?: string;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const {
    name,
    location,
    bedCount,
    bathroomCount,
    guestCapacity,
    thumbnailUrl,
    amenities,
    slug,
  } = property;

  // Generate slug from name if not provided
  const propertySlug = slug || (name ? name.toLowerCase().replace(/\s+/g, '-') : 'property');
  const detailUrl = `/properties/${propertySlug}`;

  // Show first 3 amenities as preview with comprehensive safety checks
  const amenitiesPreview = (amenities && Array.isArray(amenities) && amenities.length > 0) 
    ? amenities.slice(0, 3) 
    : [];
  const hasMoreAmenities = (amenities && Array.isArray(amenities) && amenities.length > 3);

  return (
    <Link
      href={detailUrl}
      className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      {/* Property Image */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden bg-gray-200">
        <Image
          src={thumbnailUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb3BlcnR5PC90ZXh0Pjwvc3ZnPg=='}
          alt={`${name || 'Property'} - ${location || 'Location'}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Property Details */}
      <div className="p-4 sm:p-5">
        {/* Property Name */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
          {name || 'Property Name'}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <svg
            className="w-4 h-4 mr-1 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-sm line-clamp-1">{location || 'Location'}</span>
        </div>

        {/* Key Details */}
        <div className="flex items-center gap-4 mb-3 text-gray-700 text-sm">
          {/* Guest Capacity */}
          <div className="flex items-center gap-1" title={`${guestCapacity || 0} guests`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>{guestCapacity || 0}</span>
          </div>

          {/* Bedrooms */}
          <div className="flex items-center gap-1" title={`${bedCount || 0} bedrooms`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>{bedCount || 0}</span>
          </div>

          {/* Bathrooms */}
          <div className="flex items-center gap-1" title={`${bathroomCount || 0} bathrooms`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
              />
            </svg>
            <span>{bathroomCount || 0}</span>
          </div>
        </div>

        {/* Amenities Preview */}
        {amenitiesPreview && amenitiesPreview.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {amenitiesPreview.map((amenity, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700"
              >
                {amenity || 'Amenity'}
              </span>
            ))}
            {hasMoreAmenities && amenities && Array.isArray(amenities) && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                +{amenities.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
