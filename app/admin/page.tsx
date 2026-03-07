import { AdminLayout } from '@/components/admin';
import { mockProperties } from '@/lib/mockData';
import Link from 'next/link';

// Mock inquiries data
const mockInquiries = [
  {
    id: '1',
    guestName: 'Maria Santos',
    email: 'maria@example.com',
    propertyName: 'Beachfront Villa Paradise',
    message: 'Hi, I would like to book this property for next month...',
    date: '2024-01-15',
    isRead: false,
  },
  {
    id: '2',
    guestName: 'John Reyes',
    email: 'john@example.com',
    propertyName: 'Mountain View Retreat',
    message: 'Is this property available for the holidays?',
    date: '2024-01-14',
    isRead: false,
  },
  {
    id: '3',
    guestName: 'Lisa Chen',
    email: 'lisa@example.com',
    propertyName: 'Modern City Apartment',
    message: 'Can I bring my pet?',
    date: '2024-01-13',
    isRead: true,
  },
];

export default function AdminDashboard() {
  const unreadCount = mockInquiries.filter(i => !i.isRead).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
          <p className="text-gray-600">Welcome back! Here's what's happening with your properties.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/properties" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Properties</p>
                <p className="text-3xl font-bold text-gray-900">{mockProperties.length}</p>
                <p className="text-xs text-green-600 mt-1">All published</p>
              </div>
              <div className="text-4xl">🏠</div>
            </div>
          </Link>

          <Link href="/admin/inquiries" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Unread Inquiries</p>
                <p className="text-3xl font-bold text-gray-900">{unreadCount}</p>
                <p className="text-xs text-orange-600 mt-1">Needs attention</p>
              </div>
              <div className="text-4xl">💬</div>
            </div>
          </Link>

          <Link href="/admin/gallery" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Photos</p>
                <p className="text-3xl font-bold text-gray-900">48</p>
                <p className="text-xs text-gray-500 mt-1">Across all properties</p>
              </div>
              <div className="text-4xl">🖼️</div>
            </div>
          </Link>

          <Link href="/admin/reviews" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">8</p>
                <p className="text-xs text-gray-500 mt-1">5.0 average rating</p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              href="/admin/properties/new"
              className="px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors text-center min-h-touch flex items-center justify-center"
            >
              + Add Property
            </Link>
            <Link
              href="/admin/calendar"
              className="px-4 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-medium hover:border-primary-600 hover:text-primary-600 transition-colors text-center min-h-touch flex items-center justify-center"
            >
              Manage Calendar
            </Link>
            <Link
              href="/admin/gallery"
              className="px-4 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-medium hover:border-primary-600 hover:text-primary-600 transition-colors text-center min-h-touch flex items-center justify-center"
            >
              Upload Photos
            </Link>
            <Link
              href="/admin/inquiries"
              className="px-4 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-medium hover:border-primary-600 hover:text-primary-600 transition-colors text-center min-h-touch flex items-center justify-center"
            >
              View Inquiries
            </Link>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Inquiries</h3>
            <Link href="/admin/inquiries" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {mockInquiries.slice(0, 3).map((inquiry) => (
              <div key={inquiry.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{inquiry.guestName}</h4>
                      {!inquiry.isRead && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{inquiry.propertyName}</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{inquiry.message}</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-4">{inquiry.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
