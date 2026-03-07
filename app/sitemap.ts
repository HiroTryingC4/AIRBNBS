import { MetadataRoute } from 'next';
import { mockProperties } from '@/lib/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://property-showcase.com'; // Replace with your actual domain

  // Static pages
  const staticPages = [
    '',
    '/gallery',
    '/availability',
    '/attractions',
    '/reviews',
    '/contact',
    '/properties',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic property pages
  const propertyPages = mockProperties.map((property) => ({
    url: `${baseUrl}/properties/${property.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...propertyPages];
}
