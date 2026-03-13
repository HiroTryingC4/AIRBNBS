'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin';

export const dynamic = 'force-dynamic'
import ConfirmationModal from '@/components/ConfirmationModal';
import { useConfirmation } from '@/lib/hooks/useConfirmation';

interface Review {
  id: string;
  guestName: string;
  rating: number;
  reviewText: string;
  propertyName: string;
  date: string;
  isPublished: boolean;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'pending'>('all');
  const confirmation = useConfirmation();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        console.error('Failed to load reviews');
        setReviews([]);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const togglePublishStatus = async (reviewId: string, isPublished: boolean, guestName: string) => {
    const action = isPublished ? 'publish' : 'unpublish';
    const actionText = isPublished ? 'Publish' : 'Unpublish';
    
    confirmation.showConfirmation(
      {
        title: `${actionText} Review`,
        message: `Are you sure you want to ${action} the review from ${guestName}?`,
        confirmText: actionText,
        cancelText: 'Cancel',
        type: isPublished ? 'info' : 'warning',
      },
      async () => {
        const response = await fetch(`/api/reviews/${reviewId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isPublished }),
        });

        if (response.ok) {
          setReviews(prev => 
            prev.map(review => 
              review.id === reviewId 
                ? { ...review, isPublished }
                : review
            )
          );
        } else {
          throw new Error(`Failed to ${action} review`);
        }
      }
    );
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'published') return review.isPublished;
    if (filter === 'pending') return !review.isPublished;
    return true;
  });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews Management</h1>
            <p className="text-gray-600">Manage guest reviews and ratings for your properties.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{reviews.length}</p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900">{averageRating}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Published</p>
                <p className="text-3xl font-bold text-gray-900">
                  {reviews.filter(r => r.isPublished).length}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-gray-900">
                  {reviews.filter(r => !r.isPublished).length}
                </p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Reviews
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'published'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending Approval
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading reviews...</div>
          ) : filteredReviews.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {filter === 'all' ? 'No reviews yet' : `No ${filter} reviews`}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <div key={review.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="font-semibold text-gray-900">{review.guestName}</h3>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{review.propertyName}</p>
                      <p className="text-gray-700 mb-4">{review.reviewText}</p>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => togglePublishStatus(review.id, !review.isPublished, review.guestName)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            review.isPublished
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {review.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                        
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          review.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {review.isPublished ? 'Published' : 'Pending'}
                        </span>
                      </div>
                    </div>
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