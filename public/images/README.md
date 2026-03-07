# Moonplace Images Folder

## 📁 Folder Structure

```
public/images/
├── hero/           # Hero/banner images (1920x1080px)
├── interior/       # Living room, kitchen, dining area
├── bedrooms/       # All bedroom photos
├── outdoor/        # Pool, balcony, garden, terrace
├── amenities/      # Gym, spa, facilities
└── drone/          # Aerial/bird's eye view photos
```

## 📸 Quick Start

1. **Add your photos** to the appropriate folders above
2. **Name them descriptively**: `living-room-1.jpg`, `pool-view.jpg`
3. **Update the code** in these files:
   - `lib/mockData.ts` - Property thumbnail and gallery
   - `app/gallery/page.tsx` - Gallery page images
   - `app/page.tsx` - Hero section background

## 📏 Recommended Image Sizes

| Type | Size | Usage |
|------|------|-------|
| Hero | 1920x1080px | Homepage banner |
| Gallery | 1200x800px | Gallery and sliders |
| Thumbnail | 800x600px | Property cards |
| Small | 400x300px | Thumbnails |

## 🎨 Image Guidelines

- **Format**: JPG or PNG (WebP for best performance)
- **Quality**: 80-85% compression
- **File size**: 200-500KB per image
- **Optimize**: Use [TinyPNG](https://tinypng.com) before uploading

## 🔗 How to Use

Replace Unsplash URLs with your local images:

```javascript
// Before
url: 'https://images.unsplash.com/photo-123456'

// After
url: '/images/interior/living-room-1.jpg'
```

## 📖 Full Guide

See `HOW_TO_ADD_YOUR_IMAGES.md` in the root folder for detailed instructions.

---

**Tip**: Start with 10-15 high-quality photos. You can always add more later!
