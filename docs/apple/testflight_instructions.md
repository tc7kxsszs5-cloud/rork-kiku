# Инструкции по TestFlight и App Store — Rork-Kiku iOS

## Версия документа
- **Версия**: 0.1.0 (Черновик)
- **Дата**: 2026-01-02
- **Статус**: DRAFT — для команды разработки
- **Контакт**: [FOUNDERS_EMAIL]

---

## 1. Предварительные требования

### 1.1. Apple Developer Account
- **Необходимо**: Apple Developer Program membership ($99/year)
- **Регистрация**: https://developer.apple.com/programs/
- **Entity type**: Individual или Organization (рекомендуется Organization для startup)
- **Примечание**: Account approval занимает 24-48 часов

**⚠️ ВАЖНО**: На момент создания этого документа Apple Developer Account может быть недоступен. Этот документ описывает процесс для будущей настройки.

### 1.2. Необходимые инструменты
- Xcode 15+ (для iOS 17 development)
- macOS 13+ (Ventura или новее)
- Expo CLI (`npm install -g expo-cli` или `bun add -g expo-cli`)
- EAS CLI (`npm install -g eas-cli` или `bun add -g eas-cli`)
- fastlane (опционально): `gem install fastlane` или `brew install fastlane`

---

## 2. App Store Connect Setup

### 2.1. Создание App ID
1. Login to [App Store Connect](https://appstoreconnect.apple.com/)
2. Navigate: **Certificates, Identifiers & Profiles** → **Identifiers**
3. Click **"+"** → **App IDs**
4. Configure:
   - **Description**: Rork-Kiku
   - **Bundle ID**: `com.rorkkiku.app` или `com.[YOUR_COMPANY].rorkkiku`
     - **Explicit App ID** (не wildcard)
   - **Capabilities**:
     - ☑️ Push Notifications
     - ☑️ Sign in with Apple
     - ☑️ Associated Domains (если deep linking)
     - ☑️ App Groups (если extension планируется)
5. Register

**PLACEHOLDER**: `com.rorkkiku.app` — заменить на actual Bundle ID

### 2.2. Создание App в App Store Connect
1. Login to App Store Connect
2. Navigate: **My Apps** → **"+"** → **New App**
3. Fill form:
   - **Platforms**: iOS
   - **Name**: Rork-Kiku
   - **Primary Language**: English (US)
   - **Bundle ID**: Select `com.rorkkiku.app` (created above)
   - **SKU**: `rorkkiku-ios` (unique identifier)
   - **User Access**: Full Access
4. Create

### 2.3. App Information
Navigate: **App Store** → **App Information**

**Category**:
- Primary: Lifestyle
- Secondary: Social Networking (или Parenting — если есть)

**Age Rating**:
- **Questionnaire**: Complete App Store age rating questionnaire
- Expected: **4+** (app itself безопасен, но parent-controlled)
- Content descriptors: None (no violence, sexual content, etc. in app UI)

**Privacy Policy URL**: `https://rork-kiku.com/privacy` [PLACEHOLDER]

**Support URL**: `https://rork-kiku.com/support` [PLACEHOLDER]

**Marketing URL** (optional): `https://rork-kiku.com` [PLACEHOLDER]

---

## 3. Certificates и Provisioning Profiles

### 3.1. Development Certificate (для local testing)
1. Navigate: **Certificates, Identifiers & Profiles** → **Certificates**
2. Click **"+"** → **iOS App Development**
3. Follow instructions:
   - Create CSR (Certificate Signing Request) в Keychain Access
   - Upload CSR
   - Download certificate (.cer)
   - Double-click to install в Keychain

### 3.2. Distribution Certificate (для TestFlight/App Store)
1. Navigate: **Certificates** → **"+"** → **iOS Distribution**
2. Create CSR → Upload → Download → Install
3. **⚠️ ВАЖНО**: Store .p12 securely (для CI/CD)
   - Export certificate from Keychain → Include private key → .p12 file
   - Set strong password
   - **НЕ commit в Git!** Хранить в GitHub Secrets или Vault

### 3.3. Provisioning Profiles

#### Development Profile
1. Navigate: **Profiles** → **"+"** → **iOS App Development**
2. Select: App ID (`com.rorkkiku.app`)
3. Select: Development Certificate (created above)
4. Select: Test Devices (register UDIDs first)
5. Name: `Rork Kiku Development`
6. Generate → Download → Install (double-click)

#### Distribution Profile (для TestFlight)
1. Navigate: **Profiles** → **"+"** → **App Store**
2. Select: App ID
3. Select: Distribution Certificate
4. Name: `Rork Kiku App Store`
5. Generate → Download

---

## 4. Expo EAS Build Configuration

### 4.1. EAS Setup
```bash
# Install EAS CLI (если ещё не установлен)
npm install -g eas-cli

# Login to Expo
eas login

# Initialize EAS
cd /path/to/rork-kiku
eas build:configure
```

### 4.2. eas.json Configuration
Файл `eas.json` уже должен существовать. Пример конфигурации:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": false
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
        "bundleIdentifier": "com.rorkkiku.app",
        "buildNumber": "1"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "[APPLE_EMAIL]",
        "ascAppId": "[APP_STORE_CONNECT_APP_ID]",
        "appleTeamId": "[TEAM_ID]"
      }
    }
  }
}
```

**Placeholders**:
- `[APPLE_EMAIL]`: Apple ID email
- `[APP_STORE_CONNECT_APP_ID]`: Найти в App Store Connect (numeric ID)
- `[TEAM_ID]`: Найти в Apple Developer Account → Membership

### 4.3. app.json / app.config.js
Убедитесь, что `app.json` правильно настроен:

```json
{
  "expo": {
    "name": "Rork-Kiku",
    "slug": "rork-kiku",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.rorkkiku.app",
      "buildNumber": "1",
      "supportsTablet": false,
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "Rork-Kiku needs access to your photo library to upload photos for your children.",
        "NSCameraUsageDescription": "Rork-Kiku needs access to your camera to take photos for your children.",
        "NSPhotoLibraryAddUsageDescription": "Rork-Kiku needs permission to save photos to your library."
      },
      "associatedDomains": ["applinks:rork-kiku.com"],
      "usesAppleSignIn": true
    },
    "extra": {
      "eas": {
        "projectId": "[EAS_PROJECT_ID]"
      }
    }
  }
}
```

**PLACEHOLDER**: `[EAS_PROJECT_ID]` — получить при `eas build:configure`

---

## 5. Build Process

### 5.1. Local Build (для debugging)
```bash
# Build для iOS simulator (быстрый тест)
eas build --platform ios --profile development --local

# Или использовать Expo standard build
expo prebuild
npx expo run:ios
```

### 5.2. EAS Cloud Build (рекомендуется для TestFlight)
```bash
# Production build (для TestFlight/App Store)
eas build --platform ios --profile production

# Процесс:
# 1. EAS uploads code to cloud
# 2. EAS builds на macOS runners (30-40 min)
# 3. Build URL предоставляется → download .ipa
```

**Billing**: Expo предоставляет free tier (limited builds/month), потом paid plans.

### 5.3. Build Status Monitoring
- EAS Dashboard: https://expo.dev/accounts/[ACCOUNT]/projects/[PROJECT]/builds
- Логи доступны в real-time
- Notifications в email при завершении build

---

## 6. TestFlight Upload

### 6.1. Option A: EAS Submit (рекомендуется)
```bash
# After successful build
eas submit --platform ios --profile production

# Или specify build ID
eas submit --platform ios --id [BUILD_ID]

# EAS автоматически:
# 1. Downloads .ipa from build
# 2. Uploads to App Store Connect
# 3. Sets metadata (если configured)
```

**Credentials требуемые**:
- Apple ID email
- App-specific password (не основной пароль!)
  - Generate: https://appleid.apple.com/account/manage → Security → App-Specific Passwords
  - Store в EAS secrets: `eas secret:create APPLE_APP_SPECIFIC_PASSWORD`

### 6.2. Option B: Manual Upload (альтернатива)
1. Download .ipa from EAS
2. Open **Xcode** → **Window** → **Organizer**
3. Drag .ipa to Organizer → **Archives**
4. Select archive → **Distribute App** → **App Store Connect** → **Upload**
5. Follow wizard

### 6.3. Option C: fastlane (для automation)
```ruby
# Fastfile (если используется fastlane)
lane :beta do
  build_app(
    scheme: "RorkKiku",
    export_method: "app-store",
    output_directory: "./build"
  )
  
  upload_to_testflight(
    api_key_path: "./secrets/app_store_api_key.json",
    skip_waiting_for_build_processing: true
  )
end
```

---

## 7. TestFlight Configuration

### 7.1. После загрузки в App Store Connect
1. Login: https://appstoreconnect.apple.com/
2. Navigate: **My Apps** → **Rork-Kiku** → **TestFlight**
3. Select: Latest build (обработка занимает 10-30 min)

### 7.2. Test Information
- **What to Test**: Опишите, что testers должны проверить
  - "Test photo upload, moderation flow, notifications"
- **Beta App Description**: "Rork-Kiku is a safe media sharing app for families..."
- **Feedback Email**: [FOUNDERS_EMAIL]
- **Privacy Policy**: Provide link
- **Sign In Required**: Yes
- **Demo account** (если required): Provide test credentials

### 7.3. Export Compliance (обязательно!)
**Question**: "Does your app use encryption?"
- **Answer**: Yes (TLS/HTTPS)
- **Follow-up**: "Is encryption limited to standard encryption in iOS?"
  - **Answer**: Yes
- **Result**: No export compliance documentation needed

### 7.4. Internal Testing (первый этап)
- Add internal testers (до 100 users):
  - App Store Connect Users → Add email
- **Advantage**: No review required, instant access
- **Use**: Team + family & friends для initial testing

### 7.5. External Testing (pilot)
- Add external testers (до 10,000 users):
  - Individual emails или Public link
- **Requires**: Beta App Review by Apple (1-2 days)
- **Use**: Pilot users, school partnerships

### 7.6. Public Link (опционально)
- Generate public TestFlight link
- Anyone с link может join (до 10,000 testers)
- **Use**: Open beta

---

## 8. App Store Metadata (для будущего public launch)

### 8.1. App Store Listing
Navigate: **App Store** → **App Store Listing**

**App Name**: Rork-Kiku (30 characters max)

**Subtitle**: Safe family media sharing (30 characters max)

**Description** (4000 characters):
```
Rork-Kiku helps parents share photos and videos safely with their children. 
Every piece of content is automatically reviewed by AI to protect children 
from inappropriate content.

Features:
• AI-powered content moderation
• Customizable safety levels (strict, moderate, relaxed)
• Push notifications for moderation updates
• Simple, family-friendly interface
• Privacy-first: COPPA and GDPR compliant

How it works:
1. Create profiles for your children
2. Upload photos or videos
3. AI reviews content automatically (< 10 seconds)
4. Only approved content reaches your child

Perfect for:
• Parents who want control over what their kids see
• Families staying connected safely
• Anyone concerned about online child safety

Download Rork-Kiku today and share memories safely!
```

**Keywords** (100 characters, comma-separated):
```
parental control,child safety,family,photos,safe,moderation,kids,parent,privacy
```

**Promotional Text** (170 characters, обновляемый без review):
```
New: Video support! Now you can safely share videos with your children. AI moderation keeps them protected from inappropriate content.
```

### 8.2. Screenshots (Required)
**6.5" Display** (iPhone 14 Pro Max, 15 Pro Max):
- Resolution: 1290 x 2796 pixels
- Count: 3-10 screenshots

**5.5" Display** (iPhone 8 Plus):
- Resolution: 1242 x 2208 pixels
- Count: 3-10 screenshots

**Recommendation**: Use tools like [Figma](https://figma.com) или [Shotbot](https://shotbot.io) для красивых screenshots.

**Screenshots should show**:
1. Onboarding / welcome screen
2. Upload photo flow
3. Gallery view (approved photos)
4. Moderation status (pending/approved)
5. Child profile management

### 8.3. App Preview Video (Optional)
- Duration: 15-30 seconds
- Resolution: 1080p или 4K
- Show: Key features (upload, moderation, gallery)
- **Tip**: Use screen recording + voiceover

### 8.4. Privacy Nutrition Label
Navigate: **App Privacy**

**Required**: Fill out questionnaire about data collection

**Data Collected**:
- Contact Info: Email address, Name
- User Content: Photos, Videos
- Identifiers: User ID
- Usage Data: Product Interaction

**Data Linked to User**: Yes

**Data Used for Tracking**: No (мы не используем для advertising)

**For each data type, specify**:
- Purpose: App Functionality, Analytics
- Linked to User: Yes

**Important**: Accurate privacy label критичен, ошибки → app rejection.

---

## 9. CI/CD Integration (GitHub Actions)

### 9.1. GitHub Secrets Setup
Store sensitive credentials в GitHub repository secrets:

1. Navigate: GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add secrets:
   - `EXPO_TOKEN`: Expo access token (generate: https://expo.dev/settings/access-tokens)
   - `APPLE_ID`: Apple ID email
   - `APPLE_APP_SPECIFIC_PASSWORD`: App-specific password (см. выше)
   - `APPLE_TEAM_ID`: Team ID (10-character ID)
   - `ASC_KEY_ID`: App Store Connect API Key ID (опционально, recommended)
   - `ASC_ISSUER_ID`: App Store Connect Issuer ID
   - `ASC_PRIVATE_KEY`: App Store Connect API private key (.p8 content, base64-encoded)

**⚠️ НИКОГДА НЕ COMMIT секреты в Git!**

### 9.2. GitHub Actions Workflow (пример)
```yaml
# .github/workflows/eas-build-ios.yml
name: EAS Build & Submit (iOS)

on:
  push:
    branches: [main, release/**]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: npm install
      
      - name: Build iOS app
        run: eas build --platform ios --profile production --non-interactive --no-wait
      
      - name: Submit to TestFlight (optional)
        run: eas submit --platform ios --profile production --non-interactive
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
```

**Примечание**: Подробнее см. `docs/infra/ci_cd.md`

---

## 10. Troubleshooting

### 10.1. Build Failures

**Issue**: Build fails с "No matching provisioning profile"
- **Solution**: Regenerate provisioning profile в App Store Connect, убедись Bundle ID matches

**Issue**: Certificate expired
- **Solution**: Create new certificate, update profiles

**Issue**: Xcode version mismatch
- **Solution**: Update EAS build config `ios.image: "latest"` в `eas.json`

### 10.2. TestFlight Issues

**Issue**: Build stuck "Processing" for hours
- **Normal**: Processing может занять 30-60 min (иногда больше)
- **Solution**: Wait, или contact Apple Developer Support если > 24 hours

**Issue**: Build rejected в Beta App Review
- **Common reasons**: Missing privacy descriptions, export compliance не заполнен, crash on launch
- **Solution**: Read rejection email, fix issue, re-submit

### 10.3. App Store Connect Issues

**Issue**: Cannot add external testers
- **Solution**: Build должен пройти Beta App Review сначала

**Issue**: Public link not working
- **Solution**: Check build status, убедись external testing enabled

---

## 11. Best Practices

### 11.1. Versioning
- **Version**: Semantic versioning (`1.0.0`, `1.1.0`, etc.)
- **Build Number**: Increment for each build (`1`, `2`, `3`, ...)
- **Automate**: Use EAS auto-increment (config в `eas.json`)

### 11.2. Testing
- **Internal testing**: Team + family (100 users)
- **External testing**: Pilot users (1000+ users)
- **Staged rollout**: TestFlight → Limited App Store release → Full rollout

### 11.3. Security
- **Secrets**: Use GitHub Secrets, AWS Secrets Manager, или HashiCorp Vault
- **Certificates**: Store .p12 files securely, encrypted backups
- **API Keys**: Rotate regularly (quarterly)

### 11.4. Monitoring
- **Crashes**: Use Expo Crash Reporting или Sentry
- **Analytics**: Track TestFlight adoption, crash-free rate
- **Feedback**: Monitor TestFlight feedback, respond quickly

---

## 12. Resources

### Official Documentation
- **Expo EAS Build**: https://docs.expo.dev/build/introduction/
- **Expo EAS Submit**: https://docs.expo.dev/submit/introduction/
- **Apple Developer**: https://developer.apple.com/documentation/
- **App Store Connect**: https://help.apple.com/app-store-connect/

### Tools
- **fastlane**: https://fastlane.tools/
- **EAS CLI**: https://github.com/expo/eas-cli

### Community
- **Expo Discord**: https://chat.expo.dev/
- **Expo Forums**: https://forums.expo.dev/

---

## 13. Контакты

- **iOS Lead**: [FOUNDERS_EMAIL]
- **DevOps**: [FOUNDERS_EMAIL]
- **Support**: [FOUNDERS_EMAIL]

---

**DISCLAIMER**: Этот документ — черновик инструкций для внутреннего использования. Все placeholders ([FOUNDERS_EMAIL], Bundle IDs, etc.) должны быть заменены актуальными данными. Не содержит реальных секретов или credentials.
