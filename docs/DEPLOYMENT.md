# Deployment Guide - KIKU Child Safety Platform

**Version:** 1.0  
**Last Updated:** January 2, 2026

## Overview

This guide provides step-by-step instructions for deploying KIKU to production environments, including mobile app stores, web hosting, and backend infrastructure.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Mobile App Deployment](#mobile-app-deployment)
4. [Web Deployment](#web-deployment)
5. [Backend Setup (Optional)](#backend-setup-optional)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Monitoring & Analytics](#monitoring--analytics)
8. [Post-Deployment](#post-deployment)

---

## 1. Prerequisites

### Required Accounts

**Development:**
- [ ] GitHub account (for version control)
- [ ] Expo account (for builds and deployment)
- [ ] Node.js v18+ installed
- [ ] npm or bun installed

**iOS Deployment:**
- [ ] Apple Developer Account ($99/year)
- [ ] App Store Connect access
- [ ] macOS for local development (optional)
- [ ] Xcode installed (optional)

**Android Deployment:**
- [ ] Google Play Console Account ($25 one-time)
- [ ] Google Cloud Project (for services)
- [ ] Android Studio (optional)

**Web Deployment:**
- [ ] Domain name registered
- [ ] DNS configured
- [ ] SSL certificate
- [ ] Web hosting account (Vercel/Netlify/EAS)

### Tools Installation

```bash
# Install Node.js (using nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Install package manager
npm install -g npm@latest
# OR
curl -fsSL https://bun.sh/install | bash

# Install EAS CLI
npm install -g @expo/eas-cli

# Install Expo CLI
npm install -g expo-cli
```

---

## 2. Environment Setup

### 2.1 Clone Repository

```bash
git clone https://github.com/tc7kxsszs5-cloud/rork-kiku.git
cd rork-kiku
```

### 2.2 Install Dependencies

```bash
# Using npm
npm install --legacy-peer-deps

# Using bun
bun install
```

### 2.3 Environment Variables

Create `.env` file:

```env
# App Configuration
EXPO_PUBLIC_APP_ENV=production
EXPO_PUBLIC_APP_VERSION=1.0.0

# API Configuration (when backend is added)
EXPO_PUBLIC_API_URL=https://api.kiku-app.com
EXPO_PUBLIC_API_KEY=your_api_key_here

# Analytics (optional)
EXPO_PUBLIC_ANALYTICS_ID=your_analytics_id

# Error Tracking (optional)
EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Push Notifications (optional)
EXPO_PUBLIC_PUSH_KEY=your_expo_push_key

# Feature Flags
EXPO_PUBLIC_ENABLE_AI_CLOUD=false
EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=false
```

**Security Note:** Never commit `.env` file to repository!

### 2.4 Configure EAS

Initialize EAS:

```bash
# Login to Expo
eas login

# Initialize EAS
eas build:configure
```

This creates `eas.json` configuration file.

### 2.5 Update eas.json

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-id",
        "appleTeamId": "YOUR_TEAM_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./path/to/service-account.json",
        "track": "production"
      }
    }
  }
}
```

---

## 3. Mobile App Deployment

### 3.1 iOS Deployment

**Step 1: Configure App Store Connect**

1. Create app in App Store Connect
2. Set bundle identifier: `com.kiku.childsafety`
3. Configure app information
4. Upload required assets
5. Complete privacy questionnaire

**Step 2: Build iOS App**

```bash
# Build for production
eas build --platform ios --profile production

# Or build and submit in one command
eas build --platform ios --profile production --auto-submit
```

**Step 3: Submit to App Store**

```bash
# Manual submit (if not auto-submitted)
eas submit --platform ios --latest

# Or submit specific build
eas submit --platform ios --id YOUR_BUILD_ID
```

**Step 4: TestFlight Distribution**

```bash
# Build for TestFlight
eas build --platform ios --profile preview

# Invite testers in App Store Connect
# Testers will receive email with TestFlight link
```

### 3.2 Android Deployment

**Step 1: Configure Google Play Console**

1. Create app in Google Play Console
2. Set package name: `com.kiku.childsafety`
3. Complete store listing
4. Upload required assets
5. Complete content rating

**Step 2: Generate Upload Key**

```bash
# Generate keystore
keytool -genkeypair -v -storetype PKCS12 \
  -keystore kiku-upload-key.keystore \
  -alias kiku-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

**Important:** Store keystore securely! You cannot recover it if lost.

**Step 3: Build Android App**

```bash
# Build for production (AAB)
eas build --platform android --profile production

# Or build APK for testing
eas build --platform android --profile production --no-wait
```

**Step 4: Submit to Google Play**

```bash
# Submit to Google Play
eas submit --platform android --latest

# Or submit specific build
eas submit --platform android --id YOUR_BUILD_ID
```

### 3.3 Multi-Platform Build

Build for both platforms simultaneously:

```bash
# Build both iOS and Android
eas build --platform all --profile production

# Build and auto-submit both
eas build --platform all --profile production --auto-submit
```

---

## 4. Web Deployment

### 4.1 Build Web Version

```bash
# Build for web
npx expo export --platform web

# Output will be in dist/ folder
```

### 4.2 Deploy to Vercel

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Or deploy with custom domain
vercel --prod --name kiku-app
```

**Option B: Using Git Integration**

1. Connect GitHub repo to Vercel
2. Configure build settings:
   - Build Command: `npx expo export --platform web`
   - Output Directory: `dist`
   - Install Command: `npm install --legacy-peer-deps`
3. Deploy automatically on push

### 4.3 Deploy to Netlify

**Option A: Using Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**Option B: Using Drag & Drop**

1. Build locally: `npx expo export --platform web`
2. Visit Netlify dashboard
3. Drag `dist` folder to deploy

### 4.4 Deploy with EAS Hosting

```bash
# Configure EAS Hosting
eas hosting:configure

# Build and deploy
npx expo export --platform web
eas hosting:deploy
```

### 4.5 Custom Domain Setup

**DNS Configuration:**

```
A Record:
Name: @
Value: [Your hosting provider's IP]

CNAME Record:
Name: www
Value: [Your hosting provider's domain]
```

**SSL Certificate:**
- Let's Encrypt (free, auto-renewal)
- Cloudflare (free with proxy)
- Provider's built-in SSL

---

## 5. Backend Setup (Optional)

### 5.1 Backend Architecture

**Recommended Stack:**
- Node.js + Express or Hono
- PostgreSQL or MongoDB
- Redis for caching
- AWS S3 for file storage
- WebSocket for real-time

### 5.2 Deploy to Cloud

**AWS:**
```bash
# Using AWS Elastic Beanstalk
eb init
eb create production
eb deploy
```

**Google Cloud:**
```bash
# Using Google App Engine
gcloud app create
gcloud app deploy
```

**Railway:**
```bash
# Using Railway CLI
railway login
railway init
railway up
```

### 5.3 Database Setup

**PostgreSQL (Supabase):**
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize
supabase init

# Link to project
supabase link --project-ref your-project-ref

# Push schema
supabase db push
```

**MongoDB (Atlas):**
1. Create cluster in MongoDB Atlas
2. Configure network access
3. Create database user
4. Get connection string
5. Update environment variables

---

## 6. CI/CD Pipeline

### 6.1 GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  build-ios:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install --legacy-peer-deps
      
      - name: Install EAS CLI
        run: npm install -g @expo/eas-cli
      
      - name: Build iOS
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
        run: eas build --platform ios --profile production --non-interactive --no-wait

  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install --legacy-peer-deps
      
      - name: Install EAS CLI
        run: npm install -g @expo/eas-cli
      
      - name: Build Android
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
        run: eas build --platform android --profile production --non-interactive --no-wait

  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install --legacy-peer-deps
      
      - name: Build web
        run: npx expo export --platform web
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 6.2 Required Secrets

Add to GitHub repository secrets:

```
EXPO_TOKEN - Expo access token
VERCEL_TOKEN - Vercel deployment token
VERCEL_ORG_ID - Vercel organization ID
VERCEL_PROJECT_ID - Vercel project ID
APPLE_API_KEY - Apple App Store Connect API key
GOOGLE_SERVICE_ACCOUNT - Google Play service account JSON
```

### 6.3 Automated Testing

Add test job before deployment:

```yaml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18
    - name: Install dependencies
      run: npm install --legacy-peer-deps
    - name: Run lint
      run: npm run lint
    - name: Run type check
      run: npx tsc --noEmit
```

---

## 7. Monitoring & Analytics

### 7.1 Crash Reporting

**Sentry Integration:**

```bash
# Install Sentry
npx @sentry/wizard@latest -i reactNative

# Configure Sentry
# Follow wizard instructions
```

**In app.json:**
```json
{
  "expo": {
    "hooks": {
      "postPublish": [
        {
          "file": "sentry-expo/upload-sourcemaps",
          "config": {
            "organization": "your-org",
            "project": "kiku-app"
          }
        }
      ]
    }
  }
}
```

### 7.2 Analytics

**Firebase Analytics:**

```bash
# Install Firebase
npx expo install @react-native-firebase/app @react-native-firebase/analytics
```

**Mixpanel:**

```bash
# Install Mixpanel
npm install mixpanel-react-native
```

### 7.3 Performance Monitoring

**Firebase Performance:**

```bash
npx expo install @react-native-firebase/perf
```

**Custom Metrics:**

```typescript
// Track custom events
import * as Analytics from 'expo-firebase-analytics';

Analytics.logEvent('safety_alert_triggered', {
  risk_level: 'high',
  timestamp: Date.now()
});
```

---

## 8. Post-Deployment

### 8.1 Health Checks

**Create monitoring dashboard:**

- [ ] App store availability
- [ ] Build success rate
- [ ] Crash-free rate
- [ ] API response times
- [ ] Error rates
- [ ] User satisfaction

**Tools:**
- New Relic
- Datadog
- Grafana
- Custom dashboard

### 8.2 Rollout Strategy

**Staged Rollout:**

```
Phase 1: 1% of users (24 hours)
  ↓ (If stable)
Phase 2: 5% of users (24 hours)
  ↓ (If stable)
Phase 3: 10% of users (48 hours)
  ↓ (If stable)
Phase 4: 50% of users (72 hours)
  ↓ (If stable)
Phase 5: 100% of users
```

**Google Play Console:**
- Use staged rollout feature
- Monitor metrics at each stage
- Halt rollout if issues detected

### 8.3 Rollback Plan

**If critical issues detected:**

1. **Immediate Actions:**
   - Halt staged rollout
   - Document the issue
   - Notify team

2. **Quick Fix:**
   - Fix issue locally
   - Test thoroughly
   - Build new version
   - Resume rollout

3. **Full Rollback:**
   - Remove from app stores (last resort)
   - Notify users
   - Fix issue completely
   - Re-submit after testing

### 8.4 User Communication

**Announcement Template:**

```
Subject: KIKU Update v1.0.0 - Enhanced Safety Features

Dear KIKU Users,

We're excited to announce a major update to KIKU with enhanced child safety features:

✨ New Features:
- [Feature 1]
- [Feature 2]

🔒 Security Improvements:
- [Security feature]

🐛 Bug Fixes:
- [Bug fix]

Update now to keep your children safe!

Best regards,
KIKU Team
```

---

## 9. Maintenance

### 9.1 Regular Tasks

**Daily:**
- Monitor crash reports
- Check error logs
- Review user feedback

**Weekly:**
- Update dependencies
- Security patches
- Performance review

**Monthly:**
- Feature updates
- Compliance review
- Analytics analysis

**Quarterly:**
- Security audit
- Penetration testing
- Architecture review

### 9.2 Update Cycle

**Patch Updates (1.0.x):**
- Bug fixes
- Security patches
- Minor improvements
- Release: As needed

**Minor Updates (1.x.0):**
- New features
- UI improvements
- Performance enhancements
- Release: Monthly

**Major Updates (x.0.0):**
- Major features
- Architecture changes
- Breaking changes
- Release: Quarterly

---

## 10. Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
eas build --platform ios --clear-cache
```

**Submission Errors:**
```bash
# Check credentials
eas credentials

# Re-authenticate
eas login
```

**Web Build Issues:**
```bash
# Clear web build
rm -rf dist .expo
npx expo export --platform web --clear
```

---

## 11. Checklist

### Pre-Deployment ✓
- [ ] All tests passing
- [ ] No console errors
- [ ] Performance optimized
- [ ] Security audit complete
- [ ] Documentation updated
- [ ] Environment variables set
- [ ] Secrets secured

### Deployment ✓
- [ ] iOS build successful
- [ ] Android build successful
- [ ] Web deployment successful
- [ ] Monitoring configured
- [ ] Analytics tracking
- [ ] Error reporting enabled

### Post-Deployment ✓
- [ ] App store listing live
- [ ] Health checks passing
- [ ] User feedback monitored
- [ ] Support team briefed
- [ ] Documentation published
- [ ] Announcement sent

---

## 12. Resources

**Official Documentation:**
- [Expo Deployment](https://docs.expo.dev/build/introduction/)
- [EAS Build](https://docs.expo.dev/build/setup/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)

**Support:**
- Email: deployment@kiku-app.com
- Slack: #deployment
- Documentation: https://docs.kiku-app.com

---

**Document Version:** 1.0  
**Last Updated:** January 2, 2026  
**Next Review:** March 1, 2026

© 2026 KIKU - Child Safety Platform

**Happy Deploying! 🚀**
