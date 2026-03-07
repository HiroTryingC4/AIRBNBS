import React from 'react';
import { render, screen } from '@testing-library/react';
import PropertyCard from '@/components/public/PropertyCard';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  },
}));

describe('PropertyCard', () => {
  const mockProperty = {
    id: '1',
    name: 'Beachfront Villa',
    location: 'Batangas, Philippines',
    bedCount: 3,
    bathroomCount: 2,
    guestCapacity: 8,
    thumbnailUrl: '/images/property-1.jpg',
    amenities: ['WiFi', 'Pool', 'Air Conditioning', 'Kitchen', 'Parking'],
  };

  it('renders property name', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Beachfront Villa')).toBeInTheDocument();
  });

  it('renders property location', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Batangas, Philippines')).toBeInTheDocument();
  });

  it('renders guest capacity', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('renders bed count', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders bathroom count', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders first 3 amenities', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('WiFi')).toBeInTheDocument();
    expect(screen.getByText('Pool')).toBeInTheDocument();
    expect(screen.getByText('Air Conditioning')).toBeInTheDocument();
  });

  it('shows "+X more" badge when there are more than 3 amenities', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });

  it('does not show "+X more" badge when there are 3 or fewer amenities', () => {
    const propertyWithFewAmenities = {
      ...mockProperty,
      amenities: ['WiFi', 'Pool'],
    };
    render(<PropertyCard property={propertyWithFewAmenities} />);
    expect(screen.queryByText(/\+\d+ more/)).not.toBeInTheDocument();
  });

  it('links to property detail page with generated slug', () => {
    render(<PropertyCard property={mockProperty} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/properties/beachfront-villa');
  });

  it('links to property detail page with provided slug', () => {
    const propertyWithSlug = {
      ...mockProperty,
      slug: 'custom-slug',
    };
    render(<PropertyCard property={propertyWithSlug} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/properties/custom-slug');
  });

  it('renders property image with correct alt text', () => {
    render(<PropertyCard property={mockProperty} />);
    const image = screen.getByAltText('Beachfront Villa - Batangas, Philippines');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/property-1.jpg');
  });

  it('renders as a clickable card', () => {
    const { container } = render(<PropertyCard property={mockProperty} />);
    const card = container.querySelector('a');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('href', '/properties/beachfront-villa');
  });
});
