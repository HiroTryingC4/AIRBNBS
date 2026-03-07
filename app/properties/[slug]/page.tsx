import { PublicLayout, PropertyGallery, AvailabilityCalendar } from '@/components/public';
import { mockProperties, mockMediaGallery, mockAvailabilityData } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import MapDisplay to avoid SSR issues with Leaflet
const MapDisplay = dynamic(() => import('@/components/public/MapDisplay'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-200 rounded-lg animate-pulse" />,
});

// Generate static paths for all properties
export async function generateStaticParams() {
  return mockProperties.map((property) => ({
    slug: property.slug,
  }));
}

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    guestName: 'Maria Santos',
    rating: 5,
    reviewText: 'Absolutely stunning property! The views were breathtaking and the amenities exceeded our expectations. The host was very responsive and helpful. We had an amazing time and can\'t wait to come back!',
    date: '2024-01-15',
  },
  {
    id: '2',
    guestName: 'John Reyes',
    rating: 5,
    reviewText: 'Perfect for our family vacation. The kids loved the pool and we enjoyed the peaceful surroundings. Everything was clean and well-maintained. Highly recommended!',
    date: '2023-12-20',
  },
  {
    id: '3',
    guestName: 'Lisa Chen',
    rating: 5,
    reviewText: 'Great location, beautiful property, and excellent host. Everything was clean and well-maintained. The kitchen was fully equipped and the beds were very comfortable. Will definitely book again!',
    date: '2023-11-10',
  },
];

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const property = mockProperties.find(p => p.slug === params.slug);

  if (!property) {
    return {
      title: 'Property Not Found',
      description: 'The property you are looking for could not be found.',
    };
  }

  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;

  return {
    title: `${property.name} - ${property.location} | Vacation Rental`,
    description: `Book ${property.name} in ${property.location}. ${property.bedCount} bedrooms, ${property.bathroomCount} bathrooms, sleeps ${property.guestCapacity}. Rated ${averageRating.toFixed(1)}/5 stars. ${property.amenities.slice(0, 3).join(', ')} and more.`,
    keywords: [
      property.name,
      property.location,
      'vacation rental',
      'airbnb',
      'property rental',
      ...property.amenities,
    ],
    openGraph: {
      title: `${property.name} - ${property.location}`,
      description: `${property.bedCount} bedrooms • ${property.bathroomCount} bathrooms • Sleeps ${property.guestCapacity}`,
      images: [
        {
          url: property.thumbnailUrl,
          width: 1200,
          height: 630,
          alt: `${property.name} - ${property.location}`,
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${property.name} - ${property.location}`,
      description: `${property.bedCount} bedrooms • ${property.bathroomCount} bathrooms • Sleeps ${property.guestCapacity}`,
      images: [property.thumbnailUrl],
    },
    alternates: {
      canonical: `/properties/${property.slug}`,
    },
  };
}

export default function PropertyDetailPage({ params }: { params: { slug: string } }) {
  // Find property by slug
  const property = mockProperties.find(p => p.slug === params.slug);

  if (!property) {
    notFound();
  }

  // Calculate average rating
  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: property.name,
    description: `${property.name} in ${property.location}. ${property.bedCount} bedrooms, ${property.bathroomCount} bathrooms, sleeps ${property.guestCapacity}.`,
    image: property.thumbnailUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.location,
      addressCountry: 'PH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: property.latitude,
      longitude: property.longitude,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating,
      reviewCount: mockReviews.length,
      bestRating: 5,
      worstRating: 1,
    },
    amenityFeature: property.amenities.map(amenity => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
    })),
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Property Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {property.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-lg">{property.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-gray-500">({mockReviews.length} reviews)</span>
            </div>
          </div>
        </div>

        {/* Property Gallery */}
        <div className="mb-12">
          <PropertyGallery media={mockMediaGallery} propertyName={property.name} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Description */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                About This Property
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  Welcome to {property.name}, your perfect getaway in {property.location}. This stunning property offers 
                  the ideal blend of comfort, luxury, and convenience for an unforgettable vacation experience.
                </p>
                <p className="mb-4">
                  Whether you're planning a family vacation, a romantic retreat, or a gathering with friends, our property 
                  provides everything you need for a memorable stay. With {property.bedCount} spacious bedrooms and {property.bathroomCount} modern 
                  bathrooms, there's plenty of room for up to {property.guestCapacity} guests.
                </p>
                <p>
                  The property features premium amenities and is located in a prime location with easy access to local 
                  attractions, restaurants, and activities. Book your stay today and create lasting memories!
                </p>
              </div>
            </section>

            {/* Room Details */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Room Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">Guests</h3>
                  </div>
                  <p className="text-3xl font-bold text-primary-600">{property.guestCapacity}</p>
                  <p className="text-sm text-gray-600 mt-1">Maximum capacity</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">Bedrooms</h3>
                  </div>
                  <p className="text-3xl font-bold text-primary-600">{property.bedCount}</p>
                  <p className="text-sm text-gray-600 mt-1">Comfortable rooms</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">Bathrooms</h3>
                  </div>
                  <p className="text-3xl font-bold text-primary-600">{property.bathroomCount}</p>
                  <p className="text-sm text-gray-600 mt-1">Modern facilities</p>
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-900">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Location Map */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Location
              </h2>
              <div className="rounded-lg overflow-hidden shadow-md">
                <MapDisplay
                  latitude={property.latitude}
                  longitude={property.longitude}
                  propertyName={property.name}
                  height="400px"
                />
              </div>
              <p className="text-gray-600 mt-4">
                <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {property.location}
              </p>
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Guest Reviews
              </h2>
              
              {/* Overall Rating */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary-600">{averageRating.toFixed(1)}</div>
                    <div className="flex items-center justify-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{mockReviews.length} reviews</p>
                  </div>
                  <div className="flex-1 text-gray-700">
                    <p className="text-lg">Guests love this property! Consistently rated 5 stars for cleanliness, location, and hospitality.</p>
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-lg">
                            {review.guestName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{review.guestName}</h3>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center mb-3">
                          {[...Array(review.rating)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-700">{review.reviewText}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <a
                  href="/reviews"
                  className="inline-flex items-center px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors min-h-touch"
                >
                  View All Reviews
                </a>
              </div>
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Check Availability</h3>
                
                {/* Availability Calendar */}
                <div className="mb-6">
                  <AvailabilityCalendar propertyId={property.id} availabilityData={mockAvailabilityData} />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <a
                    href="/availability"
                    className="block w-full px-6 py-3 bg-primary-600 text-white text-center rounded-lg font-semibold hover:bg-primary-700 transition-colors min-h-touch"
                  >
                    View Full Calendar
                  </a>
                  <a
                    href="https://www.airbnb.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-3 bg-[#FF5A5F] text-white text-center rounded-lg font-semibold hover:bg-[#E04E53] transition-colors min-h-touch"
                  >
                    Book on Airbnb
                  </a>
                  <a
                    href="/contact"
                    className="block w-full px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 text-center rounded-lg font-semibold hover:bg-primary-50 transition-colors min-h-touch"
                  >
                    Contact Host
                  </a>
                </div>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center mb-4">
                    Have questions? Get in touch!
                  </p>
                  <div className="space-y-2">
                    <a
                      href="https://wa.me/1234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                    <a
                      href="https://m.me/username"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
                      </svg>
                      Messenger
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
    </>
  );
}
