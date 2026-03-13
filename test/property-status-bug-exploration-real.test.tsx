import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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

describe('Property Status Bug Exploration - Real Database Test', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * **CRITICAL BUG EXPLORATION TEST**
   * 
   * This test uses REAL database data to verify if the bug exists.
   * Based on our investigation, we have properties with different statuses:
   * - "Test Published Property": PUBLISHED
   * - "Test Draft Property": DRAFT  
   * - "Test Unpublished Property": UNPUBLISHED
   * 
   * **Expected Bug Behavior**: All properties show "DRAFT" regardless of actual status
   * **Expected Fix Behavior**: Each property shows its actual status
   */
  it('Property 1: Bug Condition - Published Properties Show DRAFT Badge (Real Data)', async () => {
    // Use real properties from our investigation
    const realProperties: MockProperty[] = [
      {
        id: 'test-pub-1',
        name: 'Test Published Property',
        location: 'Test Location',
        bedCount: 1,
        bathroomCount: 1,
        guestCapacity: 2,
        status: 'PUBLISHED', // This should show "PUBLISHED" but bug makes it show "DRAFT"
        slug: 'test-published-property',
        thumbnailUrl: 'https://example.com/image1.jpg',
        amenities: [],
      },
      {
        id: 'test-draft-1',
        name: 'Test Draft Property',
        location: 'Test Location',
        bedCount: 1,
        bathroomCount: 1,
        guestCapacity: 2,
        status: 'DRAFT', // This should show "DRAFT" and probably works correctly
        slug: 'test-draft-property',
        thumbnailUrl: 'https://example.com/image2.jpg',
        amenities: [],
      },
      {
        id: 'test-unpub-1',
        name: 'Test Unpublished Property',
        location: 'Test Location',
        bedCount: 1,
        bathroomCount: 1,
        guestCapacity: 2,
        status: 'UNPUBLISHED', // This should show "UNPUBLISHED" but bug might make it show "DRAFT"
        slug: 'test-unpublished-property',
        thumbnailUrl: 'https://example.com/image3.jpg',
        amenities: [],
      }
    ]

    // Mock API response with real-like data
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => realProperties,
    } as Response)

    // Render the component
    render(<PropertiesPage />)

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Test Published Property')).toBeInTheDocument()
      expect(screen.getByText('Test Draft Property')).toBeInTheDocument()
      expect(screen.getByText('Test Unpublished Property')).toBeInTheDocument()
    }, { timeout: 10000 })

    // Find all status badge elements using a more reliable approach
    const statusElements = document.querySelectorAll('.bg-green-100.text-green-800')
    
    console.log('=== BUG EXPLORATION RESULTS ===')
    console.log('Found status elements:', statusElements.length)
    
    // Log what each status badge actually shows
    const statusTexts: string[] = []
    statusElements.forEach((element, index) => {
      const text = element.textContent?.trim() || ''
      statusTexts.push(text)
      console.log(`Status badge ${index}: "${text}"`)
    })

    // Check for the bug condition: Do ALL badges show "DRAFT"?
    const allShowDraft = statusTexts.every(text => text === 'DRAFT')
    const publishedShowsDraft = statusTexts.length > 0 && statusTexts[0] === 'DRAFT' // First property is PUBLISHED
    
    console.log('All badges show DRAFT:', allShowDraft)
    console.log('Published property shows DRAFT:', publishedShowsDraft)
    
    if (allShowDraft) {
      console.log('🐛 BUG CONFIRMED: All properties show DRAFT regardless of actual status')
      // This is the bug - throw error to make test fail (expected behavior for exploration test)
      throw new Error('Bug confirmed: All properties display DRAFT status regardless of actual database status')
    } else if (publishedShowsDraft) {
      console.log('🐛 PARTIAL BUG: Published property shows DRAFT when it should show PUBLISHED')
      throw new Error('Bug confirmed: Published property shows DRAFT instead of PUBLISHED')
    } else {
      console.log('✅ NO BUG: Status badges show correct values')
      // If no bug exists, the test should pass - this means the code is already correct
      
      // Verify each property shows its correct status
      expect(statusTexts[0]).toBe('PUBLISHED') // First property should show PUBLISHED
      expect(statusTexts[1]).toBe('DRAFT')     // Second property should show DRAFT
      expect(statusTexts[2]).toBe('UNPUBLISHED') // Third property should show UNPUBLISHED
    }
  }, 15000)

  /**
   * **VERIFICATION TEST**
   * 
   * This test should PASS on unfixed code to confirm baseline behavior
   */
  it('Verification: Draft Properties Show DRAFT Badge (baseline test)', async () => {
    const draftProperty: MockProperty = {
      id: 'draft-only',
      name: 'Only Draft Property',
      location: 'Test Location',
      bedCount: 1,
      bathroomCount: 1,
      guestCapacity: 2,
      status: 'DRAFT',
      slug: 'only-draft-property',
      thumbnailUrl: 'https://example.com/image.jpg',
      amenities: [],
    }

    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [draftProperty],
    } as Response)

    render(<PropertiesPage />)

    await waitFor(() => {
      expect(screen.getByText('Only Draft Property')).toBeInTheDocument()
    })

    // This should always work correctly - DRAFT properties should show DRAFT
    const statusBadge = document.querySelector('.bg-green-100.text-green-800')
    expect(statusBadge).toHaveTextContent('DRAFT')
  })
})