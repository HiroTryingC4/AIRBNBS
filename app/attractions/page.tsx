import { PublicLayout } from '@/components/public';
import Image from 'next/image';

// Mock attractions data organized by category
const attractionsData = {
  Beaches: [
    {
      id: '1',
      name: 'White Sand Beach',
      description: 'Pristine white sand beach with crystal clear turquoise waters. Perfect for swimming, snorkeling, and sunbathing.',
      distance: '0.3 km',
      travelTime: '5 min walk',
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
    },
    {
      id: '2',
      name: 'Sunset Cove',
      description: 'Beautiful secluded cove known for spectacular sunset views. Great for romantic evening walks.',
      distance: '1.2 km',
      travelTime: '15 min walk',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
    },
    {
      id: '3',
      name: 'Coral Bay',
      description: 'Excellent spot for snorkeling and diving with vibrant coral reefs and diverse marine life.',
      distance: '2.5 km',
      travelTime: '8 min drive',
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
    },
  ],
  Restaurants: [
    {
      id: '4',
      name: 'Seaside Grill',
      description: 'Fresh seafood restaurant with ocean views. Specializes in grilled fish and local delicacies.',
      distance: '0.8 km',
      travelTime: '10 min walk',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    },
    {
      id: '5',
      name: 'Mountain View Cafe',
      description: 'Cozy cafe serving breakfast and brunch with stunning mountain views. Known for their coffee and pastries.',
      distance: '1.5 km',
      travelTime: '5 min drive',
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop',
    },
    {
      id: '6',
      name: 'Local Flavors',
      description: 'Authentic Filipino cuisine in a traditional setting. Must-try: adobo, sinigang, and lechon.',
      distance: '2.0 km',
      travelTime: '7 min drive',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
    },
  ],
  'Tourist Spots': [
    {
      id: '7',
      name: 'Lighthouse Point',
      description: 'Historic lighthouse with panoramic views of the coastline. Great for photography and sightseeing.',
      distance: '3.5 km',
      travelTime: '12 min drive',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    },
    {
      id: '8',
      name: 'Waterfall Trail',
      description: 'Scenic hiking trail leading to a beautiful waterfall. Moderate difficulty, suitable for families.',
      distance: '5.0 km',
      travelTime: '15 min drive',
      imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&h=400&fit=crop',
    },
    {
      id: '9',
      name: 'Heritage Museum',
      description: 'Learn about local history and culture. Features artifacts, exhibits, and guided tours.',
      distance: '4.2 km',
      travelTime: '13 min drive',
      imageUrl: 'https://images.unsplash.com/photo-1565301660306-29e08751cc53?w=600&h=400&fit=crop',
    },
  ],
  Stores: [
    {
      id: '10',
      name: 'Fresh Market',
      description: 'Local farmers market with fresh produce, seafood, and handmade crafts. Open daily from 6 AM to 2 PM.',
      distance: '1.8 km',
      travelTime: '6 min drive',
      imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop',
    },
    {
      id: '11',
      name: 'Souvenir Shop',
      description: 'Wide selection of local souvenirs, handicrafts, and gifts. Perfect for bringing home memories.',
      distance: '2.3 km',
      travelTime: '8 min drive',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
    },
    {
      id: '12',
      name: 'Convenience Store',
      description: '24/7 convenience store with essentials, snacks, and beverages. ATM available.',
      distance: '0.5 km',
      travelTime: '7 min walk',
      imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=400&fit=crop',
    },
  ],
};

type Category = keyof typeof attractionsData;

export default function AttractionsPage() {
  const categories: Category[] = ['Beaches', 'Restaurants', 'Tourist Spots', 'Stores'];

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nearby Attractions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing places and activities near the property
          </p>
        </div>

        {/* Categories */}
        {categories.map((category) => (
          <section key={category} className="mb-16">
            {/* Category Header */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {category}
              </h2>
              <div className="w-20 h-1 bg-primary-600 rounded"></div>
            </div>

            {/* Attractions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attractionsData[category].map((attraction) => (
                <div
                  key={attraction.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-48">
                    <Image
                      src={attraction.imageUrl}
                      alt={attraction.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {attraction.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      {attraction.description}
                    </p>

                    {/* Distance Info */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-primary-600 font-medium">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{attraction.distance}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{attraction.travelTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Call to Action */}
        <div className="mt-16 bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Plan Your Perfect Getaway
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            With so much to explore, book your stay today!
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
