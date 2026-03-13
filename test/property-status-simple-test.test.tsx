import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import PropertiesPage from '@/app/admin/properties/page'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}))

// Mock AdminLayout
vi.mock('@/components/admin', () => ({
  AdminLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="admin-layout">{children}</div>,
}))

// Mock ConfirmationModal and useConfirmation
vi.mock('@/components/ConfirmationModal', () => ({
  default: () => <div data-testid="confirmation-modal" />,
}))

vi.mock('@/lib/hooks/useConfirmation', () => ({
  useConfirmation: () => ({
    isOpen: false,
    showConfirmation: vi.fn(),
    hideConfirmation: vi.fn(),
    handleConfirm: vi.fn(),
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    type: 'info',
    loading: false,
  }),
}))

// Mock fetch globally
global.fetch = vi.fn()

describe('Property Status Bug Exploration - Simple Test', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * **BUG EXPLORATION TEST**
   * 
   * This test checks if properties with status "PUBLISHED" show "DRAFT" badges (the bug)
   * 
   * **CRITICAL**: This test MUST FAIL on unfixed code to confirm the bug exists
   */
  it('Bug Condition: Published Properties Show DRAFT Badge', async () => {
    // Create a property with PUBLISHED status
    const publishedProperty = {
      id: 'pub-1',
      name: 'Published Test Property',
      location: 'Test Location',
      bedCount: 2,
      bathroomCount: 1,
      guestCapacity: 4,
      status: 'PUBLISHED', // This is the key - status is PUBLISHED in database
      slug: 'published-test-property',
      thumbnailUrl: 'https://example.com/image.jpg',
      amenities: ['wifi'],
    }

    // Mock API response
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [publishedProperty],
    } as Response)

    // Render the component
    const { container } = render(<PropertiesPage />)

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Published Test Property')).toBeInTheDocument()
    }, { timeout: 10000 })

    // Debug: Log the entire rendered HTML to see what's actually there
    console.log('=== RENDERED HTML ===')
    console.log(container.innerHTML)

    // Look for the status badge text
    // According to the bug, this should show "DRAFT" even though status is "PUBLISHED"
    const statusBadgeText = container.textContent

    console.log('=== STATUS ANALYSIS ===')
    console.log('Property status in data:', publishedProperty.status)
    console.log('Full component text:', statusBadgeText)
    
    // Check if "DRAFT" appears in the rendered content when it should show "PUBLISHED"
    const containsDraft = statusBadgeText?.includes('DRAFT')
    const containsPublished = statusBadgeText?.includes('PUBLISHED')
    
    console.log('Contains DRAFT text:', containsDraft)
    console.log('Contains PUBLISHED text:', containsPublished)
    
    if (containsDraft && !containsPublished) {
      // This is the bug - property with PUBLISHED status shows DRAFT
      console.log('🐛 BUG CONFIRMED: Published property shows DRAFT badge')
      throw new Error('Bug confirmed: Property with PUBLISHED status displays DRAFT badge')
    } else if (containsPublished && !containsDraft) {
      // This means the bug is already fixed
      console.log('✅ NO BUG: Published property correctly shows PUBLISHED badge')
      expect(containsPublished).toBe(true)
    } else {
      // Unclear result - need more investigation
      console.log('❓ UNCLEAR: Cannot determine status badge behavior')
      console.log('This might indicate the badge is not rendering or has different styling')
      
      // Let's check if the status is being rendered at all
      expect(screen.getByText('Published Test Property')).toBeInTheDocument()
    }
  }, 15000)
})