#!/bin/bash

# 🚀 KIKU Backend Deployment Script
# Deploy Hono + tRPC backend to Vercel

set -e  # Exit on error

echo "🚀 KIKU Backend Deployment"
echo "=========================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Change to backend directory
cd "$(dirname "$0")/../backend" || exit 1

echo "📁 Working directory: $(pwd)"
echo ""

# Check for required env vars
if [ ! -f ".env.production" ]; then
    echo "⚠️  Warning: .env.production not found"
    echo "📝 Creating from template..."
    cp .env.example .env.production
    echo "⚠️  Please fill in .env.production with your actual values"
    exit 1
fi

# Check if already linked to Vercel project
if [ ! -d ".vercel" ]; then
    echo "🔗 Linking to Vercel project..."
    vercel link
fi

echo "📦 Deploying to Vercel..."
echo ""

# Deploy to production
vercel --prod

echo ""
echo "✅ Backend deployed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Verify deployment at: https://vercel.com/dashboard"
echo "2. Check environment variables are set"
echo "3. Test API endpoint: curl https://your-backend.vercel.app/"
echo ""
