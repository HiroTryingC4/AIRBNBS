'use client';

import { PublicLayout } from '@/components/public';
import { useState } from 'react';

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    guestName: 'Maria Santos',
    rating: 5,
    reviewText: 'Absolutely stunning property! The views were breathtaking and the amenities exceeded our expectations. The host was very responsive and helpful throughout our stay. We had an amazing time and can\'t wait to come back!',
    date: '2024-01-15',
  },
  {
    id: '2',
    guestName: 'John Reyes',
    rating: 5,
    reviewText: 'Perfect for our family vacation. The kids loved the pool and we enjoyed the peaceful surroundings. Everything was clean and well-maintained. The location was ideal for exploring nearby attractions. Highly recommended!',
    date: '2023-12-20',
  },
  {
    id: '3',
    guestName: 'Lisa Chen',
    rating: 5,
    reviewText: 'Great location, beautiful property, and excellent host. Everything was clean and well-maintained. The kitchen was fully equipped which made cooking easy. The beds were very comfortable. Will definitely book again!',
    date: '2023-11-10',
  },
  {
    id: '4',
    guestName: 'Michael Johnson',
    rating: 5,
    reviewText: 'We had a wonderful stay! The property was exactly as described in the photos. The outdoor space was perfect for relaxing and the neighborhood was quiet and safe. Great communication with the host.',
    date: '2023-10-25',
  },
  {
    id: '5',
    guestName: 'Sarah Williams',
    rating: 5,
    reviewText: 'This place exceeded all our expectations! The attention to detail was impressive. From the welcome basket to the thoughtful amenities, everything was perfect. The location is unbeatable.',
    date: '2023-09-18',
  },
  {
    id: '6',
    guestName: 'David Martinez',
    rating: 5,
    reviewText: 'Amazing property with stunning views! The host went above and beyond to make our stay comfortable. The property was spotless and had everything we needed. Would love to return!',
    date: '2023-08-30',
  },
  {
    id: '7',
    guestName: 'Emma Brown',
    rating: 5,
    reviewText: 'Perfect getaway spot! The property is beautiful and well-maintained. We loved the outdoor area and spent most of our time there. The host provided excellent recommendations for local restaurants.',
    date: '2023-07-22',
  },
  {
    id: '8',
    guestName: 'James Wilson',
    rating: 5,
    reviewText: 'Fantastic experience from start to finish. The check-in process was smooth, the property was immaculate, and the location was perfect. We enjoyed every moment of our stay.',
    date: '2023-06-15',
  },
];

export default function ReviewsPage() {
  const [sortBy, setSortBy] = useState<'newest' | 'highest'>('newest');

  // Calculate statistics
  const totalReviews = mockReviews.length;
  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
  const ratingCounts = mockReviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Sort reviews
  const sortedReviews = [...mockReviews].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.rating - a.rating;
    }
  });

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Guest Reviews
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what our guests have to say about their experience
          </p>
        </div>

        {/* Overall Rating Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Overall Score */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <div className="text-6xl font-bold text-primary-600">
                    {averageRating.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-6 h-6 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600">Based on {totalReviews} reviews</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Guests consistently rate this property 5 stars for cleanliness, location, and hospitality.
                </p>
              </div>

              {/* Right: Rating Breakdown */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingCounts[rating] || 0;
                  const percentage = (count / totalReviews) * 100;
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 w-12">
                        {rating} star{rating !== 1 && 's'}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-yellow-400 h-3 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            All Reviews ({totalReviews})
          </h2>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-600">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'highest')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="max-w-4xl mx-auto space-y-6 mb-12">
          {sortedReviews.length > 0 ? (
            sortedReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-lg">
                        {review.guestName.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {review.guestName}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-gray-600 text-lg">No reviews yet</p>
              <p className="text-gray-500 mt-2">Be the first to leave a review!</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Experience It Yourself
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Join our happy guests and book your stay today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/availability"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors min-h-touch flex items-center justify-center"
            >
              Check Availability
            </a>
            <a
              href="/contact"
              className="px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors min-h-touch flex items-center justify-center"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
