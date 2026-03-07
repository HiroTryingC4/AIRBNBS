'use client';

import { PublicLayout, AvailabilityCalendar } from '@/components/public';
import { mockAvailabilityData } from '@/lib/mockData';
import { useState } from 'react';

export default function AvailabilityPage() {
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

  const handleDateSelect = (start: Date | null, end: Date | null) => {
    setSelectedDates({ start, end });
    if (start && end) {
      setShowForm(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    alert('Inquiry submitted! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', guests: '1', message: '' });
    setSelectedDates({ start: null, end: null });
    setShowForm(false);
  };

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Check Availability
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your check-in and check-out dates to see availability
          </p>
        </div>

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
            <div className="w-4 h-4 bg-primary-500 rounded"></div>
            <span className="text-gray-700">Selected</span>
          </div>
        </div>

        {/* Calendar Grid - Show 12 months */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <AvailabilityCalendar
              propertyId="1"
              availabilityData={mockAvailabilityData}
              onDateRangeSelect={handleDateSelect}
            />
          </div>
        </div>

        {/* Selected Dates Display */}
        {selectedDates.start && selectedDates.end && (
          <div className="max-w-2xl mx-auto mb-8 bg-primary-50 border-2 border-primary-600 rounded-lg p-6">
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
            <div className="mt-4 pt-4 border-t border-primary-200">
              <p className="text-sm text-gray-600">
                Total nights:{' '}
                <span className="font-semibold text-gray-900">
                  {Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24))}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Inquiry Form */}
        {showForm && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Send Inquiry
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    placeholder="Any special requests or questions?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors min-h-touch"
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
                className="px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors min-h-touch flex items-center justify-center"
              >
                Contact Host
              </a>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
