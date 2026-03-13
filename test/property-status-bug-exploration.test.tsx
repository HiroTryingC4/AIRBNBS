import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import * as fc from 'fast-check'
import PropertiesPage from '@/app/admin/properties/page'

// Mock Next.js router
const mockPush = vi.fn()
const mockRouter = {
  push: mockPush,
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
}

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
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

interface MockProperty {
  id: string
  name: string
  location: string
  bedCount: number
  bathroomCount: number
  guestCapacity: number
  status: string
  slug: string
  thumbnailUrl: string
  amenities: string[]
}

describe('Property Status Bug Exploration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * **Validates: Requirements 1.1, 1.2, 1.3**
   * 
   * Property 1: Bug Condition - Published Properties Show DRAFT Badge
   * 
   * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
   * 
   * This test explores the bug condition where properties with 
   * status "PUBLISHED" in the database display "DRAFT" text in the status badge.
   * The test is scoped to the concrete failing case to ensure reproducibility.
   */
  it('Property 1: Bug Condition - Published Properties Show DRAFT Badge', async () => {
    // Create properties with different statuses to test the bug
    const properties: MockProperty[] = [
      {
        id: 'pub-1',
        name: 'Published Property',
        location: 'Test Location 1',
        bedCount: 2,
        bathroomCount: 1,
        guestCapacity: 4,
        status: 'PUBLISHED',
        slug: 'published-property',
        thumbnailUrl: 'https://example.com/image1.jpg',
        amenities: ['wifi'],
      },
      {
        id: 'draft-1',
        name: 'Draft Property',
        location: 'Test Location 2',
        bedCount: 1,
        bathroomCount: 1,
        guestCapacity: 2,
        status: 'DRAFT',
        slug: 'draft-property',
        thumbnailUrl: 'https://example.com/image2.jpg',
        amenities: ['parking'],
      },
      {
        id: 'unpub-1',
        name: 'Unpublished Property',
        location: 'Test Location 3',
        bedCount: 3,
        bathroomCount: 2,
        guestCapacity: 6,
        status: 'UNPUBLISHED',
        slug: 'unpublished-property',
        thumbnailUrl: 'https://example.com/image3.jpg',
        amenities: ['pool'],
      }
    ]

    // Mock API response with multiple properties
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => properties,
    } as Response)

    // Render the component
    render(<PropertiesPage />)

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Published Property')).toBeInTheDocument()
      expect(screen.getByText('Draft Property')).toBeInTheDocument()
      expect(screen.getByText('Unpublished Property')).toBeInTheDocument()
    }, { timeout: 10000 })

    // Find all status badges - they should be in spans with specific classes
    const statusElements = screen.container.querySelectorAll('.bg-green-100.text-green-800')
    
    console.log('Found status elements:', statusElements.length)
    statusElements.forEach((element, index) => {
      console.log(`Status element ${index}:`, element.textContent)
    })

    // According to the bug description, ALL properties should show "DRAFT" regardless of actual status
    // This means even the PUBLISHED property should show "DRAFT" (which is the bug)
    
    // Check if the bug exists: if all badges show "DRAFT", then the bug is confirmed
    const allShowDraft = Array.from(statusElements).every(element => 
      element.textContent?.trim() === 'DRAFT'
    )
    
    if (allShowDraft && statusElements.length > 0) {
      // Bug confirmed: all properties show DRAFT regardless of actual status
      throw new Error('Bug confirmed: All properties show DRAFT status regardless of actual database status')
    }
    
    // If we reach here, either the bug doesn't exist or our test needs adjustment
    // Let's check what the PUBLISHED property actually shows
    const publishedPropertyBadge = statusElements[0] // Assuming first property is the published one
    if (publishedPropertyBadge) {
      expect(publishedPropertyBadge.textContent?.trim()).toBe('PUBLISHED')
    }
  }, 15000)

  it('Verification: Draft Properties Show DRAFT Badge (should pass on unfixed code)', async () => {
    // This test verifies that actual DRAFT properties work correctly
    // It should PASS on unfixed code to confirm the bug is specific to PUBLISHED properties
    const draftProperty: MockProperty = {
      id: 'draft-1',
      name: 'Draft Property',
      location: 'Test Location',
      bedCount: 2,
      bathroomCount: 1,
      guestCapacity: 4,
      status: 'DRAFT',
      slug: 'draft-property',
      thumbnailUrl: 'https://example.com/image.jpg',
      amenities: ['wifi', 'parking'],
    }

    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [draftProperty],
    } as Response)

    render(<PropertiesPage />)

    await waitFor(() => {
      expect(screen.getByText(draftProperty.name)).toBeInTheDocument()
    })

    const statusBadge = screen.getByText(draftProperty.status)
    expect(statusBadge).toHaveTextContent('DRAFT')
  })
})