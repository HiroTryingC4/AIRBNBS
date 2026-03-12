# Vercel Deployment Guide for Airbnb Property Showcase Platform

## 🚀 Quick Deployment Steps

### 1. Deploy to Vercel
Choose one of these methods:

#### Method A: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" → Import your repository
4. Vercel will automatically detect Next.js and deploy

#### Method B: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

### 2. Set Environment Variables in Vercel Dashboard

Go to your project settings in Vercel and add these environment variables:

#### Required Environment Variables:

**Database (PostgreSQL):**
```
DATABASE_URL=postgresql://username:password@host:port/database
```
*Get this from your database provider (Supabase, PlanetScale, Neon, etc.)*

**NextAuth Configuration:**
```
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here
```
*Generate NEXTAUTH_SECRET with: `openssl rand -base64 32`*

**Vercel Blob Storage (for image uploads):**
```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token_here
```
*Get this from Vercel Dashboard → Storage → Create Blob Store*

#### Optional Environment Variables:
```
NODE_ENV=production
```

### 3. Set Up Database

#### Option A: Supabase (Recommended - Free tier available)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy the connection string
5. Add to Vercel as `DATABASE_URL`

#### Option B: PlanetScale
1. Go to [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string
4. Add to Vercel as `DATABASE_URL`

#### Option C: Neon
1. Go to [neon.tech](https://neon.tech)
2. Create database
3. Get connection string
4. Add to Vercel as `DATABASE_URL`

### 4. Set Up Blob Storage for Images

1. In Vercel Dashboard → Storage
2. Create new Blob Store
3. Copy the read/write token
4. Add to environment variables as `BLOB_READ_WRITE_TOKEN`

### 5. Initialize Database Schema

After setting up the database, run migrations:

```bash
# If using Vercel CLI
vercel env pull .env.local
npx prisma db push

# Or run this in Vercel Functions (create a temporary API route)
```

### 6. Create Admin User

Create an API route to set up your first admin user, or use Prisma Studio:

```bash
npx prisma studio
```

## 🔧 Troubleshooting

### Build Warnings
The following warnings during build are normal and won't prevent deployment:
- Dynamic server usage warnings
- Static generation errors for admin pages
- Leaflet/map SSR warnings

### Common Issues:

**1. Database Connection Issues:**
- Ensure DATABASE_URL is correctly formatted
- Check if your database allows external connections
- Verify the database exists

**2. Authentication Issues:**
- Make sure NEXTAUTH_URL matches your Vercel domain
- Generate a strong NEXTAUTH_SECRET
- Check that the auth pages are accessible

**3. Image Upload Issues:**
- Verify BLOB_READ_WRITE_TOKEN is set
- Check Vercel Blob storage is created
- Ensure file size limits are appropriate

### Performance Optimization:
- Images are automatically optimized by Next.js
- API routes are serverless functions
- Static pages are cached at the edge
- Database queries should be optimized for production

## 📱 Testing Your Deployment

After deployment, test these features:
1. ✅ Home page loads
2. ✅ Property listings display
3. ✅ Admin login works
4. ✅ Property creation works
5. ✅ Image upload works
6. ✅ Chatbot functions
7. ✅ Contact forms work

## 🎯 Post-Deployment Steps

1. **Set up custom domain** (optional)
2. **Configure analytics** (Vercel Analytics)
3. **Set up monitoring** (Vercel Speed Insights)
4. **Add real property data**
5. **Test all functionality**
6. **Set up backups** for your database

## 🔐 Security Checklist

- ✅ Environment variables are secure
- ✅ Database has proper access controls
- ✅ Admin routes are protected
- ✅ File uploads are validated
- ✅ HTTPS is enabled (automatic with Vercel)
- ✅ CORS is properly configured

Your Airbnb Property Showcase Platform is now live! 🎉