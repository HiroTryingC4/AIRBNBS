'use client';

import { PublicLayout } from '@/components/public';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

// Mock gallery data organized by categories with more images
const galleryData = {
  Interior: [
    { id: '1', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', alt: 'Living room' },
    { id: '2', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop', alt: 'Dining area' },
    { id: '3', url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop', alt: 'Kitchen' },
    { id: '4', url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop', alt: 'Lounge' },
    { id: '5', url: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800&h=600&fit=crop', alt: 'Modern living space' },
    { id: '6', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop', alt: 'Cozy corner' },
    { id: '7', url: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop', alt: 'Open concept' },
    { id: '8', url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&h=600&fit=crop', alt: 'Interior design' },
  ],
  Bedrooms: [
    { id: '9', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop', alt: 'Master bedroom' },
    { id: '10', url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop', alt: 'Guest bedroom' },
    { id: '11', url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop', alt: 'Kids bedroom' },
    { id: '12', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop', alt: 'Bedroom view' },
    { id: '13', url: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&h=600&fit=crop', alt: 'Comfortable bed' },
    { id: '14', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop', alt: 'Bedroom decor' },
    { id: '15', url: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800&h=600&fit=crop', alt: 'Cozy bedroom' },
  ],
  Outdoor: [
    { id: '16', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop', alt: 'Pool area' },
    { id: '17', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', alt: 'Garden' },
    { id: '18', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', alt: 'Patio' },
    { id: '19', url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop', alt: 'Outdoor seating' },
    { id: '20', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop', alt: 'Backyard' },
    { id: '21', url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop', alt: 'Terrace' },
    { id: '22', url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&h=600&fit=crop', alt: 'Outdoor lounge' },
    { id: '23', url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop', alt: 'Garden view' },
  ],
  Amenities: [
    { id: '24', url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', alt: 'Gym' },
    { id: '25', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop', alt: 'Spa' },
    { id: '26', url: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop', alt: 'Game room' },
    { id: '27', url: 'https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800&h=600&fit=crop', alt: 'Entertainment area' },
    { id: '28', url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop', alt: 'Fitness center' },
    { id: '29', url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop', alt: 'Wellness area' },
  ],
  'Drone Shots': [
    { id: '30', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', alt: 'Aerial view' },
    { id: '31', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop', alt: 'Property overview' },
    { id: '32', url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop', alt: 'Sunset view' },
    { id: '33', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop', alt: 'Surrounding area' },
    { id: '34', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop', alt: 'Landscape view' },
    { id: '35', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', alt: 'Beach aerial' },
  ],
};

type Category = keyof typeof galleryData;

// Intersection Observer hook for scroll animations
function useIntersectionObserver() {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const observe = (element: HTMLElement | null) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  };

  return { visibleElements, observe };
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [lightboxImage, setLightboxImage] = useState<{ url: string; alt: string } | null>(null);
  const { visibleElements, observe } = useIntersectionObserver();

  const categories: Array<Category | 'All'> = ['All', 'Interior', 'Bedrooms', 'Outdoor', 'Amenities', 'Drone Shots'];

  // Get filtered images
  const getFilteredImages = () => {
    if (selectedCategory === 'All') {
      return Object.entries(galleryData).flatMap(([category, images]) =>
        images.map(img => ({ ...img, category }))
      );
    }
    return galleryData[selectedCategory].map(img => ({ ...img, category: selectedCategory }));
  };

  const filteredImages = getFilteredImages();

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-10 opacity-0 animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Photo Gallery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our stunning property through these beautiful photos
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 opacity-0 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-medium transition-all min-h-touch ${
                  selectedCategory === category
                    ? 'bg-brand-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-brand-600 hover:text-brand-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Image Count */}
        <div className="text-center mb-6 opacity-0 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <p className="text-gray-600">
            Showing <span className="font-semibold text-brand-600">{filteredImages.length}</span> photos
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Gallery Grid - Masonry Layout with Scroll Animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {filteredImages.map((image, index) => {
            const isVisible = visibleElements.has(`image-${image.id}`);
            return (
              <div
                key={image.id}
                id={`image-${image.id}`}
                ref={observe}
                className={`relative aspect-square overflow-hidden rounded-lg group cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${(index % 12) * 50}ms` }}
                onClick={() => setLightboxImage({ url: image.url, alt: image.alt })}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {image.category}
                </div>
              </div>
            );
          })}
        </div>

        {/* Lightbox */}
        {lightboxImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors min-h-touch min-w-touch flex items-center justify-center"
              onClick={() => setLightboxImage(null)}
              aria-label="Close lightbox"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
              <Image
                src={lightboxImage.url}
                alt={lightboxImage.alt}
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center bg-gray-50 py-12 rounded-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to Experience This Property?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Check availability and book your stay today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/availability"
              className="px-8 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors min-h-touch flex items-center justify-center"
            >
              Check Availability
            </a>
            <a
              href="/contact"
              className="px-8 py-3 bg-white text-brand-600 border-2 border-brand-600 rounded-lg font-medium hover:bg-brand-50 transition-colors min-h-touch flex items-center justify-center"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
