'use client';

import { PublicLayout, PropertyCard } from '@/components/public';
import PropertyFilter, { FilterState } from '@/components/public/PropertyFilter';
import { useState, useEffect } from 'react';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    location: 'All Locations',
    propertyType: 'All Types',
    bedCount: 'Any',
    amenities: [],
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
        } else {
          console.error('Failed to fetch properties');
          setProperties([]);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties based on current filters with safety checks
  const filteredProperties = (properties && Array.isArray(properties) ? properties : []).filter((property) => {
    // Safety check for property object
    if (!property) return false;

    // Location filter
    if (filters.location !== 'All Locations') {
      if (!property.location || !property.location.includes(filters.location)) {
        return false;
      }
    }

    // Property type filter
    if (filters.propertyType !== 'All Types') {
      if (!property.propertyType || property.propertyType !== filters.propertyType) {
        return false;
      }
    }

    // Bed count filter
    if (filters.bedCount !== 'Any') {
      const bedCount = parseInt(filters.bedCount);
      if (!property.bedCount || property.bedCount !== bedCount) {
        return false;
      }
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      if (!property.amenities || !Array.isArray(property.amenities)) {
        return false;
      }
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Properties
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our collection of premium accommodations, each carefully selected to provide you with an exceptional stay experience.
          </p>
        </div>

        {/* Property Filter */}
        <PropertyFilter 
          onFilterChange={setFilters}
          totalProperties={properties.length}
          filteredCount={filteredProperties.length}
        />

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : (
          <>
            {/* Properties Grid */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Properties Found</h3>
                <p className="text-gray-600">
                  {properties.length === 0 
                    ? "No properties are currently available." 
                    : "Try adjusting your filters to see more properties."}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  );
}