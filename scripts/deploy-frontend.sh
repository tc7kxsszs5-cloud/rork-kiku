#!/bin/bash

# 🚀 KIKU Frontend Deployment Script
# Build and deploy React Native app with EAS

set -e  # Exit on error

echo "🚀 KIKU Frontend Deployment"
echo "==========================="
echo ""

# Check if eas CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g eas-cli
fi

# Change to project root
cd "$(dirname "$0")/.." || exit 1

echo "📁 Working directory: $(pwd)"
echo ""

# Check for required env vars
if [ ! -f ".env.production" ]; then
    echo "⚠️  Warning: .env.production not found"
    echo "📝 Creating from template..."
    cp .env.production.example .env.production
    echo "⚠️  Please fill in .env.production with your actual values"
    exit 1
fi

# Run pre-deployment checks
echo "🔍 Running pre-deployment checks..."
echo ""

echo "📝 TypeScript check..."
bunx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found. Please fix before deploying."
    exit 1
fi

echo "✅ TypeScript OK"
echo ""

echo "📝 ESLint check..."
bun run lint
if [ $? -ne 0 ]; then
    echo "❌ ESLint errors found. Please fix before deploying."
    exit 1
fi

echo "✅ ESLint OK"
echo ""

# Ask user which platform to build
echo "📱 Select platform to build:"
echo "1) iOS"
echo "2) Android"
echo "3) Both"
read -p "Enter choice (1-3): " platform_choice

case $platform_choice in
    1)
        PLATFORM="ios"
        ;;
    2)
        PLATFORM="android"
        ;;
    3)
        PLATFORM="all"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

# Ask user which profile to use
echo ""
echo "📝 Select build profile:"
echo "1) Production (for store submission)"
echo "2) Preview (for internal testing)"
read -p "Enter choice (1-2): " profile_choice

case $profile_choice in
    1)
        PROFILE="production"
        ;;
    2)
        PROFILE="preview"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🏗️  Building $PLATFORM with profile: $PROFILE"
echo ""

# Build with EAS
eas build --platform "$PLATFORM" --profile "$PROFILE"

echo ""
echo "✅ Build started successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Check build status: eas build:list"
echo "2. Once complete, download: eas build:download"
echo "3. Submit to stores: eas submit --platform $PLATFORM"
echo ""
