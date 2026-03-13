#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Evangelina\'s Staycation Platform - Deployment Helper\n');

// Check if this is a git repository
try {
  execSync('git status', { stdio: 'ignore' });
} catch (error) {
  console.log('❌ This is not a git repository. Initializing...');
  execSync('git init');
  execSync('git add .');
  execSync('git commit -m "Initial commit for deployment"');
  console.log('✅ Git repository initialized\n');
}

// Check for uncommitted changes
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    console.log('📝 Uncommitted changes detected. Committing...');
    execSync('git add .');
    execSync('git commit -m "Prepare for Vercel deployment"');
    console.log('✅ Changes committed\n');
  }
} catch (error) {
  console.log('⚠️  Could not check git status');
}

console.log('🔧 Deployment Options:\n');
console.log('1. Deploy with Vercel CLI (recommended)');
console.log('2. Push to GitHub and deploy via Vercel dashboard');
console.log('3. Show environment variables needed\n');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Choose an option (1-3): ', (answer) => {
  switch (answer) {
    case '1':
      console.log('\n🚀 Deploying with Vercel CLI...');
      try {
        execSync('npx vercel --prod', { stdio: 'inherit' });
        console.log('\n✅ Deployment complete!');
        showPostDeploymentSteps();
      } catch (error) {
        console.log('\n❌ Deployment failed. Try installing Vercel CLI first:');
        console.log('npm install -g vercel');
      }
      break;
    
    case '2':
      console.log('\n📤 To deploy via GitHub:');
      console.log('1. Push your code: git push origin main');
      console.log('2. Go to vercel.com');
      console.log('3. Import your repository');
      console.log('4. Vercel will auto-deploy');
      showPostDeploymentSteps();
      break;
    
    case '3':
      showEnvironmentVariables();
      break;
    
    default:
      console.log('❌ Invalid option');
  }
  rl.close();
});

function showEnvironmentVariables() {
  console.log('\n🔐 Required Environment Variables for Vercel:\n');
  console.log('DATABASE_URL=postgresql://username:password@host:port/database');
  console.log('NEXTAUTH_URL=https://your-app-name.vercel.app');
  console.log('NEXTAUTH_SECRET=your-super-secret-key');
  console.log('BLOB_READ_WRITE_TOKEN=vercel_blob_token\n');
  
  console.log('📚 See VERCEL_DEPLOYMENT_GUIDE.md for detailed setup instructions');
}

function showPostDeploymentSteps() {
  console.log('\n📋 Next Steps:');
  console.log('1. Set environment variables in Vercel dashboard');
  console.log('2. Set up your database (Supabase/PlanetScale/Neon)');
  console.log('3. Configure Vercel Blob storage for images');
  console.log('4. Run database migrations');
  console.log('5. Create your first admin user\n');
  console.log('📖 Full guide: VERCEL_DEPLOYMENT_GUIDE.md');
}