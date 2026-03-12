'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin';

export default function ContentEditorPage() {
  const [activeSection, setActiveSection] = useState<'hero' | 'about' | 'contact' | 'footer'>('hero');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Content state
  const [content, setContent] = useState({
    hero: {
      title: 'Discover Your Perfect Getaway',
      subtitle: 'Experience luxury and comfort in our carefully curated properties',
      backgroundImage: '/images/hero-bg.jpg',
    },
    about: {
      title: 'About Our Properties',
      description: 'We offer premium accommodations with exceptional service and amenities. Our properties are located in the heart of the city, providing easy access to attractions, restaurants, and entertainment.',
      features: [
        'Prime locations',
        'Modern amenities',
        '24/7 support',
        'Flexible booking'
      ]
    },
    contact: {
      phone: '+63 912 345 6789',
      email: 'info@propertyshowcase.com',
      address: 'Trees Residences, Quezon City, Philippines',
      hours: 'Available 24/7'
    },
    footer: {
      companyName: 'Property Showcase',
      description: 'Your trusted partner for premium accommodations',
      socialLinks: {
        facebook: 'https://facebook.com/propertyshowcase',
        instagram: 'https://instagram.com/propertyshowcase',
        twitter: 'https://twitter.com/propertyshowcase'
      }
    }
  });

  // Load content from API on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async (section: string) => {
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ section: section.toLowerCase(), content: content[section.toLowerCase() as keyof typeof content] })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `${section} content updated successfully!` });
      } else {
        throw new Error('Failed to update content');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update content. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Editor</h1>
          <p className="text-gray-600">Manage website content and settings</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Content Sections</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveSection('hero')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === 'hero'
                        ? 'bg-brand-50 text-brand-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Hero Section
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('about')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === 'about'
                        ? 'bg-brand-50 text-brand-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    About Section
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('contact')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === 'contact'
                        ? 'bg-brand-50 text-brand-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Contact Info
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('footer')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === 'footer'
                        ? 'bg-brand-50 text-brand-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Footer
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          {/* Content Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
                </div>
              ) : (
                <>
              {/* Hero Section */}
              {activeSection === 'hero' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Hero Section</h2>
                  <form onSubmit={(e) => { e.preventDefault(); handleSave('Hero'); }} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Main Title
                      </label>
                      <input
                        type="text"
                        value={content.hero.title}
                        onChange={(e) => setContent({
                          ...content,
                          hero: { ...content.hero, title: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtitle
                      </label>
                      <textarea
                        rows={3}
                        value={content.hero.subtitle}
                        onChange={(e) => setContent({
                          ...content,
                          hero: { ...content.hero, subtitle: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background Image URL
                      </label>
                      <input
                        type="url"
                        value={content.hero.backgroundImage}
                        onChange={(e) => setContent({
                          ...content,
                          hero: { ...content.hero, backgroundImage: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Hero Section'}
                    </button>
                  </form>
                </div>
              )}

              {/* About Section */}
              {activeSection === 'about' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">About Section</h2>
                  <form onSubmit={(e) => { e.preventDefault(); handleSave('About'); }} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={content.about.title}
                        onChange={(e) => setContent({
                          ...content,
                          about: { ...content.about, title: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={5}
                        value={content.about.description}
                        onChange={(e) => setContent({
                          ...content,
                          about: { ...content.about, description: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Features (one per line)
                      </label>
                      <textarea
                        rows={4}
                        value={content.about.features.join('\n')}
                        onChange={(e) => setContent({
                          ...content,
                          about: { ...content.about, features: e.target.value.split('\n').filter(f => f.trim()) }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save About Section'}
                    </button>
                  </form>
                </div>
              )}

              {/* Contact Section */}
              {activeSection === 'contact' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                  <form onSubmit={(e) => { e.preventDefault(); handleSave('Contact'); }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={content.contact.phone}
                          onChange={(e) => setContent({
                            ...content,
                            contact: { ...content.contact, phone: e.target.value }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={content.contact.email}
                          onChange={(e) => setContent({
                            ...content,
                            contact: { ...content.contact, email: e.target.value }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        rows={3}
                        value={content.contact.address}
                        onChange={(e) => setContent({
                          ...content,
                          contact: { ...content.contact, address: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Hours
                      </label>
                      <input
                        type="text"
                        value={content.contact.hours}
                        onChange={(e) => setContent({
                          ...content,
                          contact: { ...content.contact, hours: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Contact Info'}
                    </button>
                  </form>
                </div>
              )}

              {/* Footer Section */}
              {activeSection === 'footer' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Footer Content</h2>
                  <form onSubmit={(e) => { e.preventDefault(); handleSave('Footer'); }} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={content.footer.companyName}
                        onChange={(e) => setContent({
                          ...content,
                          footer: { ...content.footer, companyName: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Description
                      </label>
                      <textarea
                        rows={3}
                        value={content.footer.description}
                        onChange={(e) => setContent({
                          ...content,
                          footer: { ...content.footer, description: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Links</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Facebook URL
                          </label>
                          <input
                            type="url"
                            value={content.footer.socialLinks.facebook}
                            onChange={(e) => setContent({
                              ...content,
                              footer: {
                                ...content.footer,
                                socialLinks: { ...content.footer.socialLinks, facebook: e.target.value }
                              }
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Instagram URL
                          </label>
                          <input
                            type="url"
                            value={content.footer.socialLinks.instagram}
                            onChange={(e) => setContent({
                              ...content,
                              footer: {
                                ...content.footer,
                                socialLinks: { ...content.footer.socialLinks, instagram: e.target.value }
                              }
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Twitter URL
                          </label>
                          <input
                            type="url"
                            value={content.footer.socialLinks.twitter}
                            onChange={(e) => setContent({
                              ...content,
                              footer: {
                                ...content.footer,
                                socialLinks: { ...content.footer.socialLinks, twitter: e.target.value }
                              }
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Footer Content'}
                    </button>
                  </form>
                </div>
              )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}