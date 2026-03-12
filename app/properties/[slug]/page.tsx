'use client';

import { PublicLayout, PropertyGallery, AvailabilityCalendar } from '@/components/public';
import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import MapDisplay to avoid SSR issues with Leaflet
const MapDisplay = dynamic(() => import('@/components/public/MapDisplay'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-200 rounded-lg animate-pulse" />,
});

export default function PropertyDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [availabilityData, setAvailabilityData] = useState<any[]>([]);
  const [inquiryForm, setInquiryForm] = useState({
    guestName: '',
    guestEmail: '',
    checkInDate: '',
    checkOutDate: '',
    guestCount: 2,
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch('/api/properties');
        if (response.ok) {
          const properties = await response.json();
          const foundProperty = properties.find((p: any) => p.slug === slug);
          
          if (foundProperty) {
            // Parse amenities if it's a JSON string
            if (typeof foundProperty.amenities === 'string') {
              try {
                foundProperty.amenities = JSON.parse(foundProperty.amenities);
              } catch (e) {
                foundProperty.amenities = [];
              }
            }
            setProperty(foundProperty);
            
            // Load availability data
            loadAvailability(foundProperty.id);
          } else {
            notFound();
          }
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProperty();
    }
  }, [slug]);

  const loadAvailability = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}/availability`);
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((item: any) => ({
          date: item.date.split('T')[0],
          status: item.status === 'BOOKED' ? 'BOOKED' : 'AVAILABLE'
        }));
        setAvailabilityData(formattedData);
      }
    } catch (error) {
      console.error('Error loading availability:', error);
      setAvailabilityData([]);
    }
  };

  const handleDateSelect = (start: Date | null, end: Date | null) => {
    setSelectedDates({ start, end });
    if (start && end) {
      // Auto-fill the inquiry form dates
      setInquiryForm({
        ...inquiryForm,
        checkInDate: start.toISOString().split('T')[0],
        checkOutDate: end.toISOString().split('T')[0],
      });
      // Scroll to inquiry form
      setTimeout(() => {
        document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...inquiryForm,
          propertyId: property.id,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setInquiryForm({
          guestName: '',
          guestEmail: '',
          checkInDate: '',
          checkOutDate: '',
          guestCount: 2,
          message: '',
        });
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        alert('Failed to submit inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      </PublicLayout>
    );
  }

  if (!property) {
    notFound();
  }

  return (
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
          </div>
        </div>

        {/* Property Gallery */}
        {property.media && property.media.length > 0 && (
          <div className="mb-12">
            <PropertyGallery media={property.media} propertyName={property.name} />
          </div>
        )}

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
                <p className="mb-4">{property.description || `Welcome to ${property.name}, your perfect getaway in ${property.location}.`}</p>
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
                    <svg className="w-6 h-6 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">Guests</h3>
                  </div>
                  <p className="text-3xl font-bold text-brand-600">{property.guestCapacity}</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">Bedrooms</h3>
                  </div>
                  <p className="text-3xl font-bold text-brand-600">{property.bedCount}</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">Bathrooms</h3>
                  </div>
                  <p className="text-3xl font-bold text-brand-600">{property.bathroomCount}</p>
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.amenities && Array.isArray(property.amenities) && property.amenities.length > 0 ? (
                  property.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-brand-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-900">{amenity}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    No amenities information available.
                  </div>
                )}
              </div>
            </section>

            {/* Availability Calendar */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Check Availability
              </h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-700">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-gray-700">Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <span className="text-gray-700">Past Date</span>
                  </div>
                </div>
                <AvailabilityCalendar
                  propertyId={property.id}
                  availabilityData={availabilityData}
                  onDateRangeSelect={handleDateSelect}
                />
                {selectedDates.start && selectedDates.end && (
                  <div className="mt-6 p-4 bg-brand-50 border-2 border-brand-600 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Selected Dates</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Check-in</p>
                        <p className="font-semibold">{selectedDates.start.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Check-out</p>
                        <p className="font-semibold">{selectedDates.end.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-brand-200">
                      <p className="text-sm text-gray-600">
                        Total nights: <span className="font-semibold text-gray-900">
                          {Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24))}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Estimated total: <span className="font-semibold text-brand-600 text-lg">
                          ₱{(property.pricePerNight * Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24))).toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                      className="mt-4 w-full px-4 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors"
                    >
                      Send Inquiry for These Dates
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Location Map */}
            {property.latitude && property.longitude && (
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
            )}

            {/* Inquiry Form */}
            <section id="inquiry-form">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Send an Inquiry
              </h2>
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                  <p className="text-green-800">✓ Your inquiry has been sent successfully! We'll get back to you soon.</p>
                </div>
              )}
              <form onSubmit={handleInquirySubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.guestName}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, guestName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={inquiryForm.guestEmail}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, guestEmail: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                    <input
                      type="date"
                      value={inquiryForm.checkInDate}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, checkInDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                    <input
                      type="date"
                      value={inquiryForm.checkOutDate}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, checkOutDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                    <input
                      type="number"
                      min="1"
                      value={inquiryForm.guestCount}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, guestCount: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600"
                    placeholder="Tell us about your stay..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Price per night</p>
                  <p className="text-3xl font-bold text-brand-600">₱{property.pricePerNight?.toLocaleString() || 'N/A'}</p>
                  {property.extraPersonPrice > 0 && (
                    <p className="text-sm text-gray-600 mt-1">+₱{property.extraPersonPrice.toLocaleString()} per extra person</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <a
                    href="https://www.airbnb.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-3 bg-[#FF5A5F] text-white text-center rounded-lg font-semibold hover:bg-[#E04E53] transition-colors"
                  >
                    Book on Airbnb
                  </a>
                  <a
                    href={`https://wa.me/639760016381?text=Hi! I'm interested in ${property.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-3 bg-green-600 text-white text-center rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    WhatsApp James
                  </a>
                  <a
                    href="tel:09760016381"
                    className="block w-full px-6 py-3 bg-white text-brand-600 border-2 border-brand-600 text-center rounded-lg font-semibold hover:bg-brand-50 transition-colors"
                  >
                    Call: 09760016381
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
