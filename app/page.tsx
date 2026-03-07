'use client';

import { PublicLayout } from '@/components/public';
import { mockProperties, mockMediaGallery } from '@/lib/mockData';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// Intersection Observer hook for scroll animations
function useScrollAnimation() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
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

  return { visibleSections, observe };
}

export default function Home() {
  const { visibleSections, observe } = useScrollAnimation();
  // Use the first property as the featured property for the hero
  const featuredProperty = mockProperties[0];

  return (
    <PublicLayout>
      {/* Hero Section with Full-Screen Property Image */}
      <div className="relative h-screen min-h-[600px] max-h-[900px] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={featuredProperty.thumbnailUrl}
            alt={`${featuredProperty.name} - ${featuredProperty.location}`}
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative h-full flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto text-white">
              {/* Property Name */}
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 drop-shadow-lg">
                {featuredProperty.name}
              </h1>
              
              {/* Location */}
              <p className="text-xl md:text-2xl lg:text-3xl mb-6 flex items-center justify-center gap-2 drop-shadow-lg">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {featuredProperty.location}
              </p>

              {/* Tagline */}
              <p className="text-lg md:text-xl lg:text-2xl mb-10 text-gray-100 drop-shadow-lg max-w-2xl mx-auto">
                Your perfect getaway awaits. Experience luxury, comfort, and unforgettable memories.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/availability"
                  className="px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all transform hover:scale-105 min-h-touch flex items-center justify-center shadow-2xl text-lg"
                >
                  Check Availability
                </Link>
                <Link
                  href={`/properties/${featuredProperty.slug}`}
                  className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 min-h-touch flex items-center justify-center shadow-2xl text-lg"
                >
                  View Property
                </Link>
                <a
                  href="https://www.airbnb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-[#FF5A5F] text-white rounded-lg font-semibold hover:bg-[#E04E53] transition-all transform hover:scale-105 min-h-touch flex items-center justify-center shadow-2xl text-lg"
                >
                  Book on Airbnb
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Quick Property Overview Section */}
      <div className="py-8 md:py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Guest Capacity */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{featuredProperty.guestCapacity} Guests</h3>
              <p className="text-gray-600">Comfortable capacity</p>
            </div>

            {/* Bedrooms */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{featuredProperty.bedCount} Bedrooms</h3>
              <p className="text-gray-600">Spacious rooms</p>
            </div>

            {/* Bathrooms */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{featuredProperty.bathroomCount} Bathrooms</h3>
              <p className="text-gray-600">Modern facilities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Gallery Section */}
      <div className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Photo Gallery
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Take a visual tour of our beautiful property
            </p>
          </div>

          {/* Gallery Grid - Show 8 images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto mb-8">
            {mockMediaGallery
              .filter(item => item.mediaType === 'IMAGE')
              .slice(0, 8)
              .map((item) => (
                <div 
                  key={item.id} 
                  className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer shadow-md hover:shadow-xl transition-all"
                >
                  <Image
                    src={item.url}
                    alt="Moonplace property"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              ))}
          </div>

          {/* View Full Gallery Button */}
          <div className="text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors min-h-touch"
            >
              View Full Gallery
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Amenities Highlight Section */}
      <div className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Premium Amenities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for a comfortable and memorable stay
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {featuredProperty.amenities.map((amenity, index) => (
              <div key={index} className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-3">
                  <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900">{amenity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guest Reviews Preview Section */}
      <div className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Guest Reviews
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our guests have to say about their experience
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
            {/* Review 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Absolutely stunning property! The views were breathtaking and the amenities exceeded our expectations. Can't wait to come back!"
              </p>
              <p className="text-sm font-semibold text-gray-900">- Maria Santos</p>
              <p className="text-xs text-gray-500">January 2024</p>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Perfect for our family vacation. The kids loved the pool and we enjoyed the peaceful surroundings. Highly recommended!"
              </p>
              <p className="text-sm font-semibold text-gray-900">- John Reyes</p>
              <p className="text-xs text-gray-500">December 2023</p>
            </div>

            {/* Review 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Great location, beautiful property, and excellent host. Everything was clean and well-maintained. Will definitely book again!"
              </p>
              <p className="text-sm font-semibold text-gray-900">- Lisa Chen</p>
              <p className="text-xs text-gray-500">November 2023</p>
            </div>
          </div>

          {/* Read More Reviews Button */}
          <div className="text-center">
            <Link
              href="/reviews"
              className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors min-h-touch"
            >
              Read More Reviews
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Availability Preview Section */}
      <div className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Check Availability
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Plan your perfect getaway - see available dates
            </p>
          </div>

          {/* Mini Calendar Preview */}
          <div className="max-w-md mx-auto bg-gray-50 p-8 rounded-lg shadow-md mb-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <p className="text-sm text-gray-600">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Available
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full ml-4 mr-2"></span>
                Booked
              </p>
            </div>
            
            <div className="text-center text-gray-600 py-8">
              <svg className="w-16 h-16 mx-auto mb-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>View the full interactive calendar</p>
            </div>
          </div>

          {/* Check Full Calendar Button */}
          <div className="text-center">
            <Link
              href="/availability"
              className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors min-h-touch"
            >
              Check Full Calendar
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Nearby Attractions Preview Section */}
      <div className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore the Area
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover nearby attractions and activities
            </p>
          </div>

          {/* Attractions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
            {/* Attraction 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop"
                  alt="Beach"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">White Sand Beach</h3>
                <p className="text-sm text-gray-600 mb-2">Pristine beach with crystal clear waters</p>
                <p className="text-xs text-primary-600 font-medium">5 min walk • 0.3 km</p>
              </div>
            </div>

            {/* Attraction 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"
                  alt="Restaurant"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Seaside Restaurant</h3>
                <p className="text-sm text-gray-600 mb-2">Fresh seafood and local cuisine</p>
                <p className="text-xs text-primary-600 font-medium">10 min drive • 2.5 km</p>
              </div>
            </div>

            {/* Attraction 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
                  alt="Mountain"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Hiking Trail</h3>
                <p className="text-sm text-gray-600 mb-2">Scenic mountain views and nature</p>
                <p className="text-xs text-primary-600 font-medium">15 min drive • 5 km</p>
              </div>
            </div>

            {/* Attraction 4 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop"
                  alt="Market"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Local Market</h3>
                <p className="text-sm text-gray-600 mb-2">Fresh produce and local crafts</p>
                <p className="text-xs text-primary-600 font-medium">8 min drive • 3 km</p>
              </div>
            </div>
          </div>

          {/* Explore Area Button */}
          <div className="text-center">
            <Link
              href="/attractions"
              className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors min-h-touch"
            >
              Explore Area
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative py-20 md:py-28 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=800&fit=crop"
            alt="Luxury vacation"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-800/90" />
        </div>

        {/* CTA Content */}
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
              Ready to Book Your Dream Vacation?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-gray-100 drop-shadow-lg">
              Don't miss out on this incredible property. Check availability and secure your dates today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/availability"
                className="px-10 py-4 bg-white text-primary-600 rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 min-h-touch flex items-center justify-center shadow-2xl text-lg"
              >
                Check Availability Now
              </Link>
              <Link
                href="/contact"
                className="px-10 py-4 bg-transparent text-white border-2 border-white rounded-lg font-bold hover:bg-white/10 transition-all transform hover:scale-105 min-h-touch flex items-center justify-center shadow-2xl text-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
