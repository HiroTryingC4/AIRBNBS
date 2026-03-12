import { PublicLayout } from '@/components/public';
import Link from 'next/link';

export default function PropertyNotFound() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <svg
              className="w-24 h-24 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Property Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sorry, we couldn't find the property you're looking for. It may have been removed or the link might be incorrect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors min-h-touch flex items-center justify-center"
            >
              Go to Homepage
            </Link>
            <Link
              href="/properties"
              className="px-8 py-3 bg-white text-brand-600 border-2 border-brand-600 rounded-lg font-medium hover:bg-brand-50 transition-colors min-h-touch flex items-center justify-center"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
