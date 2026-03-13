# 🚀 Supabase + Vercel Deployment Guide

## ✅ Current Status: Build Fixed!

**Great news!** All SSR (Server-Side Rendering) issues have been resolved:
- ✅ Fixed "window is not defined" errors in admin pages
- ✅ Added `export const dynamic = 'force-dynamic'` to API routes
- ✅ LocationPicker component now loads dynamically with SSR disabled
- ✅ Build passes successfully: `npm run build` ✓
- ✅ Code pushed to GitHub: [HiroTryingC4/AIRBNBS](https://github.com/HiroTryingC4/AIRBNBS)

**Next Step:** Deploy to Vercel and configure environment variables!

## Why Supabase?
- ✅ **Free tier**: 500MB database, 2GB bandwidth
- ✅ **PostgreSQL**: Fully compatible with your Prisma schema
- ✅ **Vercel integration**: Seamless connection
- ✅ **Built-in features**: Auth, real-time, storage
- ✅ **Easy scaling**: Upgrade when you need more

## Step-by-Step Setup

### 🗄️ Step 1: Create Supabase Database

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** (can use GitHub account)
3. **Click "New Project"**
4. **Fill in project details:**
   - Name: `evangelinas-staycation`
   - Database Password: Generate a strong password (save it!)
   - Region: Choose closest to your users
5. **Click "Create new project"**
6. **Wait 2-3 minutes** for database to initialize

### 🔗 Step 2: Get Database Connection String

1. **In your Supabase dashboard**, go to **Settings** → **Database**
2. **Scroll down to "Connection string"**
3. **Copy the "URI" format** (starts with `postgresql://`)
4. **Replace `[YOUR-PASSWORD]`** with your actual database password
5. **Your connection string should look like:**
   ```
   postgresql://postgres.abcdefghijk:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
   ```

### 🚀 Step 3: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI if you haven't
npm install -g vercel

# Login to Vercel
vercel login

# Deploy your project
vercel --prod
```

#### Option B: GitHub Integration (Current Setup)
1. ✅ **Code is already on GitHub**: [HiroTryingC4/AIRBNBS](https://github.com/HiroTryingC4/AIRBNBS)
2. **Go to [vercel.com](https://vercel.com)**
3. **Click "New Project" → Import your repository**
4. **Vercel auto-detects Next.js and deploys**

### ⚙️ Step 4: Configure Environment Variables in Vercel

1. **Go to your Vercel project dashboard**
2. **Click Settings → Environment Variables**
3. **Add these variables:**

```bash
# Database
DATABASE_URL=postgresql://postgres.abcdefghijk:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require

# NextAuth (replace with your actual Vercel domain)
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=YGHKnr4xh3dhl3B9as0Fs9FWlZo5nzM5hErdcTK50X0=

# Production environment
NODE_ENV=production
```

**Important:** Replace:
- `[YOUR-PASSWORD]` with your Supabase database password
- `your-app-name.vercel.app` with your actual Vercel domain
- Use the NextAuth secret generated earlier

### 🗄️ Step 5: Initialize Database Schema

After setting environment variables, create your database tables:

#### Method A: Using Vercel CLI (Recommended)
```bash
# Pull environment variables to local
vercel env pull .env.local

# Create database tables
npx prisma db push

# Seed with sample data
npm run db:seed
```

#### Method B: Create temporary API route
If you can't run commands locally, create this file temporarily:

**Create `app/api/db-setup/route.ts`:**
```typescript
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 12)
    
    const user = await prisma.user.upsert({
      where: { email: 'demo@example.com' },
      update: {},
      create: {
        email: 'demo@example.com',
        name: 'Demo Property Owner',
        password: hashedPassword,
      },
    })

    // Create sample property
    const property = await prisma.property.upsert({
      where: { slug: 'evangelinas-staycation-studio' },
      update: {},
      create: {
        name: 'Evangelina\'s Staycation - Cozy Studio Unit',
        description: 'A beautiful and cozy studio unit perfect for couples or solo travelers.',
        location: 'Trees Residences, Quezon City',
        bedCount: 1,
        bathroomCount: 1,
        guestCapacity: 2,
        pricePerNight: 2500,
        extraPersonPrice: 500,
        propertyType: 'studio',
        amenities: JSON.stringify(['WiFi', 'Air Conditioning', 'Smart TV', 'Kitchen']),
        slug: 'evangelinas-staycation-studio',
        latitude: 14.6760,
        longitude: 121.0437,
        status: 'PUBLISHED',
        ownerId: user.id,
      },
    })

    return Response.json({ 
      success: true, 
      message: 'Database initialized successfully',
      user: user.email,
      property: property.name
    })
  } catch (error) {
    console.error('Database setup error:', error)
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
```

**Then:**
1. Deploy the changes to Vercel
2. Visit `https://your-app.vercel.app/api/db-setup` **once**
3. Delete the `app/api/db-setup/route.ts` file
4. Deploy again to remove the setup endpoint

### 📦 Step 6: Set Up Vercel Blob Storage (for images)

1. **In Vercel dashboard** → **Storage** tab
2. **Click "Create Database"** → **"Blob"**
3. **Name it:** `evangelinas-images`
4. **Click "Create"**
5. **Copy the `BLOB_READ_WRITE_TOKEN`**
6. **Add to Vercel environment variables:**
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 🧪 Step 7: Test Your Deployment

Visit these URLs to test:

1. **Home page:** `https://your-app.vercel.app`
2. **Properties:** `https://your-app.vercel.app/properties`
3. **Admin login:** `https://your-app.vercel.app/admin/login`
   - Email: `demo@example.com`
   - Password: `demo123`
4. **API test:** `https://your-app.vercel.app/api/properties`

### 🔍 Troubleshooting

#### Database Connection Issues:
- Verify DATABASE_URL is exactly as copied from Supabase
- Check that password doesn't contain special characters that need encoding
- Ensure `?sslmode=require` is at the end

#### Build/Deploy Issues:
- ✅ **Build issues are now fixed!**
- Check Vercel function logs in dashboard
- Verify all environment variables are set
- Make sure Prisma schema is valid

#### Performance Tips:
- Supabase free tier has connection limits
- Use connection pooling (already included in Supabase URLs)
- Monitor usage in Supabase dashboard

## 🎉 Success Checklist

- [x] Build passes locally (`npm run build`)
- [x] Code pushed to GitHub
- [ ] Supabase project created
- [ ] Database connection string copied
- [ ] Vercel project deployed
- [ ] Environment variables configured
- [ ] Database schema created
- [ ] Sample data seeded
- [ ] Blob storage configured
- [ ] Admin login working
- [ ] Properties displaying
- [ ] Image uploads working

## 📊 Monitoring Your App

### Supabase Dashboard:
- **Database usage:** Monitor storage and bandwidth
- **Performance:** Check slow queries
- **Logs:** View database activity

### Vercel Dashboard:
- **Function logs:** Debug API issues
- **Analytics:** Track page views
- **Performance:** Monitor loading times

## 💰 Cost Considerations

### Supabase Free Tier Limits:
- **Database:** 500MB storage
- **Bandwidth:** 2GB/month
- **API requests:** 50,000/month

### When to Upgrade:
- More than 500MB of data
- High traffic (>2GB bandwidth/month)
- Need advanced features

Your Evangelina's Staycation platform will run perfectly on the free tiers initially!

## 🔄 Backup Strategy

**Automatic backups:** Supabase handles this
**Manual backup:** Use `pg_dump` or Supabase dashboard export
**Data export:** Available in Supabase dashboard

---

**🎯 Quick Summary:**
1. Create Supabase database → Get connection string
2. Deploy to Vercel → Add environment variables  
3. Initialize database → Test everything
4. Your app is live with PostgreSQL backend! 🚀