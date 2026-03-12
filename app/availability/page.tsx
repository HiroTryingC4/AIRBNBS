'use client';

import { PublicLayout, AvailabilityCalendar } from '@/components/public';
import { useState, useEffect } from 'react';

interface Property {
  id: string;
  name: string;
  slug: string;
  location: string;
  bedCount: number;
  bathroomCount: number;
  guestCapacity: number;
  pricePerNight: number;
}

interface AvailabilityData {
  date: string;
  status: 'AVAILABLE' | 'BOOKED';
}

export default function AvailabilityPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '1',
    message: '',
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      loadAvailability(selectedProperty.id);
    }
  }, [selectedProperty]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
        if (data.length > 0) {
          setSelectedProperty(data[0]);
        }
      }
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

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
      setShowForm(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProperty || !selectedDates.start || !selectedDates.end) {
      alert('Please select dates first');
      return;
    }

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: selectedProperty.id,
          guestName: formData.name,
          guestEmail: formData.email,
          checkInDate: selectedDates.start.toISOString(),
          checkOutDate: selectedDates.end.toISOString(),
          guestCount: parseInt(formData.guests),
          message: formData.message || `Inquiry for ${selectedProperty.name}`,
        }),
      });

      if (response.ok) {
        alert('Inquiry submitted! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', guests: '1', message: '' });
        setSelectedDates({ start: null, end: null });
        setShowForm(false);
      } else {
        alert('Failed to submit inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Check Availability
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a property and your check-in and check-out dates to see availability
          </p>
        </div>

        {/* Property Selector */}
        {properties.length > 0 && (
          <div className="max-w-6xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Property</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <button
                  key={property.id}
                  onClick={() => {
                    setSelectedProperty(property);
                    setSelectedDates({ start: null, end: null });
                    setShowForm(false);
                  }}
                  className={`text-left p-6 rounded-lg border-2 transition-all ${
                    selectedProperty?.id === property.id
                      ? 'border-brand-600 bg-brand-50 shadow-lg'
                      : 'border-gray-200 hover:border-brand-300 hover:shadow-md'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {property.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{property.location}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-700 mb-3">
                    <span>🛏️ {property.bedCount} bed{property.bedCount !== 1 ? 's' : ''}</span>
                    <span>🚿 {property.bathroomCount} bath</span>
                    <span>👥 {property.guestCapacity} guests</span>
                  </div>
                  <p className="text-lg font-bold text-brand-600">
                    ₱{property.pricePerNight.toLocaleString()} / night
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Property Info */}
        {selectedProperty && (
          <div className="max-w-6xl mx-auto mb-8 bg-brand-50 border-2 border-brand-600 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Viewing availability for: {selectedProperty.name}
            </h3>
            <p className="text-gray-700">{selectedProperty.location}</p>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
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
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-brand-500 rounded"></div>
            <span className="text-gray-700">Selected</span>
          </div>
        </div>

        {/* Calendar */}
        {selectedProperty && (
          <div className="max-w-6xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <AvailabilityCalendar
                propertyId={selectedProperty.id}
                availabilityData={availabilityData}
                onDateRangeSelect={handleDateSelect}
              />
            </div>
          </div>
        )}

        {/* Selected Dates Display */}
        {selectedDates.start && selectedDates.end && (
          <div className="max-w-2xl mx-auto mb-8 bg-brand-50 border-2 border-brand-600 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Selected Dates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Check-in</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedDates.start.toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Check-out</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedDates.end.toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-brand-200">
              <p className="text-sm text-gray-600">
                Total nights:{' '}
                <span className="font-semibold text-gray-900">
                  {Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24))}
                </span>
              </p>
              {selectedProperty && (
                <p className="text-sm text-gray-600 mt-2">
                  Estimated total:{' '}
                  <span className="font-semibold text-brand-600 text-lg">
                    ₱{(selectedProperty.pricePerNight * Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24))).toLocaleString()}
                  </span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Inquiry Form */}
        {showForm && selectedProperty && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Send Inquiry for {selectedProperty.name}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                    placeholder="+63 912 345 6789"
                  />
                </div>

                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests *
                  </label>
                  <select
                    id="guests"
                    required
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                    placeholder="Any special requests or questions?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors min-h-touch"
                >
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Alternative Booking Options */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Book?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Book directly through Airbnb or contact us for special rates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.airbnb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-[#FF5A5F] text-white rounded-lg font-semibold hover:bg-[#E04E53] transition-colors min-h-touch flex items-center justify-center"
              >
                Book on Airbnb
              </a>
              <a
                href="/contact"
                className="px-8 py-3 bg-white text-brand-600 border-2 border-brand-600 rounded-lg font-semibold hover:bg-brand-50 transition-colors min-h-touch flex items-center justify-center"
              >
                Contact Host
              </a>
              <a
                href={`https://wa.me/639760016381?text=Hi! I'm interested in ${selectedProperty?.name || 'your property'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors min-h-touch flex items-center justify-center"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
