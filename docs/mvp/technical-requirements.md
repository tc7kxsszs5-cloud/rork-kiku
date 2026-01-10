# Technical Requirements - Rork-Kiku MVP

## System Requirements

### Mobile Platforms

#### iOS
- **Minimum**: iOS 13.4+
- **Recommended**: iOS 15.0+
- **Devices**: iPhone 8 и новее, iPad Pro, iPad Air 3+
- **Storage**: 100MB minimum, 200MB recommended
- **RAM**: 2GB minimum, 3GB+ recommended

#### Android
- **Minimum**: Android 6.0 (API 23)
- **Recommended**: Android 10.0+ (API 29)
- **Devices**: All Android devices meeting requirements
- **Storage**: 100MB minimum, 200MB recommended
- **RAM**: 2GB minimum, 3GB+ recommended

#### Web
- **Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Resolution**: 1024x768 minimum
- **Storage**: 50MB browser storage

---

## Development Requirements

### Environment
- **Node.js**: v20.x LTS
- **npm**: v10.x
- **Expo CLI**: Latest
- **EAS CLI**: Latest (for builds)

### Editors
- **Recommended**: VS Code с расширениями:
  - ESLint
  - Prettier
  - React Native Tools
  - TypeScript

---

## Technical Stack

### Frontend
```json
{
  "react": "19.1.0",
  "react-native": "0.81.5",
  "expo": "~54.0.20",
  "typescript": "~5.9.2",
  "expo-router": "~6.0.13"
}
```

### State Management
```json
{
  "@tanstack/react-query": "^5.90.11",
  "@nkzw/create-context-hook": "^1.1.0",
  "@react-native-async-storage/async-storage": "2.2.0"
}
```

### Backend
```json
{
  "hono": "^4.10.6",
  "@trpc/server": "^11.7.2",
  "@trpc/client": "^11.7.2"
}
```

### AI/ML
```json
{
  "@rork-ai/toolkit-sdk": "*",
  "zod": "^4.1.13"
}
```

---

## API Requirements

### tRPC API
- **Protocol**: HTTP/HTTPS
- **Format**: JSON
- **Transformer**: SuperJSON
- **Timeout**: 10 seconds
- **Retry**: Disabled (fail fast)

### AI API
- **Provider**: Rork AI Platform
- **Rate Limit**: 1000 requests/day (free tier)
- **Timeout**: 30 seconds
- **Max payload**: 10MB

---

## Storage Requirements

### Local Storage (AsyncStorage)
- **Capacity**: Up to 6MB (iOS), 10MB (Android)
- **Usage**: ~2-5MB per user
- **Keys**: Prefixed with @ for organization

### Secure Storage
- **Provider**: expo-secure-store
- **Backend**: Keychain (iOS), Keystore (Android)
- **Usage**: Passwords, API keys

---

## Network Requirements

### Bandwidth
- **Minimum**: 3G (1 Mbps)
- **Recommended**: 4G/LTE (5+ Mbps)
- **WiFi**: Preferred for initial setup

### Latency
- **Tolerable**: < 1000ms
- **Target**: < 300ms
- **Critical path**: API calls, AI analysis

---

## Performance Requirements

### Application Performance
- **Cold Start**: < 3 seconds
- **Hot Start**: < 1 second
- **Screen Transition**: < 300ms
- **List Scroll**: 60 FPS

### API Performance
- **Response Time**: P95 < 500ms
- **Throughput**: 100 requests/second
- **Availability**: 99.5%

### AI Performance
- **Analysis Time**: < 3 seconds (text)
- **Image Analysis**: < 5 seconds
- **Audio Transcription**: < 10 seconds

---

## Security Requirements

### Authentication
- **Method**: Email + Password
- **Hashing**: Argon2 или bcrypt
- **Session**: Local storage
- **Biometrics**: Optional (future)

### Data Protection
- **Encryption**: AES-256 (at rest)
- **Transport**: TLS 1.3
- **Access Control**: RBAC (parent/child)

### Compliance
- **COPPA**: Full compliance
- **GDPR-K**: Full compliance
- **Russian Law**: ФЗ-152 compliant

---

## Scalability Requirements

### Horizontal Scaling
- **API**: Stateless, easily replicated
- **Database**: Sharding ready (future)
- **Cache**: Redis (future)

### Vertical Scaling
- **CPU**: Auto-scale based on load
- **Memory**: Elastic allocation
- **Storage**: Expandable

---

## Monitoring Requirements

### Metrics
- **Uptime**: 99.5%
- **Error Rate**: < 1%
- **Response Time**: P95 < 500ms
- **Crash Rate**: < 0.1%

### Logging
- **Level**: INFO in production
- **Retention**: 30 days
- **Format**: JSON structured logs

---

## Testing Requirements

### Unit Tests
- **Coverage**: Target 70%+
- **Framework**: Jest
- **Run**: Pre-commit hook

### Integration Tests
- **Coverage**: Critical paths
- **Framework**: Jest + Testing Library
- **Run**: CI/CD pipeline

### E2E Tests
- **Coverage**: User flows
- **Framework**: Detox (future)
- **Run**: Pre-release

---

## Deployment Requirements

### CI/CD
- **Platform**: GitHub Actions
- **Checks**: Lint, TypeScript, Tests
- **Deploy**: Automatic on main merge

### App Stores
- **iOS**: App Store Connect
- **Android**: Google Play Console
- **Review Time**: Allow 3-5 business days

---

## Maintenance Requirements

### Updates
- **OTA**: Monthly feature updates
- **App Store**: Quarterly major updates
- **Security**: Immediate critical fixes

### Support
- **Channels**: Email, in-app
- **Response**: 24-48 hours
- **Languages**: Russian, English

---

## См. также
- [Product Specification](./product-specification.md)
- [Architecture Overview](../architecture/overview.md)
- [Deployment Guide](../operations/deployment.md)
