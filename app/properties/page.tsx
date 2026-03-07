'use client';

import { PublicLayout, PropertyCard } from '@/components/public';
import PropertyFilter, { FilterState } from '@/components/public/PropertyFilter';
import { mockProperties } from '@/lib/mockData';
import { useState } from 'react';

export default function PropertiesPage() {
  const [filters, setFilters] = useState<FilterState>({
    location: 'All Locations',
    propertyType: 'All Types',
    bedCount: 'Any',
    amenities: [],
  });

  // Filter properties based on current filters
  const filteredProperties = mockProperties.filter((property) => {
    // Location filter
    if (filters.location !== 'All Locations') {
      if (!property.location.includes(filters.location)) {
        return false;
      }
    }

    // Property type filter (basic implementation - would need property type field in real data)
    if (filters.propertyType !== 'All Types') {
      // For now, just check if property name contains the type
      if (!property.name.toLowerCase().includes(filters.propertyType.toLowerCase())) {
        return false;
      }
    }

    // Bed count filter
    if (filters.bedCount !== 'Any') {
      const minBeds = parseInt(filters.bedCount.replace('+', ''));
      if (property.bedCount < minBeds) {
        return false;
      }
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((amenity) =>
        property.amenities.includes(amenity)
      );
      if (!hasAllAmenities) {
        return false;
      }
    }

    return true;
  });

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Browse Properties
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find your perfect vacation rental from our collection of stunning properties
          </p>
        </div>

        {/* Filter Component */}
        <PropertyFilter
          onFilterChange={setFilters}
          totalProperties={mockProperties.length}
          filteredCount={filteredProperties.length}
        />

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <svg
              className="w-20 h-20 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters to see more results
            </p>
            <button
              onClick={() =>
                setFilters({
                  location: 'All Locations',
                  propertyType: 'All Types',
                  bedCount: 'Any',
                  amenities: [],
                })
              }
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors min-h-touch"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
