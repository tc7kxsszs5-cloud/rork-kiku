#!/bin/bash

# 🔧 KIKU Production Setup Script
# Interactive script to configure production environment

set -e  # Exit on error

echo "🔧 KIKU Production Setup"
echo "========================"
echo ""
echo "This script will help you set up KIKU for production deployment."
echo ""

# Change to project root
cd "$(dirname "$0")/.." || exit 1

# Function to read input with default value
read_with_default() {
    local prompt="$1"
    local default="$2"
    local value
    
    read -p "$prompt [$default]: " value
    echo "${value:-$default}"
}

# Function to read secret (no echo)
read_secret() {
    local prompt="$1"
    local value
    
    read -sp "$prompt: " value
    echo ""
    echo "$value"
}

echo "📋 Step 1: Backend Environment Variables"
echo "========================================="
echo ""

# Backend URL
BACKEND_URL=$(read_with_default "Enter your Vercel backend URL" "https://kiku-backend.vercel.app")

# Supabase
echo ""
echo "📊 Supabase Configuration"
SUPABASE_URL=$(read_with_default "Enter Supabase URL" "https://xxxxx.supabase.co")
SUPABASE_ANON_KEY=$(read_secret "Enter Supabase Anon Key")
SUPABASE_SERVICE_ROLE_KEY=$(read_secret "Enter Supabase Service Role Key")

# Database
echo ""
echo "🗄️  Database Configuration"
DATABASE_URL=$(read_secret "Enter Database URL (PostgreSQL connection string)")

# JWT
echo ""
echo "🔐 Security Configuration"
JWT_SECRET=$(read_secret "Enter JWT Secret (min 32 characters)")

# OpenAI
echo ""
echo "🤖 AI Configuration"
OPENAI_API_KEY=$(read_secret "Enter OpenAI API Key")

# Sentry
echo ""
echo "📊 Monitoring Configuration"
SENTRY_DSN=$(read_with_default "Enter Sentry DSN" "https://xxxxx@sentry.io/123456")

echo ""
echo "📝 Writing backend/.env.production..."

cat > backend/.env.production << EOF
# KIKU Backend Production Environment
# Generated on $(date)

DATABASE_URL="$DATABASE_URL"
SUPABASE_URL="$SUPABASE_URL"
SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

NODE_ENV=production
PORT=3000

JWT_SECRET="$JWT_SECRET"
JWT_EXPIRES_IN=7d

OPENAI_API_KEY="$OPENAI_API_KEY"

SENTRY_DSN="$SENTRY_DSN"
SENTRY_ENVIRONMENT=production

RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000

ALLOWED_ORIGINS=$BACKEND_URL,https://d8v7u672uumlfpscvnbps.rork.live
EOF

echo "✅ Backend .env.production created"
echo ""

echo "📝 Step 2: Frontend Environment Variables"
echo "========================================="
echo ""

echo "📝 Writing .env.production..."

cat > .env.production << EOF
# KIKU Frontend Production Environment
# Generated on $(date)

EXPO_PUBLIC_API_URL="$BACKEND_URL"
EXPO_PUBLIC_BACKEND_URL="$BACKEND_URL"
EXPO_PUBLIC_RORK_API_BASE_URL="$BACKEND_URL"

EXPO_PUBLIC_SUPABASE_URL="$SUPABASE_URL"
EXPO_PUBLIC_SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY"

EXPO_PUBLIC_AI_PROVIDER=openai
EXPO_PUBLIC_OPENAI_API_KEY="$OPENAI_API_KEY"

EXPO_PUBLIC_ENABLE_AI_MODERATION=true
EXPO_PUBLIC_ENABLE_SOS_ALERTS=true
EXPO_PUBLIC_ENABLE_ANALYTICS=true

SENTRY_DSN="$SENTRY_DSN"
SENTRY_ORG=your-org
SENTRY_PROJECT=kiku-production

EXPO_PUBLIC_ENV=production
EXPO_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production
EOF

echo "✅ Frontend .env.production created"
echo ""

echo "📝 Step 3: EAS Secrets"
echo "======================"
echo ""
echo "Do you want to add secrets to EAS now? (y/n)"
read -p "> " add_eas_secrets

if [ "$add_eas_secrets" = "y" ] || [ "$add_eas_secrets" = "Y" ]; then
    echo ""
    echo "📦 Adding secrets to EAS..."
    
    echo "$OPENAI_API_KEY" | eas secret:create --scope project --name OPENAI_API_KEY --value-stdin
    echo "$SUPABASE_URL" | eas secret:create --scope project --name SUPABASE_URL --value-stdin
    echo "$SUPABASE_ANON_KEY" | eas secret:create --scope project --name SUPABASE_ANON_KEY --value-stdin
    echo "$SENTRY_DSN" | eas secret:create --scope project --name SENTRY_DSN --value-stdin
    
    echo "✅ EAS secrets added"
else
    echo "⚠️  Remember to add secrets manually:"
    echo "   eas secret:create --scope project --name OPENAI_API_KEY --value '...'"
    echo "   eas secret:create --scope project --name SUPABASE_URL --value '...'"
    echo "   eas secret:create --scope project --name SUPABASE_ANON_KEY --value '...'"
    echo "   eas secret:create --scope project --name SENTRY_DSN --value '...'"
fi

echo ""
echo "📝 Step 4: Vercel Environment Variables"
echo "========================================"
echo ""
echo "Do you want to add environment variables to Vercel now? (y/n)"
read -p "> " add_vercel_env

if [ "$add_vercel_env" = "y" ] || [ "$add_vercel_env" = "Y" ]; then
    cd backend
    
    echo "$DATABASE_URL" | vercel env add DATABASE_URL production --value-stdin
    echo "$SUPABASE_URL" | vercel env add SUPABASE_URL production --value-stdin
    echo "$SUPABASE_ANON_KEY" | vercel env add SUPABASE_ANON_KEY production --value-stdin
    echo "$SUPABASE_SERVICE_ROLE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production --value-stdin
    echo "$JWT_SECRET" | vercel env add JWT_SECRET production --value-stdin
    echo "$OPENAI_API_KEY" | vercel env add OPENAI_API_KEY production --value-stdin
    echo "$SENTRY_DSN" | vercel env add SENTRY_DSN production --value-stdin
    
    cd ..
    
    echo "✅ Vercel environment variables added"
else
    echo "⚠️  Remember to add environment variables manually in Vercel Dashboard"
fi

echo ""
echo "✅ Production Setup Complete!"
echo ""
echo "📝 Next steps:"
echo "1. Review .env.production files"
echo "2. Run database migrations: psql \$DATABASE_URL < backend/schema.sql"
echo "3. Deploy backend: ./scripts/deploy-backend.sh"
echo "4. Build frontend: ./scripts/deploy-frontend.sh"
echo ""
echo "📚 For detailed instructions, see: DEPLOYMENT_GUIDE.md"
echo ""
