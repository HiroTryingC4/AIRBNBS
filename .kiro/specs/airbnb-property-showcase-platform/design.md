# Design Document: Airbnb Property Showcase Platform

## Overview

The Airbnb Property Showcase Platform is a full-stack web application that enables property owners to create professional showcase websites for their rental properties. The platform consists of two primary interfaces: a public-facing website for guests to browse properties and submit inquiries, and an authenticated admin dashboard for property owners to manage their listings.

### Technology Stack

**Frontend Framework**: Next.js 14 with App Router
- Server-side rendering for SEO optimization
- React Server Components for performance
- Built-in image optimization
- API routes for backend functionality

**Styling**: Tailwind CSS
- Responsive design utilities
- Mobile-first approach
- Customizable component library

**Database**: Vercel Postgres (Neon)
- Serverless PostgreSQL compatible with Vercel free tier
- Connection pooling for serverless functions
- SQL-based with Prisma ORM for type safety

**Authentication**: NextAuth.js
- Secure session management
- Password hashing with bcrypt
- JWT-based authentication

**Image Storage**: Vercel Blob Storage
- Integrated with Vercel platform
- Automatic CDN distribution
- Compatible with free tier limits

**Maps Integration**: Leaflet with OpenStreetMap
- Free, open-source mapping solution
- No API key required
- Customizable markers and interactions

**Deployment**: Vercel
- Automatic deployments from Git
- Serverless function execution
- Edge network CDN

### Key Design Decisions

1. **Next.js App Router**: Provides modern React patterns with server components, reducing client-side JavaScript and improving initial page load performance.

2. **Vercel Postgres**: Chosen over alternatives (Supabase, PlanetScale) for tighter integration with Vercel platform and simpler configuration within free tier limits.

3. **Vercel Blob Storage**: Eliminates need for third-party storage services (S3, Cloudinary) while staying within free tier constraints.

4. **Leaflet Maps**: Avoids Google Maps API costs while providing full-featured mapping capabilities.

5. **Server-Side Rendering**: Critical for SEO requirements, ensuring property pages are crawlable by search engines.

## User Experience & Page Layouts

### Navigation Structure

**Public Site Navigation**
- Home
- Properties
- Gallery
- Availability
- Nearby Attractions
- Reviews
- Contact

**Admin Dashboard Navigation**
- Property Management
- Calendar Management
- Gallery Manager
- Inquiry Manager
- Content Editor

### Page Specifications

#### 1. Homepage (Experience First)

**Goal**: Make visitors immediately imagine staying at the property.

**Hero Section**
- Full-screen photo or video of the property
- Property name overlay
- Location display
- Tagline (Example: "Your Private Beach Escape in Batangas")
- Action buttons:
  - Check Availability (scroll to calendar preview)
  - View Property (navigate to property detail)
  - Book on Airbnb (external link)

**Quick Property Overview**
- Visual icons with key stats:
  - 👥 Guest capacity (e.g., "8 Guests")
  - 🛏 Number of bedrooms (e.g., "3 Bedrooms")
  - 🚿 Bathrooms (e.g., "2 Bathrooms")
  - 🌊 Key feature (e.g., "Beachfront View")

**Featured Gallery Section**
- Grid layout showcasing best photos:
  - Living room
  - Bedrooms
  - Pool/beach
  - Outdoor areas
- "View Full Gallery" button

**Amenities Highlight**
- Icon grid displaying top amenities:
  - WiFi
  - Swimming Pool
  - Air Conditioning
  - Kitchen
  - Free Parking
  - Smart TV

**Guest Reviews Preview**
- 2-3 featured testimonials with star ratings
- Example: ⭐⭐⭐⭐⭐ "Amazing stay! The beach view was incredible."
- "Read More Reviews" button

**Availability Preview**
- Mini calendar showing current month
- Visual indicators for available/booked dates
- "Check Full Calendar" button

**Nearby Attractions Preview**
- Card layout with 3-4 featured attractions:
  - Anilao Diving Spots
  - Zambales Surfing Beach
  - Local Seafood Restaurants
- "Explore Area" button

**Call to Action Section**
- Compelling text: "Ready for your next staycation?"
- Primary buttons:
  - Check Availability
  - Book on Airbnb

#### 2. Property Page (Detailed Experience)

**Goal**: Provide complete information for booking decisions.

**Property Gallery**
- Large image slider with thumbnails
- Video integration for property tours
- Fullscreen lightbox capability

**Property Description**
- What makes the property unique
- Ideal guests (families, couples, groups)
- Stay experience narrative

**Room Details Section**
- Structured breakdown per room:
  - Master Bedroom: 1 Queen Bed, Air Conditioning, Private Bathroom
  - Guest Room: 2 Double Beds, Balcony View
  - Living Area: Sofa bed, Smart TV

**Amenities Section**
- Grouped by category:
  - Comfort: Air conditioning, Hot shower
  - Entertainment: Smart TV, WiFi
  - Kitchen: Refrigerator, Microwave, Cooking utensils
  - Outdoor: Pool, Garden, BBQ area

**Location Map**
- Embedded interactive map
- Property marker
- Nearby attractions marked
- Distance indicators

**Availability Calendar**
- Full interactive calendar
- Date range selection
- Visual status indicators
- "Send Inquiry" button

**Reviews Section**
- Full list of guest reviews
- Star ratings and average
- Sort by date (newest first)

**Contact Section**
- Quick inquiry form
- WhatsApp/Messenger buttons
- Property owner contact info

#### 3. Gallery Page

**Purpose**: Visual storytelling through organized media.

**Gallery Sections**
- Interior: Living spaces, bedrooms, bathrooms
- Bedrooms: Detailed bedroom shots
- Outdoor Area: Pool, garden, views
- Amenities: Kitchen, entertainment areas
- Drone Shots: Aerial property views
- Video Tour: Embedded walkthrough video

**Features**
- Masonry or grid layout
- Lightbox for full-screen viewing
- Touch gestures for mobile (swipe)
- Category filtering

#### 4. Availability Page

**Purpose**: Clear booking calendar with inquiry integration.

**Features**
- Full 12-month calendar view
- Color-coded date status:
  - Available (green)
  - Booked (red)
  - Past dates (gray)
- Month/year navigation
- Date range selection
- Optional Airbnb calendar sync indicator

**Guest Actions**
- Select desired dates
- Send inquiry with selected dates pre-filled
- Click "Book on Airbnb" button

#### 5. Nearby Attractions Page

**Purpose**: Help guests plan activities and explore the area.

**Sections by Category**

**Beaches**
- Name, description, distance
- Travel time estimate
- Photo thumbnail

**Restaurants**
- Local recommendations
- Cuisine type
- Distance from property

**Tourist Spots**
- Activities available
- Operating hours (if applicable)
- Distance and travel time

**Convenience Stores**
- Essential services nearby
- Distance information

**Layout**: Card-based grid with category tabs or sections

#### 6. Reviews Page

**Purpose**: Build trust through guest testimonials.

**Display Elements**
- Overall average rating (large display)
- Total review count
- Individual reviews with:
  - Guest name
  - Star rating (1-5)
  - Review text
  - Review date
  - Guest photos (optional)
- Sort options: Newest first, Highest rated
- Empty state: "No reviews yet. Be the first to stay!"

#### 7. Contact / Inquiry Page

**Purpose**: Easy communication with property owner.

**Inquiry Form Fields**
- Name (required)
- Email (required)
- Check-in date (optional)
- Check-out date (optional)
- Number of guests (optional)
- Message (required)

**Alternative Contact Methods**
- WhatsApp button with deep link
- Messenger button with deep link
- Phone number (click to call on mobile)
- Email address

**Form Behavior**
- Client-side validation
- Success confirmation message
- Error handling with field-specific messages

### Admin Dashboard Layout

**Purpose**: Centralized property management interface.

**Dashboard Sidebar Navigation**
- Property Management
- Calendar Management
- Gallery Manager
- Inquiry Manager
- Content Editor
- Account Settings
- Logout

**Property Management Page**
- List of all properties (published and draft)
- Status indicators
- Quick actions: Edit, Delete, Publish/Unpublish
- "Add New Property" button

**Property Form**
- Property name
- Description (rich text editor)
- Location (text + map picker for coordinates)
- Room count, bed count, bathroom count
- Amenities (multi-select checkboxes)
- Meta title and description (SEO)
- Status toggle (Draft/Published)

**Calendar Management Page**
- Interactive calendar
- Click to toggle date status (available/booked)
- Date range selection for bulk updates
- External calendar sync controls (optional)
- Last sync timestamp display

**Gallery Manager Page**
- Upload interface (drag-drop or file picker)
- Image preview grid
- Drag-to-reorder functionality
- Delete button per image
- Video URL input field
- Display order indicators

**Inquiry Manager Page**
- List of all inquiries
- Unread count badge
- Inquiry cards showing:
  - Guest name and email
  - Dates and guest count
  - Message preview
  - Property name
  - Timestamp
- Actions: Mark read/unread, Delete
- Sort by date (newest first)
- Filter by property

**Content Editor Page**
- Edit property descriptions
- Update amenities list
- Manage nearby attractions (add/edit/delete)
- Manage reviews (add/edit/delete)
- Update WhatsApp/Messenger contact info

### Design Principles

**Experience-First Approach**: Every page should help visitors imagine their stay, not just list features.

**Visual Hierarchy**: Use large, high-quality images to capture attention, with text supporting the visual story.

**Mobile-First Design**: Ensure all interactions work seamlessly on touch devices with appropriate touch targets (minimum 44px).

**Progressive Disclosure**: Show essential information first, with details available on demand (e.g., "View Full Gallery" instead of loading all images).

**Clear Calls-to-Action**: Every page should guide users toward the next step (check availability, send inquiry, book).

**Trust Building**: Prominently display reviews, professional photos, and complete information to build credibility.

## Architecture

### System Architecture

The platform follows a monolithic Next.js architecture with clear separation between public and authenticated routes:

```
┌─────────────────────────────────────────────────────────────┐
│                         Next.js App                          │
├─────────────────────────────────────────────────────────────┤
│  Public Routes              │  Protected Routes (Admin)      │
│  - Homepage (/)             │  - Dashboard (/admin)          │
│  - Properties (/properties) │  - Property Management         │
│  - Property Detail          │  - Inquiry Management          │
│  - Contact (/contact)       │  - Calendar Management         │
│                             │  - Media Management            │
├─────────────────────────────────────────────────────────────┤
│                      API Routes (/api)                       │
│  - Authentication           │  - Property CRUD               │
│  - Inquiry Submission       │  - Media Upload                │
│  - Property Filtering       │  - Availability Updates        │
├─────────────────────────────────────────────────────────────┤
│                    Data Access Layer                         │
│              Prisma ORM + Database Queries                   │
├─────────────────────────────────────────────────────────────┤
│                    Vercel Postgres Database                  │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

**Public Property Browsing**:
1. Guest requests property page
2. Next.js server component fetches data from database
3. Server renders HTML with property data
4. HTML sent to client with minimal JavaScript
5. Client-side hydration for interactive elements (calendar, gallery)

**Property Owner Management**:
1. Property owner authenticates via NextAuth.js
2. Session validated on protected route access
3. Admin dashboard loads with owner's properties
4. Updates submitted via API routes
5. Database updated and response returned
6. UI optimistically updated or revalidated

**Image Upload Flow**:
1. Property owner selects images in admin dashboard
2. Client-side validation (file size, format)
3. Images uploaded to Vercel Blob Storage via API route
4. Sharp library generates responsive sizes and WebP conversion
5. Database records created with blob URLs
6. UI updated with new images

### Data Flow Patterns

**Server-Side Rendering (SSR)**: Used for property detail pages to ensure SEO optimization and fast initial load.

**Client-Side Rendering (CSR)**: Used for admin dashboard interactions where SEO is not required and real-time updates are beneficial.

**Incremental Static Regeneration (ISR)**: Used for homepage and property listing pages to balance performance with data freshness (revalidate every 60 seconds).

**API Routes**: Handle all mutations (create, update, delete) and authenticated operations.

## Components and Interfaces

### Public Components

**PropertyCard**
- Displays property thumbnail, name, location, key details
- Props: property (Property object)
- Renders: Image, title, location, bed/bath count, amenities preview
- Links to property detail page

**PropertyGallery**
- Interactive image and video gallery with lightbox
- Props: media (Media[]), propertyName (string)
- Features: Thumbnail navigation, full-screen view, touch gestures
- Uses: react-image-lightbox or similar library

**AvailabilityCalendar**
- Interactive calendar showing available/booked dates
- Props: propertyId (string), availabilityData (Availability[]), editable (boolean)
- Features: Month navigation, date range selection, visual status indicators
- Uses: react-calendar or custom implementation

**PropertyFilter**
- Filter controls for property search
- Props: onFilterChange (function), initialFilters (FilterState)
- Controls: Location dropdown, property type, bed count, amenities checkboxes
- Emits: Filter change events to parent

**InquiryForm**
- Guest inquiry submission form
- Props: propertyId (string), propertyName (string)
- Fields: Name, email, check-in, check-out, guest count, message
- Validation: Client-side and server-side
- Submits to: /api/inquiries

**MapDisplay**
- Embedded map with property location marker
- Props: latitude (number), longitude (number), propertyName (string)
- Uses: Leaflet with OpenStreetMap tiles
- Features: Zoom, pan, marker popup

**ReviewsList**
- Displays guest reviews with ratings
- Props: reviews (Review[]), averageRating (number)
- Renders: Star ratings, review text, guest name, date
- Sorted: Newest first

**AttractionsSection**
- Lists nearby attractions grouped by category
- Props: attractions (Attraction[])
- Groups: Restaurants, beaches, tourist destinations, stores
- Displays: Name, description, distance, category

### Admin Components

**PropertyList**
- Lists all properties for authenticated owner
- Props: properties (Property[])
- Features: Status indicators, edit/delete actions, create new button
- Links to: Property edit pages

**PropertyForm**
- Form for creating/editing property details
- Props: property (Property | null), onSave (function)
- Fields: Name, description, location, counts, amenities, status
- Validation: Required fields, data types
- Submits to: /api/properties

**MediaManager**
- Upload and organize property media
- Props: propertyId (string), media (Media[])
- Features: Drag-drop upload, reorder, delete, video URL input
- Uploads to: /api/media/upload
- Supports: JPEG, PNG, WebP, YouTube/Vimeo URLs

**CalendarManager**
- Admin interface for managing availability
- Props: propertyId (string), availability (Availability[])
- Features: Click to toggle dates, date range selection, bulk updates
- Updates via: /api/availability

**InquiryManager**
- View and manage guest inquiries
- Props: inquiries (Inquiry[])
- Features: Read/unread status, sort by date, delete, unread count badge
- Displays: Guest details, dates, message, property name

**AttractionsManager**
- Add/edit/delete nearby attractions
- Props: propertyId (string), attractions (Attraction[])
- Form fields: Name, description, distance, category
- CRUD operations via: /api/attractions

**DashboardLayout**
- Layout wrapper for admin pages
- Features: Navigation sidebar, header with logout, responsive menu
- Protects: All admin routes with authentication check

### API Endpoints

**Authentication**
- POST /api/auth/register - Create new property owner account
- POST /api/auth/login - Authenticate property owner (handled by NextAuth)
- POST /api/auth/logout - Terminate session

**Properties**
- GET /api/properties - List all published properties (public)
- GET /api/properties/:id - Get single property details (public)
- POST /api/properties - Create new property (authenticated)
- PUT /api/properties/:id - Update property (authenticated, owner only)
- DELETE /api/properties/:id - Delete property (authenticated, owner only)
- GET /api/admin/properties - List owner's properties (authenticated)

**Media**
- POST /api/media/upload - Upload images to Vercel Blob (authenticated)
- PUT /api/media/reorder - Update media display order (authenticated)
- DELETE /api/media/:id - Delete media item (authenticated)
- POST /api/media/video - Add video URL (authenticated)

**Availability**
- GET /api/availability/:propertyId - Get availability data (public)
- PUT /api/availability/:propertyId - Update availability (authenticated)
- POST /api/availability/sync - Sync external calendar (authenticated, optional)

**Inquiries**
- POST /api/inquiries - Submit guest inquiry (public)
- GET /api/admin/inquiries - List owner's inquiries (authenticated)
- PUT /api/inquiries/:id - Update inquiry status (authenticated)
- DELETE /api/inquiries/:id - Delete inquiry (authenticated)

**Attractions**
- GET /api/attractions/:propertyId - Get property attractions (public)
- POST /api/attractions - Create attraction (authenticated)
- PUT /api/attractions/:id - Update attraction (authenticated)
- DELETE /api/attractions/:id - Delete attraction (authenticated)

**Reviews**
- GET /api/reviews/:propertyId - Get property reviews (public)
- POST /api/reviews - Create review (authenticated)
- PUT /api/reviews/:id - Update review (authenticated)
- DELETE /api/reviews/:id - Delete review (authenticated)

**Contact**
- POST /api/contact - Submit general contact message (public)
- GET /api/admin/contact - List contact messages (authenticated)

## Data Models

### Database Schema

```prisma
model PropertyOwner {
  id            String      @id @default(cuid())
  email         String      @unique
  passwordHash  String
  name          String
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  properties    Property[]
  
  @@map("property_owners")
}

model Property {
  id            String      @id @default(cuid())
  ownerId       String
  name          String
  description   String      @db.Text
  location      String
  latitude      Float?
  longitude     Float?
  roomCount     Int
  bedCount      Int
  bathroomCount Int
  amenities     String[]
  status        PropertyStatus @default(DRAFT)
  metaTitle     String?
  metaDescription String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  owner         PropertyOwner @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  media         Media[]
  availability  Availability[]
  inquiries     Inquiry[]
  attractions   Attraction[]
  reviews       Review[]
  
  @@map("properties")
  @@index([ownerId])
  @@index([status])
}

enum PropertyStatus {
  DRAFT
  PUBLISHED
}

model Media {
  id            String      @id @default(cuid())
  propertyId    String
  mediaType     MediaType
  url           String
  thumbnailUrl  String?
  mediumUrl     String?
  displayOrder  Int         @default(0)
  createdAt     DateTime    @default(now())
  
  property      Property    @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  
  @@map("media")
  @@index([propertyId])
}

enum MediaType {
  IMAGE
  VIDEO
}

model Availability {
  id            String      @id @default(cuid())
  propertyId    String
  date          DateTime    @db.Date
  status        AvailabilityStatus
  
  property      Property    @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  
  @@unique([propertyId, date])
  @@map("availability")
  @@index([propertyId, date])
}

enum AvailabilityStatus {
  AVAILABLE
  BOOKED
}

model Inquiry {
  id            String      @id @default(cuid())
  propertyId    String
  guestName     String
  guestEmail    String
  checkInDate   DateTime?   @db.Date
  checkOutDate  DateTime?   @db.Date
  guestCount    Int?
  message       String      @db.Text
  status        InquiryStatus @default(UNREAD)
  createdAt     DateTime    @default(now())
  
  property      Property    @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  
  @@map("inquiries")
  @@index([propertyId])
  @@index([status])
  @@index([createdAt])
}

enum InquiryStatus {
  UNREAD
  READ
}

model Attraction {
  id            String      @id @default(cuid())
  propertyId    String
  name          String
  description   String      @db.Text
  distance      String
  category      AttractionCategory
  createdAt     DateTime    @default(now())
  
  property      Property    @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  
  @@map("attractions")
  @@index([propertyId])
}

enum AttractionCategory {
  RESTAURANT
  BEACH
  TOURIST_DESTINATION
  STORE
  OTHER
}

model Review {
  id            String      @id @default(cuid())
  propertyId    String
  guestName     String
  rating        Int
  reviewText    String      @db.Text
  reviewDate    DateTime    @db.Date
  createdAt     DateTime    @default(now())
  
  property      Property    @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  
  @@map("reviews")
  @@index([propertyId])
}

model ContactMessage {
  id            String      @id @default(cuid())
  name          String
  email         String
  message       String      @db.Text
  status        InquiryStatus @default(UNREAD)
  createdAt     DateTime    @default(now())
  
  @@map("contact_messages")
  @@index([status])
  @@index([createdAt])
}
```

### Data Relationships

- PropertyOwner → Property (one-to-many): An owner can manage multiple properties
- Property → Media (one-to-many): A property can have multiple images and videos
- Property → Availability (one-to-many): A property has availability records for each date
- Property → Inquiry (one-to-many): A property can receive multiple inquiries
- Property → Attraction (one-to-many): A property can have multiple nearby attractions
- Property → Review (one-to-many): A property can have multiple reviews

### Data Validation Rules

**PropertyOwner**
- Email must be valid format and unique
- Password must be minimum 8 characters (enforced at application level)
- Name must not be empty

**Property**
- Name, description, location are required
- Room count, bed count, bathroom count must be positive integers
- Amenities stored as array of strings
- Status defaults to DRAFT
- Latitude/longitude optional but must be valid coordinates if provided

**Media**
- URL must be valid
- Display order used for sorting in gallery
- MediaType determines rendering (embedded player for VIDEO)

**Availability**
- Date must be unique per property
- Status determines visual representation in calendar

**Inquiry**
- Guest name, email, message are required
- Email must be valid format
- Check-in/check-out dates optional but check-out must be after check-in if both provided
- Guest count must be positive integer if provided

**Attraction**
- Name, description, distance, category are required
- Category must be one of defined enum values

**Review**
- Rating must be integer between 1 and 5
- Guest name and review text are required
- Review date stored separately from creation timestamp


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property Reflection

After analyzing all acceptance criteria, several properties were identified as redundant or combinable:

- Properties for deleting different entity types (properties, media, inquiries, attractions, reviews) follow the same pattern and can be validated through a common deletion property pattern
- Image and video deletion (3.5, 4.4) are both media deletion operations
- Status update operations (inquiry read/unread, property publish/unpublish) follow the same pattern
- Multiple CRUD operations can be validated through round-trip properties
- Validation properties for different forms (inquiry, contact) share common validation logic

The following properties represent the unique, non-redundant correctness guarantees for the platform:

### Property 1: Required Field Validation

For any property data object with missing required fields (name, description, location, room count, bed count, bathroom count), validation should reject the data and return field-specific error messages.

**Validates: Requirements 1.2**

### Property 2: Multi-Property Ownership

For any property owner, creating multiple properties should result in all properties being associated with that owner and retrievable through the owner's property list query.

**Validates: Requirements 1.5, 2.1, 2.2**

### Property 3: Property Deletion

For any property, when deleted by its owner, the property should no longer appear in any queries and all related data (media, availability, inquiries, attractions, reviews) should be cascade deleted due to foreign key constraints.

**Validates: Requirements 2.4**

### Property 4: Published Status Filtering

For any set of properties with mixed statuses (published/unpublished), querying public properties should return only those with published status, while admin queries should return all properties for the owner.

**Validates: Requirements 2.5, 23.2**

### Property 5: Media Display Order

For any collection of media items with assigned display orders, reordering should update the display_order field correctly, and subsequent queries should return media sorted by display_order ascending.

**Validates: Requirements 3.4**

### Property 6: Video URL Validation

For any string, video URL validation should accept valid YouTube and Vimeo URL formats and reject invalid formats with appropriate error messages.

**Validates: Requirements 4.2**

### Property 7: Bulk Date Range Updates

For any date range (start date and end date), marking the range as booked or available should create or update availability records for all dates in the range inclusively.

**Validates: Requirements 6.4**

### Property 8: Availability Round-Trip

For any property and availability data, updating availability then querying it back should return the same availability status for each date.

**Validates: Requirements 6.5**

### Property 9: Inquiry Required Field Validation

For any inquiry submission with empty name, email, or message fields, validation should reject the submission and return field-specific error messages.

**Validates: Requirements 8.2**

### Property 10: Email Format Validation

For any string, email validation should accept valid email formats (containing @ and domain) and reject invalid formats with appropriate error messages.

**Validates: Requirements 8.3, 22.2**

### Property 11: Inquiry Ownership Filtering

For any property owner, querying inquiries should return only inquiries for properties owned by that owner, not inquiries for other owners' properties.

**Validates: Requirements 9.1**

### Property 12: Inquiry Display Completeness

For any inquiry, the rendered display should include all required fields: guest name, email, check-in date, check-out date, guest count, and message.

**Validates: Requirements 9.2**

### Property 13: Inquiry Date Sorting

For any collection of inquiries with different creation timestamps, sorting by date should order them with newest first (descending order by created_at).

**Validates: Requirements 9.3**

### Property 14: Inquiry Status Updates

For any inquiry, updating its status from unread to read (or vice versa) should persist the change, and subsequent queries should reflect the updated status.

**Validates: Requirements 9.4**

### Property 15: Unread Inquiry Count

For any set of inquiries belonging to an owner, the unread count should equal the number of inquiries with status UNREAD.

**Validates: Requirements 9.5**

### Property 16: WhatsApp Deep Link Generation

For any property with WhatsApp phone number configured, the generated WhatsApp link should follow the format `https://wa.me/{phone}?text={encoded_message}` with properly URL-encoded message text.

**Validates: Requirements 10.3**

### Property 17: Messenger Deep Link Generation

For any property with Messenger username configured, the generated Messenger link should follow the format `https://m.me/{username}`.

**Validates: Requirements 10.4**

### Property 18: Map Marker Coordinates

For any property with latitude and longitude set, the map component should be initialized with those exact coordinates for the marker position.

**Validates: Requirements 11.2**

### Property 19: Attraction Grouping by Category

For any collection of attractions with different categories, grouping by category should organize attractions into separate groups (RESTAURANT, BEACH, TOURIST_DESTINATION, STORE, OTHER) with all attractions of the same category together.

**Validates: Requirements 12.4**

### Property 20: Attraction Distance Display

For any attraction, the rendered display should include the distance field value.

**Validates: Requirements 12.5**

### Property 21: Property Filtering

For any set of properties and any combination of filters (location, property type, bed count, amenities), the filtered results should include only properties matching ALL selected criteria (AND logic, not OR).

**Validates: Requirements 13.2**

### Property 22: Filter Clearing

For any set of properties and any active filters, clearing all filters should return the complete set of published properties without any filtering applied.

**Validates: Requirements 13.3**

### Property 23: Filtered Property Count

For any set of properties and any active filters, the displayed count should equal the number of properties in the filtered results.

**Validates: Requirements 13.5**

### Property 24: Password Hashing

For any password string, when a property owner registers, the stored password_hash field should not equal the plain text password and should be a valid bcrypt hash.

**Validates: Requirements 15.5**

### Property 25: Session Termination

For any authenticated session, after logout, subsequent requests using that session should be rejected as unauthenticated.

**Validates: Requirements 15.6**

### Property 26: Admin Route Authorization

For any admin dashboard route, requests without valid authentication should be redirected to the login page or return 401 Unauthorized.

**Validates: Requirements 15.7**

### Property 27: Meta Tag Generation

For any property, the rendered HTML page should include meta tags for title, description, and keywords (or og:title, og:description for Open Graph).

**Validates: Requirements 16.1**

### Property 28: SEO-Friendly URL Generation

For any property name, the generated URL should be in kebab-case format (lowercase with hyphens) and match the pattern `/properties/{slug}`.

**Validates: Requirements 16.5**

### Property 29: Image Lazy Loading

For any image element below the initial viewport, the HTML should include `loading="lazy"` attribute to enable lazy loading.

**Validates: Requirements 17.3**

### Property 30: Foreign Key Cascade Deletion

For any property with related records (media, availability, inquiries, attractions, reviews), deleting the property should cascade delete all related records, leaving no orphaned data.

**Validates: Requirements 18.7**

### Property 31: Responsive Image Generation

For any uploaded image, the image processing should generate at least three sizes (thumbnail, medium, large) and store URLs for each size.

**Validates: Requirements 19.1**

### Property 32: WebP Format Conversion

For any uploaded image in JPEG or PNG format, the image processing should generate a WebP version while retaining the original format, resulting in at least two format variants.

**Validates: Requirements 19.2**

### Property 33: Image Size Validation

For any file upload, if the file size exceeds 10MB, validation should reject the upload with an appropriate error message.

**Validates: Requirements 19.4**

### Property 34: Review Date Sorting

For any collection of reviews with different review dates, sorting should order them with newest first (descending order by reviewDate).

**Validates: Requirements 21.4**

### Property 35: Average Rating Calculation

For any property with reviews, the displayed average rating should equal the sum of all rating values divided by the number of reviews, rounded to one decimal place.

**Validates: Requirements 21.5**

### Property 36: Contact Message Round-Trip

For any valid contact message (with name, email, and message fields), submitting the message should store it in the database, and subsequent admin queries should retrieve the same message data.

**Validates: Requirements 22.3**

### Property 37: Form Validation Error Display

For any form submission that fails validation, the error response should include field-specific error messages mapping each invalid field to its validation error.

**Validates: Requirements 24.2**

### Property 38: Error Logging

For any error that occurs during request processing, an error log entry should be created with timestamp, error message, and stack trace.

**Validates: Requirements 24.5**

## Error Handling

### Error Categories

**Validation Errors (400 Bad Request)**
- Missing required fields
- Invalid data formats (email, URL, dates)
- Data constraint violations (negative counts, invalid ratings)
- File size or format violations

**Authentication Errors (401 Unauthorized)**
- Invalid credentials
- Expired or missing session tokens
- Attempting to access protected routes without authentication

**Authorization Errors (403 Forbidden)**
- Attempting to modify another owner's property
- Attempting to delete another owner's inquiries
- Accessing resources without proper ownership

**Not Found Errors (404 Not Found)**
- Requesting non-existent property, media, inquiry, etc.
- Invalid route paths
- Deleted resources

**Server Errors (500 Internal Server Error)**
- Database connection failures
- Image processing failures
- External service failures (calendar sync, if implemented)
- Unexpected runtime errors

### Error Response Format

All API errors return consistent JSON structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Invalid email format",
      "bedCount": "Must be a positive integer"
    }
  }
}
```

### Error Handling Strategies

**Client-Side Validation**: Perform immediate validation on form inputs to provide instant feedback before submission.

**Server-Side Validation**: Always validate on the server regardless of client-side validation to ensure security and data integrity.

**Graceful Degradation**: If image optimization fails, fall back to serving original images rather than failing the entire upload.

**User-Friendly Messages**: Convert technical error messages to user-friendly language (e.g., "Database connection failed" becomes "We're experiencing technical difficulties. Please try again.").

**Error Logging**: Log all errors with context (user ID, request path, timestamp) to facilitate debugging without exposing sensitive information to users.

**Retry Logic**: For transient failures (network issues, temporary database unavailability), implement automatic retry with exponential backoff.

**Transaction Rollback**: For multi-step operations (e.g., creating property with media), use database transactions to ensure atomicity and rollback on failure.

### Specific Error Scenarios

**Image Upload Failure**
- Validate file size and format before upload
- If upload to Vercel Blob fails, return error without creating database record
- If database record creation fails after upload, delete the uploaded blob to prevent orphaned files

**Property Deletion**
- Verify ownership before deletion
- Use cascade delete for related records
- If deletion fails, return error and maintain data consistency

**Inquiry Submission**
- Validate all fields before database insertion
- If email sending fails (future feature), still store inquiry but log the email failure
- Display confirmation to user even if email notification fails

**Authentication Failure**
- Rate limit login attempts to prevent brute force attacks
- Return generic "Invalid credentials" message without specifying whether email or password is wrong
- Log failed authentication attempts for security monitoring

## Testing Strategy

### Dual Testing Approach

The platform requires both unit testing and property-based testing for comprehensive coverage:

**Unit Tests**: Verify specific examples, edge cases, error conditions, and integration points between components. Unit tests are valuable for concrete scenarios but should not be overused when property tests can provide broader coverage.

**Property Tests**: Verify universal properties across all inputs through randomized testing. Each property test validates that a correctness property holds for many generated inputs (minimum 100 iterations).

Together, these approaches provide comprehensive coverage: unit tests catch concrete bugs and verify specific behaviors, while property tests verify general correctness across the input space.

### Property-Based Testing Configuration

**Library Selection**: Use `fast-check` for JavaScript/TypeScript property-based testing.

**Test Configuration**: Each property test must run minimum 100 iterations to ensure adequate randomization coverage.

**Property Tagging**: Each property test must include a comment tag referencing the design document property:
```typescript
// Feature: airbnb-property-showcase-platform, Property 1: Required Field Validation
```

**One Test Per Property**: Each correctness property from the design document must be implemented by exactly one property-based test.

### Testing Layers

**Unit Tests (Jest + React Testing Library)**
- Component rendering and interactions
- Form validation logic
- Data transformation functions
- API route handlers
- Database query functions
- Specific edge cases (empty states, boundary values)

**Property-Based Tests (fast-check)**
- All 38 correctness properties from design document
- Validation logic with random inputs
- CRUD operations with random data
- Filtering and sorting with random datasets
- URL generation with random parameters

**Integration Tests**
- API endpoint workflows (create property → upload media → publish)
- Authentication flows (register → login → access protected route)
- Database transactions and rollbacks
- Image upload and processing pipeline

**End-to-End Tests (Playwright)**
- Critical user journeys (guest browsing → inquiry submission)
- Admin workflows (login → create property → manage inquiries)
- Responsive design on different viewports
- Cross-browser compatibility

### Test Data Generation

**Property-Based Test Generators**:
- `fc.string()` for text fields with constraints
- `fc.emailAddress()` for email validation
- `fc.integer()` for counts and ratings
- `fc.date()` for date fields
- `fc.array()` for collections
- Custom generators for domain objects (Property, Inquiry, etc.)

**Unit Test Fixtures**:
- Predefined test data for specific scenarios
- Mock data for external services (calendar sync)
- Edge cases (empty arrays, null values, boundary values)

### Coverage Goals

- **Line Coverage**: Minimum 80% for business logic
- **Branch Coverage**: Minimum 75% for conditional logic
- **Property Coverage**: 100% of correctness properties implemented as tests
- **Critical Path Coverage**: 100% for authentication, authorization, and data persistence

### Testing Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Cleanup**: Reset database state between tests using transactions or test database
3. **Mocking**: Mock external services (Vercel Blob, external calendars) to avoid dependencies
4. **Determinism**: Use fixed seeds for property tests during CI to ensure reproducibility
5. **Performance**: Keep unit tests fast (<100ms each) for rapid feedback
6. **Readability**: Use descriptive test names that explain what is being tested and why

### Continuous Integration

- Run all tests on every pull request
- Block merges if tests fail or coverage drops below thresholds
- Run property tests with higher iteration counts (1000+) on main branch
- Generate coverage reports and track trends over time
- Run E2E tests on staging environment before production deployment

