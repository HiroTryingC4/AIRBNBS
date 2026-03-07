# How to Add Your Own Images

This guide will help you replace the Unsplash placeholder images with your own Moonplace property photos.

## Step 1: Prepare Your Images

### Image Requirements
- **Format**: JPG, PNG, or WebP
- **Recommended Sizes**:
  - Hero images: 1920x1080px (landscape)
  - Gallery images: 1200x800px
  - Property card thumbnails: 800x600px
  - Thumbnails: 400x300px

### Optimize Your Images
Before uploading, compress your images to improve loading speed:
- Use [TinyPNG](https://tinypng.com) or [Squoosh](https://squoosh.app)
- Target file size: 200-500KB per image
- Keep quality at 80-85%

## Step 2: Add Images to Folders

Copy your images to the appropriate folders in `public/images/`:

```
public/images/
├── hero/              # Main banner images
│   └── moonplace-hero.jpg
├── interior/          # Living room, kitchen, dining
│   ├── living-room-1.jpg
│   ├── living-room-2.jpg
│   └── kitchen.jpg
├── bedrooms/          # All bedroom photos
│   ├── master-bedroom.jpg
│   └── bedroom-2.jpg
├── outdoor/           # Pool, balcony, garden
│   ├── pool.jpg
│   └── balcony-view.jpg
├── amenities/         # Gym, facilities
│   ├── gym.jpg
│   └── pool-area.jpg
└── drone/             # Aerial views
    └── aerial-view.jpg
```

## Step 3: Update Image URLs in Code

### A. Update Property Thumbnail (Homepage)

**File**: `lib/mockData.ts`

```javascript
export const mockProperties = [
  {
    id: '1',
    name: 'Moonplace - Cozy Studio Unit',
    location: 'Trees Residences, Quezon City',
    // Change this line:
    thumbnailUrl: '/images/hero/moonplace-hero.jpg',  // ← Your image
    // ... rest of the properties
  },
];
```

### B. Update Gallery Images

**File**: `lib/mockData.ts`

Find `mockMediaGallery` and update each image URL:

```javascript
export const mockMediaGallery = [
  {
    id: '1',
    mediaType: 'IMAGE' as const,
    url: '/images/interior/living-room-1.jpg',           // ← Your image
    thumbnailUrl: '/images/interior/living-room-1.jpg',  // ← Same or smaller version
    displayOrder: 0,
  },
  {
    id: '2',
    mediaType: 'IMAGE' as const,
    url: '/images/bedrooms/master-bedroom.jpg',
    thumbnailUrl: '/images/bedrooms/master-bedroom.jpg',
    displayOrder: 1,
  },
  // Add more images...
];
```

### C. Update Gallery Page Images

**File**: `app/gallery/page.tsx`

Find `galleryData` and update URLs:

```javascript
const galleryData = {
  Interior: [
    { id: '1', url: '/images/interior/living-room-1.jpg', alt: 'Living room' },
    { id: '2', url: '/images/interior/dining-area.jpg', alt: 'Dining area' },
    { id: '3', url: '/images/interior/kitchen.jpg', alt: 'Kitchen' },
    // Add more...
  ],
  Bedrooms: [
    { id: '9', url: '/images/bedrooms/master-bedroom.jpg', alt: 'Master bedroom' },
    { id: '10', url: '/images/bedrooms/bedroom-2.jpg', alt: 'Guest bedroom' },
    // Add more...
  ],
  Outdoor: [
    { id: '16', url: '/images/outdoor/pool.jpg', alt: 'Pool area' },
    { id: '17', url: '/images/outdoor/balcony.jpg', alt: 'Balcony view' },
    // Add more...
  ],
  Amenities: [
    { id: '24', url: '/images/amenities/gym.jpg', alt: 'Gym' },
    { id: '25', url: '/images/amenities/pool-area.jpg', alt: 'Pool facilities' },
    // Add more...
  ],
  'Drone Shots': [
    { id: '30', url: '/images/drone/aerial-view.jpg', alt: 'Aerial view' },
    { id: '31', url: '/images/drone/building-overview.jpg', alt: 'Building overview' },
    // Add more...
  ],
};
```

### D. Update Homepage Hero Image

**File**: `app/page.tsx`

Find the hero section and update the background image:

```javascript
{/* Hero Section */}
<section 
  className="relative h-screen min-h-[600px] flex items-center justify-center"
  style={{
    backgroundImage: "url('/images/hero/moonplace-hero.jpg')",  // ← Your image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
```

## Step 4: Test Your Changes

1. **Run the development server**:
   ```bash
   npm run dev
   ```

2. **Open** http://localhost:3000

3. **Check these pages**:
   - Homepage (hero image and property card)
   - Gallery page (all categories)
   - Property detail page (image slider)

4. **Verify**:
   - All images load correctly
   - No broken image icons
   - Images look good on mobile and desktop

## Step 5: Rebuild for Deployment

After updating all images:

```bash
npm run build
```

Then deploy to Vercel as usual.

## Tips

### Using Next.js Image Component (Optional)

For better performance, you can use Next.js Image component:

```javascript
import Image from 'next/image';

<Image
  src="/images/interior/living-room.jpg"
  alt="Living room"
  width={1200}
  height={800}
  quality={85}
/>
```

### Image Naming Convention

Use descriptive, lowercase names with hyphens:
- ✅ `master-bedroom-view.jpg`
- ✅ `pool-sunset.jpg`
- ✅ `living-room-1.jpg`
- ❌ `IMG_1234.jpg`
- ❌ `Photo 1.jpg`

### Keep Unsplash as Fallback

You can keep some Unsplash images as fallback while you collect your own photos. Just update them one by one as you get better images.

## Need Help?

If images aren't showing:
1. Check the file path is correct (case-sensitive!)
2. Make sure images are in `public/images/` folder
3. Restart the dev server (`npm run dev`)
4. Check browser console for errors (F12)

---

**Once you've added your images, your Moonplace website will look even more amazing with real photos! 📸**
