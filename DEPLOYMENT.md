# Deployment Guide - Moonplace Static Website

This guide will help you deploy your Moonplace website as a static site to Vercel.

## What's Been Configured

Your Next.js app is now configured for static export with the following settings:

- **Static Export**: The site will be built as static HTML/CSS/JS files
- **Image Optimization**: Disabled for static export (images load directly from Unsplash)
- **Trailing Slashes**: Enabled for better static hosting compatibility

## Prerequisites

1. A GitHub account (or GitLab/Bitbucket)
2. A Vercel account (free tier is perfect for this)
3. Your code pushed to a Git repository

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Moonplace website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/moonplace.git
   git push -u origin main
   ```

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up or log in with your GitHub account

3. **Import Your Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings

4. **Configure Build Settings** (should be auto-detected)
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `out` (auto-detected)
   - Install Command: `npm install`

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your site will be live at `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Your site will be deployed automatically

## Testing Locally Before Deployment

To test the static export locally:

```bash
# Build the static site
npm run build

# The static files will be in the 'out' folder
# You can serve them with any static file server
npx serve out
```

## Custom Domain Setup (Optional)

After deployment, you can add a custom domain:

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., moonplace.com)
4. Follow the DNS configuration instructions

## What Works in Static Mode

✅ All public pages (Home, Gallery, Availability, etc.)
✅ Property detail pages
✅ Image galleries and sliders
✅ Interactive calendars
✅ Maps (Leaflet)
✅ Responsive design
✅ SEO optimization
✅ Scroll animations

## What Doesn't Work Yet (Requires Backend)

❌ Form submissions (Contact, Inquiry forms)
❌ Admin dashboard functionality
❌ User authentication
❌ Real-time availability updates
❌ Database operations

These features will work once you implement Phase 2 (Backend) and Phase 3 (Database).

## Environment Variables

For static export, no environment variables are needed since you're using:
- Unsplash for images (public URLs)
- OpenStreetMap for maps (no API key required)
- Mock data for content

## Automatic Deployments

Once connected to GitHub, Vercel will automatically:
- Deploy every push to the `main` branch
- Create preview deployments for pull requests
- Show deployment status in GitHub

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Run `npm run build` locally to test
- Check Vercel build logs for specific errors

### Images Not Loading
- Ensure Unsplash URLs are accessible
- Check browser console for CORS errors

### Pages Not Found
- Verify all pages are in the `app` directory
- Check that `generateStaticParams` is defined for dynamic routes

## Next Steps

After deploying the static site:

1. **Test Everything**: Click through all pages and features
2. **Share the Link**: Get feedback from users
3. **Phase 2**: When ready, implement backend APIs for forms and admin features
4. **Phase 3**: Add database integration for dynamic content

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Static Export: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- Need help? Check the Vercel community forums

---

**Your site is ready to deploy! 🚀**

Just push to GitHub and connect to Vercel - it's that simple!
