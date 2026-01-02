# TestFlight инструкции для Rork-Kiku iOS App

## Обзор

Этот документ содержит подробные инструкции по подготовке iOS приложения Rork-Kiku для TestFlight beta testing.

**Важно:** Apple Developer Program доступ временно отсутствует у команды. Этот документ описывает процесс для владельца репозитория или когда доступ будет предоставлен.

---

## Prerequis ites

### 1. Apple Developer Account
- **Требуется:** Apple Developer Program membership ($99/year)
- **Type:** Individual или Organization account
- **Status:** [PLACEHOLDER - владелец должен зарегистрироваться или предоставить доступ]

**Регистрация:** developer.apple.com/programs

### 2. App Store Connect Access
- Доступ к App Store Connect (appstoreconnect.apple.com)
- Role: Account Holder, Admin или App Manager (minimum)

### 3. Development Environment
- macOS (latest или recent version)
- Xcode (latest stable) — скачать из Mac App Store
- Command Line Tools: `xcode-select --install`
- Node.js & npm (для React Native)
- CocoaPods: `sudo gem install cocoapods`

### 4. Project Setup
- React Native/Expo project configured
- Bundle ID определён (e.g., `com.rork-kiku.app`)
- App icons, splash screens готовы

---

## Шаг 1: Создание App ID

### 1.1 В Apple Developer Portal

1. Перейти на developer.apple.com → Certificates, Identifiers & Profiles
2. Identifiers → ➕ (Add)
3. Выбрать **App IDs** → Continue
4. Type: **App**
5. Description: "Rork-Kiku iOS App"
6. Bundle ID: **Explicit** → `com.rork-kiku.app` (или ваш выбор)
7. Capabilities (выбрать нужные):
   - ✅ Push Notifications
   - ✅ Sign In with Apple (если будем использовать)
   - ✅ Associated Domains (если нужны deep links)
8. Register

### 1.2 Обновление в проекте

**Для React Native/Expo:**
```javascript
// app.json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.rork-kiku.app",
      "buildNumber": "1",
      "supportsTablet": false
    }
  }
}
```

**Для нативного проекта:**
- Открыть `ios/RorkKiku.xcodeproj` в Xcode
- Target → General → Bundle Identifier: `com.rork-kiku.app`

---

## Шаг 2: Certificates и Provisioning Profiles

### 2.1 Создание iOS Distribution Certificate

**Метод 1: Через Xcode (рекомендуется)**
1. Открыть Xcode → Preferences → Accounts
2. Добавить Apple ID (Account Holder/Admin)
3. Team → Manage Certificates → ➕ → iOS Distribution
4. Certificate автоматически создаётся и скачивается

**Метод 2: Manually через Developer Portal**
1. Certificates → ➕
2. iOS Distribution (App Store and Ad Hoc)
3. Create Certificate Signing Request (CSR):
   - Mac: Keychain Access → Certificate Assistant → Request a Certificate from a CA
   - Save CSR file
4. Upload CSR → Download certificate
5. Double-click .cer file → adds к Keychain

### 2.2 Создание Provisioning Profile (App Store)

1. Developer Portal → Profiles → ➕
2. Distribution → **App Store**
3. App ID: выбрать `com.rork-kiku.app`
4. Certificate: выбрать созданный distribution certificate
5. Profile Name: "Rork-Kiku App Store Profile"
6. Generate → Download
7. Double-click .mobileprovision file (adds к Xcode)

---

## Шаг 3: Настройка App Store Connect

### 3.1 Создание нового App

1. Перейти на appstoreconnect.apple.com
2. My Apps → ➕ → New App
3. Platforms: **iOS**
4. Name: **Rork-Kiku**
5. Primary Language: **Russian** (или English)
6. Bundle ID: выбрать `com.rork-kiku.app`
7. SKU: `RORK-KIKU-001` (unique identifier)
8. User Access: Full Access (or Limited)
9. Create

### 3.2 App Information

**General Information:**
- App Name: Rork-Kiku
- Subtitle (optional): "Безопасная социальная сеть для детей"
- Category: Primary — Social Networking, Secondary — Education (или другое)

**App Privacy:**
- Privacy Policy URL: `https://rork-kiku.com/privacy` — PLACEHOLDER (must be accessible)
- User Privacy Choices URL: (optional)

**Age Rating:**
- ⚠️ **Критично для детского приложения**
- Rate Your App:
  - Made for Kids: **Yes** (или "No" если 6-12 + parents)
  - Unrestricted Web Access: **No**
  - User Generated Content: **Yes** (но модерируется)
  - ...complete questionnaire carefully
- Expected Rating: **4+** или **9+** (зависит от ответов)

**App Review Information:**
- Contact: [EMAIL] — PLACEHOLDER
- Phone: [PHONE] — PLACEHOLDER
- Demo Account:
  - Username: demo_parent@rork-kiku.com — PLACEHOLDER
  - Password: [DEMO_PASSWORD] — PLACEHOLDER
- Notes: "Это детское приложение с родительским контролем. Пожалуйста, используйте demo account для тестирования. Мы compliant с COPPA."

---

## Шаг 4: Сборка приложения

### 4.1 Для React Native (без Expo)

**Обновить version и build number:**
```bash
# ios/RorkKiku/Info.plist
# CFBundleShortVersionString → 1.0.0
# CFBundleVersion → 1
```

**Clean и Build:**
```bash
cd ios
pod install
cd ..

# Archive
xcodebuild archive \
  -workspace ios/RorkKiku.xcworkspace \
  -scheme RorkKiku \
  -configuration Release \
  -archivePath ./build/RorkKiku.xcarchive
```

**Export для App Store:**
```bash
xcodebuild -exportArchive \
  -archivePath ./build/RorkKiku.xcarchive \
  -exportPath ./build \
  -exportOptionsPlist ios/ExportOptions.plist
```

**ExportOptions.plist:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>[YOUR_TEAM_ID]</string>
    <key>uploadSymbols</key>
    <true/>
    <key>uploadBitcode</key>
    <false/>
</dict>
</plist>
```

### 4.2 Для Expo

**Build с EAS (Expo Application Services):**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build для iOS
eas build --platform ios --profile production
```

**eas.json (уже в проекте):**
```json
{
  "build": {
    "production": {
      "ios": {
        "buildType": "store",
        "autoIncrement": true
      }
    }
  }
}
```

EAS автоматически:
- Создаст archive
- Подпишет с правильным provisioning profile
- Upload к App Store Connect (если configured)

### 4.3 Используя fastlane (рекомендуется для CI/CD)

**Setup:**
```bash
# Install fastlane
sudo gem install fastlane

# Initialize
cd ios
fastlane init
```

**Fastfile:**
```ruby
default_platform(:ios)

platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    # Increment build number
    increment_build_number(xcodeproj: "RorkKiku.xcodeproj")
    
    # Build
    build_app(
      workspace: "RorkKiku.xcworkspace",
      scheme: "RorkKiku",
      export_method: "app-store",
      configuration: "Release"
    )
    
    # Upload to TestFlight
    upload_to_testflight(
      skip_waiting_for_build_processing: true,
      username: "[APPLE_ID]",  # PLACEHOLDER
      app_identifier: "com.rork-kiku.app"
    )
    
    # Notify (optional)
    slack(message: "New build uploaded to TestFlight!")
  end
end
```

**Run:**
```bash
fastlane beta
```

---

## Шаг 5: Upload к App Store Connect

### 5.1 Используя Xcode

1. Open Xcode
2. Window → Organizer
3. Archives → выбрать latest build
4. **Distribute App**
5. Method: **App Store Connect**
6. Destination: **Upload**
7. App Store Connect Distribution Options:
   - ✅ Upload symbols (для crash reports)
   - ❌ Bitcode (deprecated)
8. Automatically manage signing: **Yes** (или выбрать manual)
9. Review → **Upload**
10. Wait (может занять 10-30 минут для processing)

### 5.2 Используя Transporter App

1. Скачать Transporter из Mac App Store
2. Sign in с Apple ID
3. Drag & drop .ipa file
4. Deliver

### 5.3 Используя command line (altool)

```bash
xcrun altool --upload-app \
  --type ios \
  --file ./build/RorkKiku.ipa \
  --username "[APPLE_ID]" \
  --password "[APP_SPECIFIC_PASSWORD]"
```

**App-Specific Password:**
- appleid.apple.com → Security → Generate App-Specific Password

---

## Шаг 6: TestFlight Setup

### 6.1 После Upload Processing Complete

1. App Store Connect → My Apps → Rork-Kiku
2. TestFlight tab
3. Build появится под "iOS Builds" (после processing, 10-30 мин)

### 6.2 Export Compliance

**Если приложение использует encryption (HTTPS = Yes):**
- Build → Missing Compliance
- Click → Provide Export Compliance Information
- Questions:
  - Does your app use encryption? **Yes** (HTTPS counts)
  - Does your app qualify for exemption? **Yes** (стандартный HTTPS exemption)
  - Standard encryption? **Yes**
- Submit

### 6.3 What to Test (Beta App Description)

**Test Instructions для testers:**

```
Добро пожаловать в Rork-Kiku beta!

Мы просим вас протестировать:
1. Регистрация родительского аккаунта
2. Создание профиля ребёнка
3. Отправка сообщений друзьям
4. Загрузка фото
5. Родительский dashboard

Пожалуйста, report любые bugs или feedback через TestFlight или email: beta@rork-kiku.com

Спасибо за помощь в улучшении Rork-Kiku!
```

### 6.4 Добавление Internal Testers

**Internal Testing (до 100 users):**
1. TestFlight → Internal Testing
2. ➕ Add Internal Testers
3. Enter emails (Apple IDs)
4. Select build → Notify Testers

**Testers получат:**
- Email с invitation link
- Инструкция скачать TestFlight app
- Redeem code

### 6.5 External Testing (Pilot)

**External Testing (до 10,000 users):**
1. TestFlight → External Testing → ➕ Create New Group
2. Group Name: "Pilot Group"
3. Add Build
4. Add Testers:
   - Manually (email list)
   - Public Link (generate link для sharing)
5. **Beta App Review Required** (first time):
   - Submit for Review
   - Apple reviews в течение 24-48 часов
   - После approval, testers получают access

**Public Link:**
- Generates URL: `https://testflight.apple.com/join/[CODE]`
- Можно share широко (до limit 10K)

---

## Шаг 7: Metadata для TestFlight

### 7.1 Test Information

**What to Test:**
```
В этой beta версии, пожалуйста, протестируйте:

1. Onboarding:
   - Регистрация родительского аккаунта
   - Email verification
   - Parental consent flow
   - Создание первого child profile

2. Core Features:
   - Добавление друзей (QR code, search)
   - Отправка текстовых сообщений
   - Загрузка фото
   - Likes и comments

3. Parental Controls:
   - Parent dashboard
   - Activity view
   - Time limits
   - Moderation settings

4. Safety:
   - Content moderation (попробуйте отправить неподобающее — должно быть заблокировано)
   - Reporting mechanism

Известные issues:
- [List any known bugs]

Если найдёте bug, пожалуйста:
- Screenshot
- Description шагов для reproduce
- Device model и iOS version
- Email: beta@rork-kiku.com
```

### 7.2 App Privacy (TestFlight Disclosure)

**Data Collection:**
- Contact Info: Email Address (parent)
- User Content: Photos, Messages
- Identifiers: User ID
- Usage Data: App interactions

**Linked to User:** Yes  
**Used for Tracking:** No

---

## Шаг 8: Мониторинг Beta Testing

### 8.1 Metrics в TestFlight

App Store Connect → TestFlight → Metrics:
- **Installs:** Сколько установили
- **Sessions:** Сколько запусков
- **Crashes:** Crash rate (должен быть < 1%)
- **Feedback:** Comments от testers

### 8.2 Crash Reports

1. Xcode → Window → Organizer → Crashes
2. View crash logs с symbolication
3. Fix bugs
4. Upload new build

### 8.3 Feedback Collection

**In-App Feedback (TestFlight):**
- Testers can screenshot + annotate
- Feedback appears в App Store Connect

**External Feedback:**
- Email: beta@rork-kiku.com
- Survey (Google Forms, Typeform)
- User interviews

---

## Шаг 9: Iterating (Uploading New Builds)

**Process:**
1. Fix bugs / add features
2. Increment build number (not version для beta)
   - Version: 1.0.0 (same)
   - Build: 2, 3, 4... (increment)
3. Build & Upload (repeat Steps 4-5)
4. App Store Connect → TestFlight → Build available (after processing)
5. Internal testers: auto-notified если enabled
6. External testers: manually notify (or auto if configured)

**Best Practices:**
- Release notes для каждого build (что изменилось)
- Test internally first, затем push к external
- Monitor crashes перед next build

---

## Шаг 10: Подготовка к Production Release

После успешного beta testing:

1. **Finalize App Store Listing:**
   - Screenshots (6.5", 6.7", 5.5" required)
   - App Preview videos (optional, но recommended)
   - Description (4000 chars max)
   - Keywords (100 chars max, comma-separated)
   - Promotional Text (170 chars)
   - Marketing URL: `https://rork-kiku.com` — PLACEHOLDER

2. **App Store Review Information:**
   - Comprehensive demo account
   - Notes for reviewer:
     ```
     Rork-Kiku — это безопасная социальная платформа для детей 6-12 лет.
     
     COPPA Compliance:
     - Требуется parental consent перед созданием child profile
     - Все данные детей protected
     - Robust content moderation
     
     Для тестирования, пожалуйста:
     1. Login как parent (demo_parent@...)
     2. Child profiles уже созданы
     3. Попробуйте messaging, photo upload
     4. Parent dashboard shows activity
     
     Если нужна дополнительная информация, please contact: [PHONE/EMAIL]
     ```

3. **Submit for Review:**
   - App Store Connect → Version 1.0.0 → Submit for Review
   - Review process: 24-48 hours (typically)
   - May receive questions от reviewer — respond promptly

4. **Release:**
   - После approval, можно release immediately или schedule

---

## Troubleshooting

### Issue: "Missing Compliance" Warning
**Solution:** Provide Export Compliance info (Step 6.2)

### Issue: Build Processing Failed
**Causes:**
- Invalid provisioning profile
- Entitlements mismatch
- Binary contains invalid files
**Solution:** Check email от Apple, fix issue, re-upload

### Issue: Testflight Build не появляется
**Wait:** Processing can take 30-60 мин (rarely longer)
**Check:** Email для errors

### Issue: Crashes при запуске на TestFlight
**Causes:**
- Release build не tested locally
- Missing resources (images, fonts)
- Crash в initialization code
**Solution:** 
- Test release build locally: `npx react-native run-ios --configuration Release`
- Check Xcode crash logs

### Issue: "App Clip не supported" error
**Solution:** Remove App Clip target если not using

---

## Security Best Practices

### Credentials Management

**НИКОГДА не commit в git:**
- ❌ Certificates (.p12, .cer)
- ❌ Provisioning profiles
- ❌ API keys
- ❌ Passwords

**Варианты хранения:**
1. **Local only** (на Mac)
2. **GitHub Secrets** (для CI/CD)
3. **Apple Developer Portal** (certificates можно re-download)

### Безопасная загрузка (если владелец загружает manually)

**Scenario:** Владелец репозитория хочет загрузить build без предоставления full Apple Developer access.

**Option 1: Предоставить role "App Manager"**
- App Store Connect → Users and Access → ➕
- Role: App Manager (can upload builds, но не full admin)
- Invite team member

**Option 2: Владелец загружает сам**
- Team предоставляет .ipa file (securely)
- Владелец upload через Transporter или Xcode
- **Риск:** Владелец не может verify что внутри .ipa (trust required)

**Option 3: CI/CD с GitHub Actions (рекомендуется)**
- Automated build & upload
- Credentials в GitHub Secrets
- Владелец reviews code в PRs
- См. `docs/infra/ci_cd.md` для деталей

---

## Checklist перед первым TestFlight Release

- [ ] Apple Developer Account active ($99 paid)
- [ ] App ID created (`com.rork-kiku.app`)
- [ ] Distribution certificate created
- [ ] Provisioning profile created
- [ ] App created в App Store Connect
- [ ] Privacy Policy URL accessible
- [ ] Age Rating completed
- [ ] Build compiled успешно (release configuration)
- [ ] Build uploaded к App Store Connect
- [ ] Export compliance information provided
- [ ] Test Instructions written
- [ ] Internal testers added
- [ ] Beta testing plan готов (см. `docs/pilot/pilot_plan.md`)

---

## Дополнительные ресурсы

**Apple Documentation:**
- TestFlight Guide: developer.apple.com/testflight
- App Store Connect Help: help.apple.com/app-store-connect
- COPPA Guidance: developer.apple.com/app-store/kids-apps/

**React Native:**
- Publishing Guide: reactnative.dev/docs/publishing-to-app-store

**Expo:**
- EAS Build: docs.expo.dev/build/introduction

**fastlane:**
- iOS Documentation: docs.fastlane.tools/getting-started/ios

---

## Контакт для вопросов

Если у владельца репозитория или команды вопросы по process:
- Email: [FOUNDERS_EMAIL] — PLACEHOLDER
- Slack/Discord: [CHANNEL] — PLACEHOLDER

Если застряли на Apple review:
- Apple Developer Support: developer.apple.com/contact

---

**Последнее обновление:** [DATE] — PLACEHOLDER  
**Статус:** Ready для использования (когда Apple Developer access предоставлен)
