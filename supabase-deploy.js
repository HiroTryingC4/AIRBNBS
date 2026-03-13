#!/usr/bin/env node

const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Supabase + Vercel Deployment Helper');
console.log('=====================================\n');

console.log('This script will help you deploy to Vercel with Supabase database.\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  try {
    console.log('📋 Pre-deployment checklist:\n');
    
    const hasSupabase = await askQuestion('1. Have you created a Supabase project? (y/n): ');
    if (hasSupabase.toLowerCase() !== 'y') {
      console.log('\n🔗 Please create a Supabase project first:');
      console.log('1. Go to https://supabase.com');
      console.log('2. Create new project');
      console.log('3. Get your DATABASE_URL from Settings → Database');
      console.log('4. Run this script again\n');
      process.exit(0);
    }

    const hasDbUrl = await askQuestion('2. Do you have your DATABASE_URL from Supabase? (y/n): ');
    if (hasDbUrl.toLowerCase() !== 'y') {
      console.log('\n📝 To get your DATABASE_URL:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Settings → Database');
      console.log('3. Copy the "URI" connection string');
      console.log('4. Replace [YOUR-PASSWORD] with your actual password\n');
      process.exit(0);
    }

    console.log('\n🚀 Starting deployment process...\n');

    // Check if Vercel CLI is installed
    try {
      execSync('vercel --version', { stdio: 'ignore' });
      console.log('✅ Vercel CLI is installed');
    } catch (error) {
      console.log('📦 Installing Vercel CLI...');
      execSync('npm install -g vercel', { stdio: 'inherit' });
    }

    // Check if logged in
    try {
      execSync('vercel whoami', { stdio: 'ignore' });
      console.log('✅ Logged in to Vercel');
    } catch (error) {
      console.log('🔐 Please log in to Vercel...');
      execSync('vercel login', { stdio: 'inherit' });
    }

    // Build locally first
    console.log('\n🔨 Building project locally...');
    try {
      execSync('npm run build', { stdio: 'inherit' });
      console.log('✅ Local build successful');
    } catch (error) {
      console.error('❌ Build failed. Please fix errors first.');
      process.exit(1);
    }

    // Deploy to Vercel
    console.log('\n🚀 Deploying to Vercel...');
    execSync('vercel --prod', { stdio: 'inherit' });

    console.log('\n🎉 Deployment successful!\n');

    console.log('📋 Next Steps:');
    console.log('1. Go to your Vercel project dashboard');
    console.log('2. Add these environment variables:');
    console.log('   - DATABASE_URL (your Supabase connection string)');
    console.log('   - NEXTAUTH_URL (your Vercel domain)');
    console.log('   - NEXTAUTH_SECRET (generated earlier)');
    console.log('3. Set up Vercel Blob storage for images');
    console.log('4. Initialize your database schema\n');

    const setupDb = await askQuestion('Would you like to set up the database now? (y/n): ');
    if (setupDb.toLowerCase() === 'y') {
      console.log('\n🗄️ Setting up database...');
      console.log('First, make sure you\'ve added DATABASE_URL to Vercel environment variables.');
      
      const envReady = await askQuestion('Have you added DATABASE_URL to Vercel? (y/n): ');
      if (envReady.toLowerCase() === 'y') {
        try {
          console.log('📥 Pulling environment variables...');
          execSync('vercel env pull .env.local', { stdio: 'inherit' });
          
          console.log('🏗️ Creating database schema...');
          execSync('npx prisma db push', { stdio: 'inherit' });
          
          console.log('🌱 Seeding database with sample data...');
          execSync('npm run db:seed', { stdio: 'inherit' });
          
          console.log('\n✅ Database setup complete!');
        } catch (error) {
          console.log('\n⚠️ Database setup failed. You can do this manually:');
          console.log('1. vercel env pull .env.local');
          console.log('2. npx prisma db push');
          console.log('3. npm run db:seed');
        }
      }
    }

    console.log('\n🎯 Your app should now be live!');
    console.log('📖 See SUPABASE_SETUP_GUIDE.md for detailed instructions');
    console.log('🧪 Test your deployment at your Vercel URL');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

main();