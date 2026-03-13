'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useConfirmation } from '@/lib/hooks/useConfirmation';

export const dynamic = 'force-dynamic'

interface InquiryWithProperty {
  id: string;
  guestName: string;
  guestEmail: string;
  message: string;
  status: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestCount?: number;
  createdAt: string;
  property: {
    id: string;
    name: string;
  };
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [updating, setUpdating] = useState<string | null>(null);
  const confirmation = useConfirmation();

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inquiries');
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      } else {
        console.error('Failed to load inquiries');
        setInquiries([]);
      }
    } catch (error) {
      console.error('Error loading inquiries:', error);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      setUpdating(id);
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        await loadInquiries();
      } else {
        throw new Error('Failed to update inquiry status');
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
      alert('Failed to update inquiry status');
    } finally {
      setUpdating(null);
    }
  };

  const deleteInquiry = async (id: string, guestName: string) => {
    confirmation.showConfirmation(
      {
        title: 'Delete Inquiry',
        message: `Are you sure you want to delete the inquiry from ${guestName}? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger',
      },
      async () => {
        const response = await fetch(`/api/inquiries/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await loadInquiries();
        } else {
          throw new Error('Failed to delete inquiry');
        }
      }
    );
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    if (filter === 'all') return true;
    return inquiry.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'responded': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading inquiries...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inquiry Manager</h1>
          <p className="text-gray-600">Manage guest inquiries and bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Unread</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inquiries.filter(i => i.status === 'UNREAD').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Read</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inquiries.filter(i => i.status === 'READ').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Responded</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inquiries.filter(i => i.status === 'RESPONDED').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-brand-100 text-brand-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{inquiries.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({inquiries.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread ({inquiries.filter(i => i.status === 'UNREAD').length})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'read'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Read ({inquiries.filter(i => i.status === 'READ').length})
            </button>
            <button
              onClick={() => setFilter('responded')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'responded'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Responded ({inquiries.filter(i => i.status === 'RESPONDED').length})
            </button>
          </div>
        </div>

        {/* Inquiries List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredInquiries.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries found</h3>
              <p className="text-gray-500">
                {filter === 'all' ? 'No inquiries have been received yet.' : `No ${filter} inquiries found.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredInquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{inquiry.guestName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{inquiry.guestEmail}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Property</p>
                          <p className="font-medium">{inquiry.property.name}</p>
                        </div>
                        {inquiry.checkInDate && inquiry.checkOutDate && (
                          <>
                            <div>
                              <p className="text-sm text-gray-500">Check-in</p>
                              <p className="font-medium">{new Date(inquiry.checkInDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Check-out</p>
                              <p className="font-medium">{new Date(inquiry.checkOutDate).toLocaleDateString()}</p>
                            </div>
                          </>
                        )}
                        {inquiry.guestCount && (
                          <div>
                            <p className="text-sm text-gray-500">Guests</p>
                            <p className="font-medium">{inquiry.guestCount}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-500">Received</p>
                          <p className="font-medium">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Message</p>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{inquiry.message}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {inquiry.status === 'UNREAD' && (
                      <button
                        onClick={() => updateInquiryStatus(inquiry.id, 'read')}
                        disabled={updating === inquiry.id}
                        className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors disabled:opacity-50"
                      >
                        Mark as Read
                      </button>
                    )}
                    {(inquiry.status === 'UNREAD' || inquiry.status === 'read') && (
                      <button
                        onClick={() => updateInquiryStatus(inquiry.id, 'RESPONDED')}
                        disabled={updating === inquiry.id}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        Mark as Responded
                      </button>
                    )}
                    <button
                      onClick={() => updateInquiryStatus(inquiry.id, 'ARCHIVED')}
                      disabled={updating === inquiry.id}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      Archive
                    </button>
                    <a
                      href={`mailto:${inquiry.guestEmail}?subject=Re: Inquiry for ${inquiry.property.name}`}
                      className="px-3 py-1 bg-brand-600 text-white rounded text-sm hover:bg-brand-700 transition-colors"
                    >
                      Reply via Email
                    </a>
                    <button
                      onClick={() => deleteInquiry(inquiry.id, inquiry.guestName)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={confirmation.hideConfirmation}
        onConfirm={confirmation.handleConfirm}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        type={confirmation.type}
        loading={confirmation.loading}
      />
    </AdminLayout>
  );
}