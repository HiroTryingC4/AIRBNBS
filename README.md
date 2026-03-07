# Airbnb Property Showcase Platform

A full-stack web application that enables property owners to create professional showcase websites for their rental properties. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Property Management**: Create and manage multiple rental properties
- **Media Gallery**: Upload and organize property photos and videos
- **Availability Calendar**: Interactive calendar for booking management
- **Guest Inquiries**: Handle booking requests and guest communications
- **Location & Attractions**: Display property location and nearby points of interest
- **Reviews Management**: Showcase guest testimonials and ratings
- **Responsive Design**: Optimized for all devices (320px to 2560px viewports)
- **SEO Optimized**: Server-side rendering for search engine visibility

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet with OpenStreetMap
- **Testing**: Jest, React Testing Library, fast-check (property-based testing)
- **Database**: Vercel Postgres (Neon) with Prisma ORM
- **Authentication**: NextAuth.js
- **Image Storage**: Vercel Blob Storage
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env.local
```

4. Update `.env.local` with your configuration values

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Testing

Run unit tests:

```bash
npm test
```

Run property-based tests:

```bash
npm run test:properties
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public-facing pages
│   └── admin/             # Admin dashboard pages
├── components/            # Reusable React components
│   ├── public/           # Public site components
│   └── admin/            # Admin dashboard components
├── lib/                   # Utility functions and helpers
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── tests/                # Test files
```

## Development Phases

This project follows a Frontend → Backend → Database approach:

1. **Phase 1**: Frontend Development (UI with mock data)
2. **Phase 2**: Backend Development (API endpoints)
3. **Phase 3**: Database Integration

See `.kiro/specs/airbnb-property-showcase-platform/tasks.md` for detailed implementation plan.

## Requirements

- Viewport support: 320px to 2560px
- Touch-friendly elements: minimum 44px touch targets
- Performance: Page load within 3 seconds on 3G connection
- SEO: Server-side rendering with meta tags and semantic HTML

## License

This project is private and proprietary.

## Documentation

For detailed specifications, see:
- Requirements: `.kiro/specs/airbnb-property-showcase-platform/requirements.md`
- Design: `.kiro/specs/airbnb-property-showcase-platform/design.md`
- Tasks: `.kiro/specs/airbnb-property-showcase-platform/tasks.md`
