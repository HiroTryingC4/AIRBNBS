import { render, screen, fireEvent } from '@testing-library/react';
import PublicLayout from '@/components/public/PublicLayout';
import AdminLayout from '@/components/admin/AdminLayout';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe('PublicLayout', () => {
  it('renders navigation links', () => {
    render(
      <PublicLayout>
        <div>Test Content</div>
      </PublicLayout>
    );

    // Check for navigation links (may appear multiple times in nav and footer)
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Properties').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Gallery').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Availability').length).toBeGreaterThan(0);
    expect(screen.getByText('Nearby Attractions')).toBeInTheDocument();
    expect(screen.getByText('Reviews')).toBeInTheDocument();
    expect(screen.getAllByText('Contact').length).toBeGreaterThan(0);
  });

  it('renders children content', () => {
    render(
      <PublicLayout>
        <div>Test Content</div>
      </PublicLayout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    render(
      <PublicLayout>
        <div>Test Content</div>
      </PublicLayout>
    );

    const menuButton = screen.getByLabelText('Toggle menu');
    
    // Initially, mobile menu should not be visible (we can check aria-expanded)
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    
    // Click to open
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    
    // Click to close
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('has minimum touch target size for mobile buttons', () => {
    render(
      <PublicLayout>
        <div>Test Content</div>
      </PublicLayout>
    );

    const menuButton = screen.getByLabelText('Toggle menu');
    
    // Check that button has touch-friendly classes
    expect(menuButton.className).toContain('min-w-touch');
    expect(menuButton.className).toContain('min-h-touch');
  });
});

describe('AdminLayout', () => {
  it('renders sidebar navigation links', () => {
    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    );

    // Check for sidebar navigation links (may appear in sidebar and header)
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
    expect(screen.getByText('Property Management')).toBeInTheDocument();
    expect(screen.getByText('Calendar Management')).toBeInTheDocument();
    expect(screen.getByText('Gallery Manager')).toBeInTheDocument();
    expect(screen.getByText('Inquiry Manager')).toBeInTheDocument();
    expect(screen.getByText('Content Editor')).toBeInTheDocument();
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('has logout button', () => {
    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    );

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('toggles sidebar when menu button is clicked', () => {
    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    );

    const openButton = screen.getByLabelText('Open sidebar');
    
    // Click to open sidebar
    fireEvent.click(openButton);
    
    // Check that close button appears
    const closeButton = screen.getByLabelText('Close sidebar');
    expect(closeButton).toBeInTheDocument();
    
    // Click to close
    fireEvent.click(closeButton);
  });

  it('has minimum touch target size for mobile buttons', () => {
    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    );

    const menuButton = screen.getByLabelText('Open sidebar');
    
    // Check that button has touch-friendly classes
    expect(menuButton.className).toContain('min-w-touch');
    expect(menuButton.className).toContain('min-h-touch');
  });

  it('displays View Site link', () => {
    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    );

    const viewSiteLink = screen.getByText('View Site');
    expect(viewSiteLink).toBeInTheDocument();
    expect(viewSiteLink.closest('a')).toHaveAttribute('href', '/');
    expect(viewSiteLink.closest('a')).toHaveAttribute('target', '_blank');
  });
});
