# Content Editor Guide

## How It Works

The content editor allows you to manage the homepage content dynamically through the admin panel.

### System Architecture

1. **Content Storage**: Content is stored in-memory on the server (resets on server restart)
2. **API Endpoint**: `/api/content` serves the content to both admin and guest pages
3. **Admin Editor**: `/admin/content` allows editing and saving content
4. **Guest Homepage**: `/` (homepage) fetches and displays content from the API

### Content Sections

The content editor manages four main sections:

1. **Hero Section**
   - Title (displayed as main heading)
   - Subtitle (displayed below title)
   - Background Image URL

2. **About Section**
   - Section title
   - Description
   - Features list

3. **Contact Information**
   - Phone number (displayed in hero contact card)
   - Email address
   - Physical address
   - Business hours

4. **Footer**
   - Company name
   - Company description
   - Social media links (Facebook, Instagram, Twitter)

## How to Update Content

### Step 1: Edit Content
1. Navigate to `/admin/content`
2. Select a section from the sidebar (Hero, About, Contact, or Footer)
3. Edit the fields in the form
4. Click "Save [Section Name]" button
5. Wait for success message

### Step 2: View Changes on Homepage
1. Open the homepage at `/` in a new tab or window
2. **Hard refresh the page** to clear browser cache:
   - Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
   - Mac: `Cmd + Shift + R`
3. You should see your changes reflected

### Step 3: Verify in Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for: `Fetched content from API: {...}`
4. This shows the content that was loaded

## Troubleshooting

### Changes Not Showing Up?

**Problem**: I saved content in the editor but the homepage still shows old content.

**Solutions**:

1. **Hard Refresh the Homepage**
   - Browser caching can prevent updates
   - Use `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - Or open in incognito/private window

2. **Check Browser Console**
   - Open DevTools (F12)
   - Look for "Fetched content from API" log
   - Verify the content matches what you saved

3. **Verify API Response**
   - Open: `http://localhost:3000/api/content`
   - Check if the JSON shows your updated content
   - If not, the save might have failed

4. **Server Restart**
   - Content is stored in-memory
   - If you restart the server, content resets to defaults
   - Re-save your content after server restarts

5. **Check for Errors**
   - Look in browser console for errors
   - Check terminal/server logs for API errors
   - Verify you're logged in as admin

### Content Resets After Server Restart?

**Problem**: My content changes disappear when I restart the development server.

**Explanation**: The content is currently stored in-memory (in the API route file). This is temporary storage that resets when the server restarts.

**Solutions**:

1. **For Development**: Re-save your content after each server restart
2. **For Production**: Migrate to database storage (see below)

## Currently Integrated on Homepage

The following content from the editor is displayed on the homepage:

- ✅ **Hero Title** (`content.hero.title`)
- ✅ **Hero Subtitle** (`content.hero.subtitle`)
- ✅ **Contact Phone** (`content.contact.phone`)

### Not Yet Integrated

These sections are saved but not yet displayed on the homepage:
- ⏳ Hero background image
- ⏳ About section
- ⏳ Footer content

To integrate these, the homepage would need additional updates to use the content from the API.

## Testing Your Changes

### Quick Test Workflow

1. **Save content** in admin editor
2. **Open homepage** in new tab
3. **Hard refresh** (`Ctrl + Shift + R`)
4. **Verify changes** appear
5. **Check console** for "Fetched content from API" log

### What to Look For

- Hero title should match what you entered
- Hero subtitle should match what you entered
- Contact phone number in the green button should match

## Future Enhancements

### Database Storage (Recommended for Production)

To make content persist across server restarts:

1. Add a `Content` table to Prisma schema
2. Update API routes to use database instead of in-memory storage
3. Seed initial content in `prisma/seed.ts`

### Additional Integrations

To use more content sections on the homepage:

1. Update homepage to use `content.hero.backgroundImage`
2. Add about section that uses `content.about.*`
3. Update footer to use `content.footer.*`

## API Reference

### GET /api/content
Fetch all content or a specific section.

**Query Parameters**:
- `section` (optional): Specific section to fetch (hero, about, contact, footer)

**Response**:
```json
{
  "hero": { "title": "...", "subtitle": "...", "backgroundImage": "..." },
  "about": { "title": "...", "description": "...", "features": [...] },
  "contact": { "phone": "...", "email": "...", "address": "...", "hours": "..." },
  "footer": { "companyName": "...", "description": "...", "socialLinks": {...} }
}
```

### PUT /api/content
Update a content section.

**Request Body**:
```json
{
  "section": "hero",
  "content": {
    "title": "New Title",
    "subtitle": "New Subtitle",
    "backgroundImage": "https://..."
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Content updated successfully",
  "section": "hero",
  "content": {...}
}
```

## Tips

1. **Always hard refresh** after making content changes
2. **Use browser console** to debug content loading
3. **Test in incognito mode** to avoid cache issues
4. **Save frequently** as content is in-memory
5. **Document your changes** if working in a team

---

**Last Updated**: March 12, 2026
