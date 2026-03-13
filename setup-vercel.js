#!/usr/bin/env node

const { execSync } = require('child_process');
const crypto = require('crypto');

console.log('🚀 Evangelina\'s Staycation - Vercel Setup Helper');
console.log('==============================================\n');

// Generate NextAuth secret
const nextAuthSecret = crypto.randomBytes(32).toString('base64');

console.log('🔐 Generated NextAuth Secret:');
console.log(`NEXTAUTH_SECRET=${nextAuthSecret}\n`);

console.log('📋 Environment Variables Needed for Vercel:\n');

console.log('1. DATABASE_URL (PostgreSQL connection string)');
console.log('   Example: postgresql://username:password@host:port/database?sslmode=require');
console.log('   Get from: Supabase, Neon, or PlanetScale\n');

console.log('2. NEXTAUTH_URL (Your Vercel domain)');
console.log('   Example: https://your-app-name.vercel.app\n');

console.log(`3. NEXTAUTH_SECRET (Generated above)`);
console.log(`   ${nextAuthSecret}\n`);

console.log('4. BLOB_READ_WRITE_TOKEN (Vercel Blob storage)');
console.log('   Get from: Vercel Dashboard → Storage → Create Blob Store\n');

console.log('🎯 Quick Start Commands:\n');

console.log('# 1. Install Vercel CLI');
console.log('npm install -g vercel\n');

console.log('# 2. Login to Vercel');
console.log('vercel login\n');

console.log('# 3. Deploy');
console.log('vercel --prod\n');

console.log('# 4. Set up database (after adding DATABASE_URL to Vercel)');
console.log('vercel env pull .env.local');
console.log('npx prisma db push');
console.log('npm run db:seed\n');

console.log('📖 For detailed instructions, see:');
console.log('- DEPLOYMENT_CHECKLIST.md');
console.log('- VERCEL_DEPLOYMENT_GUIDE.md\n');

console.log('🎉 Ready to deploy! Run: node deploy.js');

// Save the secret to a file for reference
require('fs').writeFileSync('.nextauth-secret.txt', nextAuthSecret);
console.log('💾 NextAuth secret saved to .nextauth-secret.txt (add to .gitignore)');