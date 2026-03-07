'use client';

import { useState } from 'react';

interface PropertyFilterProps {
  onFilterChange: (filters: FilterState) => void;
  totalProperties: number;
  filteredCount: number;
}

export interface FilterState {
  location: string;
  propertyType: string;
  bedCount: string;
  amenities: string[];
}

const LOCATIONS = [
  'All Locations',
  'Batangas',
  'Tagaytay',
  'Makati',
  'La Union',
  'Cebu',
  'Antipolo',
];

const PROPERTY_TYPES = [
  'All Types',
  'Villa',
  'Apartment',
  'House',
  'Beach House',
  'Farmhouse',
];

const BED_COUNTS = ['Any', '1+', '2+', '3+', '4+', '5+'];

const AMENITIES = [
  'WiFi',
  'Swimming Pool',
  'Air Conditioning',
  'Kitchen',
  'Free Parking',
  'Beach Access',
  'Gym Access',
  'Garden',
  'BBQ Area',
  'Fireplace',
];

export default function PropertyFilter({ onFilterChange, totalProperties, filteredCount }: PropertyFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    location: 'All Locations',
    propertyType: 'All Types',
    bedCount: 'Any',
    amenities: [],
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string | string[]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    handleFilterChange('amenities', newAmenities);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      location: 'All Locations',
      propertyType: 'All Types',
      bedCount: 'Any',
      amenities: [],
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters =
    filters.location !== 'All Locations' ||
    filters.propertyType !== 'All Types' ||
    filters.bedCount !== 'Any' ||
    filters.amenities.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Filter Properties</h2>
          <p className="text-sm text-gray-600 mt-1">
            Showing <span className="font-semibold text-primary-600">{filteredCount}</span> of{' '}
            <span className="font-semibold">{totalProperties}</span> properties
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors min-h-touch"
        >
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filters */}
      <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Location Filter */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            id="location"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
          >
            {LOCATIONS.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type Filter */}
        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
            Property Type
          </label>
          <select
            id="propertyType"
            value={filters.propertyType}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
          >
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Bed Count Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {BED_COUNTS.map((count) => (
              <button
                key={count}
                onClick={() => handleFilterChange('bedCount', count)}
                className={`px-4 py-2 rounded-lg font-medium transition-all min-h-touch ${
                  filters.bedCount === count
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amenities ({filters.amenities.length} selected)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AMENITIES.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-600"
                />
                <span className="text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors min-h-touch flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
}
