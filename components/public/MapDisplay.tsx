'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet with Next.js
// This is needed because webpack doesn't properly bundle the marker images
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface MapDisplayProps {
  latitude: number;
  longitude: number;
  propertyName: string;
  zoom?: number;
  height?: string;
}

export default function MapDisplay({
  latitude,
  longitude,
  propertyName,
  zoom = 15,
  height = '400px',
}: MapDisplayProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    // Only initialize map on client side
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Prevent re-initialization if map already exists
    if (mapInstanceRef.current) {
      // Update marker position if coordinates change
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
        mapInstanceRef.current.setView([latitude, longitude], zoom);
      }
      return;
    }

    // Initialize map
    const map = L.map(mapRef.current).setView([latitude, longitude], zoom);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add marker with popup
    const marker = L.marker([latitude, longitude], { icon }).addTo(map);
    marker.bindPopup(`<strong>${propertyName}</strong>`);

    // Store references
    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [latitude, longitude, propertyName, zoom]);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-md">
      <div
        ref={mapRef}
        style={{ height, width: '100%' }}
        className="z-0"
      />
    </div>
  );
}
