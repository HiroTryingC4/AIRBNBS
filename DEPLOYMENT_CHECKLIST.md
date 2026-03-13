# 🚀 Vercel Deployment Checklist

## Pre-Deployment Setup

### ✅ 1. Database Setup (Choose One)

#### Option A: Supabase (Recommended - Free tier)
1. Go to [supabase.com](https://supabase.com)
2. Create account and new project
3. Go to Settings → Database → Connection string
4. Copy the connection string (starts with `postgresql://`)
5. Save for later as `DATABASE_URL`

#### Option B: Neon (Serverless PostgreSQL)
1. Go to [neon.tech](https://neon.tech)
2. Create account and database
3. Copy connection string
4. Save as `DATABASE_URL`

#### Option C: PlanetScale (MySQL alternative)
1. Go to [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string
4. Save as `DATABASE_URL`

### ✅ 2. Generate NextAuth Secret
Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```
Save the output as `NEXTAUTH_SECRET`

### ✅ 3. Prepare Environment Variables
You'll need these for Vercel:
- `DATABASE_URL` (from step 1)
- `NEXTAUTH_SECRET` (from step 2)
- `NEXTAUTH_URL` (will be your Vercel domain)
- `BLOB_READ_WRITE_TOKEN` (we'll set this up after deployment)

## Deployment Steps

### 🚀 Step 1: Deploy to Vercel

#### Method A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Method B: GitHub Integration
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Vercel auto-detects Next.js and deploys

### 🔧 Step 2: Configure Environment Variables

1. Go to your Vercel project dashboard
2. Click Settings → Environment Variables
3. Add these variables:

```
DATABASE_URL=postgresql://your-connection-string-here
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

### 📦 Step 3: Set Up Blob Storage

1. In Vercel dashboard → Storage tab
2. Click "Create Database" → "Blob"
3. Create a new blob store
4. Copy the `BLOB_READ_WRITE_TOKEN`
5. Add it to environment variables

### 🗄️ Step 4: Initialize Database

After setting environment variables, you need to create the database schema:

#### Option A: Using Vercel CLI
```bash
# Pull environment variables locally
vercel env pull .env.local

# Push database schema
npx prisma db push

# Seed with sample data (optional)
npm run db:seed
```

#### Option B: Create a temporary API route
Create `app/api/setup/route.ts`:
```typescript
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // This will create all tables
    await prisma.$executeRaw`SELECT 1`
    return Response.json({ message: 'Database initialized' })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

Visit `https://your-app.vercel.app/api/setup` once, then delete the file.

### 👤 Step 5: Create Admin User

#### Option A: Using Prisma Studio
```bash
vercel env pull .env.local
npx prisma studio
```

#### Option B: Create setup API route
Create a temporary admin creation endpoint and visit it once.

## Post-Deployment Testing

### ✅ Test These Features:
- [ ] Home page loads correctly
- [ ] Property listings display
- [ ] Admin login works (`/admin/login`)
- [ ] Property creation works
- [ ] Image upload functions
- [ ] Chatbot responds
- [ ] Contact forms work
- [ ] Database queries execute

### 🔍 Troubleshooting

#### Build Errors:
- Check that all environment variables are set
- Ensure DATABASE_URL is correct format
- Verify Prisma schema is valid

#### Runtime Errors:
- Check Vercel function logs
- Verify database connection
- Test API endpoints individually

#### Image Upload Issues:
- Confirm BLOB_READ_WRITE_TOKEN is set
- Check Vercel Blob storage is created
- Verify file size limits

## 🎯 Final Steps

1. **Custom Domain** (optional)
   - Add your domain in Vercel dashboard
   - Update NEXTAUTH_URL to your custom domain

2. **Analytics & Monitoring**
   - Enable Vercel Analytics
   - Set up Speed Insights
   - Configure error tracking

3. **Security**
   - Review all environment variables
   - Test admin authentication
   - Verify CORS settings

4. **Performance**
   - Test loading speeds
   - Optimize images
   - Check database query performance

## 🎉 Success!

Your Evangelina's Staycation platform is now live on Vercel!

**Demo Credentials:**
- Email: demo@example.com
- Password: demo123

**Important URLs:**
- Public site: `https://your-app.vercel.app`
- Admin panel: `https://your-app.vercel.app/admin`
- API health: `https://your-app.vercel.app/api/properties`

Remember to:
- Update the demo credentials
- Add real property data
- Configure your domain
- Set up backups for your database