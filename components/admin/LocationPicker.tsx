'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Fix for default marker icon in Leaflet with Next.js
const createIcon = () => {
  if (typeof window === 'undefined') return null;
  
  const L = require('leaflet');
  return L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number, address?: string) => void;
  height?: string;
}

function LocationPickerComponent({
  latitude = 14.6760, // Default to Cubao, Quezon City
  longitude = 121.0437,
  onLocationChange,
  height = '400px',
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Dynamically import Leaflet and CSS
    const loadLeaflet = async () => {
      const L = (await import('leaflet')).default;
      
      // Import CSS dynamically
      if (typeof document !== 'undefined') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      
      const icon = createIcon();
      if (!icon) return;

      if (mapInstanceRef.current) {
        // Update existing map
        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
          mapInstanceRef.current.setView([latitude, longitude], 15);
        }
        return;
      }

      // Initialize map
      if (!mapRef.current) return;
      const map = L.map(mapRef.current).setView([latitude, longitude], 15);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add initial marker
      const marker = L.marker([latitude, longitude], { 
        icon,
        draggable: true 
      }).addTo(map);

      marker.bindPopup('Drag me to set the property location!');

      // Handle marker drag
      marker.on('dragend', (e: any) => {
        const position = e.target.getLatLng();
        onLocationChange(position.lat, position.lng);
        reverseGeocode(position.lat, position.lng);
      });

      // Handle map click
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        onLocationChange(lat, lng);
        reverseGeocode(lat, lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      setIsLoaded(true);
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data.display_name) {
        onLocationChange(lat, lng, data.display_name);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=ph`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);
        
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([newLat, newLng], 16);
          markerRef.current.setLatLng([newLat, newLng]);
          onLocationChange(newLat, newLng, display_name);
        }
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchLocation();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for a location (e.g., Cubao, Quezon City)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
        />
        <button
          type="button"
          onClick={searchLocation}
          disabled={isSearching || !searchQuery.trim()}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Map Container */}
      <div className="w-full rounded-lg overflow-hidden shadow-md border border-gray-200">
        <div
          ref={mapRef}
          style={{ height, width: '100%' }}
          className="z-0 relative"
        >
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">How to set location:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Search for your property's address in the search bar above</li>
          <li>Click anywhere on the map to place the marker</li>
          <li>Drag the marker to fine-tune the exact location</li>
          <li>The coordinates will be automatically saved</li>
        </ul>
      </div>
    </div>
  );
}

// Export as dynamic component with SSR disabled
const LocationPicker = dynamic(() => Promise.resolve(LocationPickerComponent), {
  ssr: false,
  loading: () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
      <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    </div>
  )
});

export default LocationPicker;