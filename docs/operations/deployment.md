# Deployment Guide - Rork-Kiku

## Обзор

Rork-Kiku развертывается как React Native приложение через Expo на платформах iOS, Android и Web.

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Users                               │
│         (iOS / Android / Web)                        │
└─────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│              App Distribution                        │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────┐  │
│  │  App Store  │ │ Google Play  │ │ Web Hosting │  │
│  │    (iOS)    │ │  (Android)   │ │ (Vercel/CF) │  │
│  └─────────────┘ └──────────────┘ └─────────────┘  │
└─────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│              Backend API                             │
│         https://d8v7u672uumlfpscvnbps.rork.live     │
│                (Rork Platform)                       │
└─────────────────────────────────────────────────────┘
```

---

## Prerequisites

### Development Environment

```bash
# Node.js LTS
node --version  # v20.x

# Package Manager
npm --version   # v10.x

# Expo CLI
npm install -g expo-cli

# EAS CLI (для builds)
npm install -g eas-cli
```

### Accounts Required

1. **Expo Account**: https://expo.dev
2. **Apple Developer**: https://developer.apple.com ($99/год)
3. **Google Play Console**: https://play.google.com/console ($25 one-time)
4. **Rork Platform**: https://rork.live

---

## Local Development

### 1. Clone Repository

```bash
git clone https://github.com/tc7kxsszs5-cloud/rork-kiku.git
cd rork-kiku
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using bun (if available)
bun install
```

### 3. Environment Configuration

Create `.env` file (optional):
```bash
# .env
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_AI_API_KEY=your_ai_key_here
```

### 4. Start Development Server

```bash
# Start Expo dev server
npm start

# или for web
npm run start-web

# или for specific platform
expo start --ios
expo start --android
expo start --web
```

### 5. Running on Devices

**iOS Simulator** (Mac only):
```bash
expo start --ios
```

**Android Emulator**:
```bash
expo start --android
```

**Physical Device**:
1. Install Expo Go app from App/Play Store
2. Scan QR code from terminal

---

## Production Build

### iOS Build (via EAS)

#### 1. Configure EAS

```bash
# Login to Expo
eas login

# Configure project
eas build:configure
```

#### 2. Update `eas.json`

```json
{
  "build": {
    "production": {
      "ios": {
        "bundleIdentifier": "com.rork-kiku.app",
        "buildType": "app-store",
        "credentialsSource": "remote"
      }
    }
  }
}
```

#### 3. Build for App Store

```bash
# Create production build
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

#### 4. App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Create new app
3. Fill metadata:
   - Name: Rork Kiku
   - Category: Utilities
   - Age Rating: 4+
   - Privacy Policy URL
4. Upload screenshots
5. Submit for review

---

### Android Build (via EAS)

#### 1. Configure Android Build

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle",
        "credentialsSource": "remote"
      }
    }
  }
}
```

#### 2. Build for Google Play

```bash
# Create production build
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android
```

#### 3. Google Play Console

1. Go to https://play.google.com/console
2. Create new app
3. Fill store listing:
   - Name: Rork Kiku
   - Category: Parenting
   - Content rating: 3+
4. Upload APK/Bundle
5. Submit for review

---

### Web Deployment

#### 1. Build for Web

```bash
# Create web build
npx expo export --platform web
```

#### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**vercel.json**:
```json
{
  "buildCommand": "expo export --platform web",
  "outputDirectory": "dist",
  "framework": null,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### 3. Alternative: Cloudflare Pages

```bash
# Build
npx expo export --platform web

# Deploy via Wrangler
npx wrangler pages publish dist
```

---

## Backend Deployment

### Deploy to Rork Platform

```bash
# Using Rork CLI
bunx rork start -p d8v7u672uumlfpscvnbps --tunnel

# Production mode
NODE_ENV=production bunx rork start -p d8v7u672uumlfpscvnbps
```

### Environment Variables

Set in Rork platform:
```bash
NODE_ENV=production
CORS_ORIGIN=https://your-app.com
AI_API_KEY=your_key
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

`.github/workflows/build.yml`:
```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run tsc

  build-ios:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform ios --non-interactive --no-wait

  build-android:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform android --non-interactive --no-wait
```

---

## Over-the-Air (OTA) Updates

### Enable OTA Updates

```bash
# Publish update
eas update --branch production --message "Bug fixes"
```

### Configuration in `app.json`

```json
{
  "expo": {
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

### Update Strategy

- **Critical Bugs**: Immediate OTA
- **New Features**: Wait for next app version
- **Security Fixes**: Immediate OTA + app update

---

## Monitoring & Observability

### 1. Error Tracking (Sentry)

```bash
npm install @sentry/react-native
```

**Configuration**:
```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'your-dsn-here',
  environment: __DEV__ ? 'development' : 'production',
  enableInExpoDevelopment: false,
  tracesSampleRate: 0.1,
});
```

### 2. Analytics

```typescript
// Using Expo's built-in analytics
import * as Analytics from 'expo-analytics';

Analytics.logEvent('user_login', {
  method: 'email',
});
```

### 3. Performance Monitoring

```typescript
// Using React Native Performance
import Performance from 'react-native-performance';

Performance.mark('app_start');
// ... app logic
Performance.measure('app_startup', 'app_start');
```

---

## Rollback Strategy

### 1. OTA Rollback

```bash
# Rollback to previous update
eas update --branch production --message "Rollback" --republish
```

### 2. App Store Rollback

1. Submit previous version to App Store
2. Expedite review process
3. Communicate with users

### 3. Feature Flags

```typescript
// Using expo-constants
import Constants from 'expo-constants';

const featureFlags = Constants.expoConfig?.extra?.featureFlags || {};

if (featureFlags.newAIModel) {
  // Use new model
} else {
  // Use old model
}
```

---

## Scaling Considerations

### 1. API Scaling

**Current**: Rork Platform auto-scales
**Future**: Add dedicated backend
- Load balancer (NGINX/Cloudflare)
- Multiple instances
- Database (PostgreSQL)
- Redis cache

### 2. AI Scaling

**Current**: Rork AI API
**Future**: 
- Batch processing
- Queue system (Bull/BullMQ)
- Dedicated AI servers
- Model caching

### 3. Storage Scaling

**Current**: Local-first (AsyncStorage)
**Future**:
- Cloud sync (optional)
- S3 for media
- CDN for images

---

## Backup & Recovery

### 1. User Data Backup

**Local Backup**:
```typescript
const exportUserData = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const data = await AsyncStorage.multiGet(keys);
  return JSON.stringify(data);
};
```

**Cloud Backup** (Future):
- iCloud (iOS)
- Google Drive (Android)
- Encrypted backups

### 2. Disaster Recovery

**RPO** (Recovery Point Objective): 24 hours
**RTO** (Recovery Time Objective): 4 hours

**Steps**:
1. Restore from backup
2. Redeploy application
3. Verify data integrity
4. Communicate with users

---

## Security Operations

### 1. Secret Management

**Development**:
```bash
# .env (gitignored)
EXPO_PUBLIC_API_KEY=dev_key
```

**Production**:
```bash
# Use Expo Secrets
eas secret:create --scope project --name API_KEY --value prod_key
```

### 2. Access Control

**Repository**:
- Branch protection (main)
- Required reviews (2+)
- CI checks must pass

**Deployment**:
- Only authorized users can deploy
- 2FA required for accounts
- Audit log of deployments

---

## Compliance Operations

### 1. Data Retention

**Policy**:
- Active users: Indefinite (user controls)
- Deleted accounts: 30 days grace period
- Compliance logs: 3 years

**Implementation**:
```typescript
const scheduleDataDeletion = async (userId: string) => {
  const deletionDate = new Date();
  deletionDate.setDate(deletionDate.getDate() + 30);
  
  await AsyncStorage.setItem(`@pending_deletion_${userId}`, deletionDate.toISOString());
};
```

### 2. Audit Logs

**Required for**:
- User authentication
- Data access
- Settings changes
- Data deletion

**Retention**: 3 years

---

## Support Operations

### 1. User Support

**Channels**:
- Email: support@rork-kiku.com
- In-app feedback form
- FAQ/Knowledge base

**SLA**:
- Critical: 4 hours
- High: 24 hours
- Medium: 72 hours
- Low: 1 week

### 2. Incident Communication

**Template**:
```
Subject: [Incident] Service Disruption

We're experiencing [issue description].

Impact: [affected users/features]
Status: [investigating/resolved]
ETA: [time to resolution]

We'll update you every [interval].

Sorry for the inconvenience.
- Rork Kiku Team
```

---

## Release Process

### 1. Version Numbering

**Semantic Versioning**: `MAJOR.MINOR.PATCH`
- **MAJOR**: Breaking changes
- **MINOR**: New features
- **PATCH**: Bug fixes

Example: `1.2.3`

### 2. Release Checklist

**Pre-Release**:
- [ ] All tests passing
- [ ] Code review completed
- [ ] Security scan clean
- [ ] Documentation updated
- [ ] Changelog prepared
- [ ] Release notes written

**Release**:
- [ ] Version bumped
- [ ] Git tag created
- [ ] Builds triggered
- [ ] Submitted to stores
- [ ] OTA update published

**Post-Release**:
- [ ] Monitor error rates
- [ ] Check user feedback
- [ ] Update status page
- [ ] Announce release

### 3. Hotfix Process

**Critical Bug**:
1. Create hotfix branch from main
2. Fix and test
3. Emergency release
4. OTA update immediately
5. Follow up with app update

**Timeline**: < 4 hours

---

## Cost Estimation

### Monthly Operational Costs

**Infrastructure**:
- Expo: $29/month (Team plan)
- Rork Platform: $50/month
- Domain: $10/month
- SSL: $0 (Let's Encrypt)
**Total**: $89/month

**Third-Party Services**:
- AI API: $100-500/month (usage-based)
- Sentry: $26/month (Team plan)
- Analytics: $0 (free tier)
**Total**: $126-526/month

**App Stores**:
- Apple Developer: $99/year (~$8/month)
- Google Play: $25 one-time
**Total**: ~$8/month

**Grand Total**: $223-623/month

---

## См. также
- [Security Operations](./security-ops.md)
- [Monitoring Guide](./monitoring.md)
- [Runbook](./runbook.md)
