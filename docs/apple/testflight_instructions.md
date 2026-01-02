# Инструкции по TestFlight: Rork-Kiku iOS

## Обзор

Данный документ содержит подробные инструкции по подготовке iOS приложения и загрузке в TestFlight для pilot testing.

**Целевая аудитория:** Основатели, iOS разработчики, DevOps инженеры

**Предварительные требования:**
- Аккаунт Apple Developer (Individual или Organization, $99/year)
- Xcode установлен (latest stable version)
- macOS (для building iOS apps)
- Доступ к GitHub repository

---

## 1. Apple Developer Setup

### 1.1 Создание Apple Developer Account

**Если ещё нет аккаунта:**
1. Перейти на https://developer.apple.com
2. Кликнуть "Account" → "Join the Apple Developer Program"
3. Выбрать Individual или Organization:
   - **Individual:** быстрее, но owner = конкретное физлицо
   - **Organization:** требует D-U-N-S Number, юридические документы (рекомендуется для компании)
4. Оплатить $99/year
5. Ожидать approval (обычно 24-48 часов)

**Для Organization enrollment:**
- Потребуется D-U-N-S Number (можно получить бесплатно на dnb.com)
- Юридические документы компании
- Может занять 1-2 недели

### 1.2 App Store Connect Access

**После approval Apple Developer account:**
1. Перейти на https://appstoreconnect.apple.com
2. Войти с Apple ID
3. Убедиться, что имеете role "Admin" или "App Manager"

**Если в команде несколько человек:**
- Можно добавить team members в App Store Connect
- Roles: Admin, App Manager, Developer, Marketing, Sales
- Для TestFlight uploads нужна role: App Manager или Developer

---

## 2. App Identifiers & Bundle ID

### 2.1 Создание App ID

1. Перейти на https://developer.apple.com/account
2. Certificates, Identifiers & Profiles → Identifiers → "+"
3. Выбрать "App IDs" → Continue
4. Type: App
5. Description: "Rork-Kiku iOS App"
6. Bundle ID: **com.rorkkiku.app** (или ваш домен)
   - Explicit App ID (не wildcard)
   - Формат: reverse-domain notation
7. Capabilities (выбрать необходимые):
   - ✅ Push Notifications
   - ✅ Sign in with Apple (если используете)
   - ✅ iCloud (если используете для sync)
   - ✅ App Groups (если нужно sharing между targets)
8. Continue → Register

**Bundle ID критично важен:**
- Должен совпадать с Bundle ID в Xcode project
- Нельзя изменить после первой публикации
- Будет использоваться для всех provisioning profiles

### 2.2 App ID для extensions (если нужны)

**Если планируете использовать extensions (например, Share Extension):**
- Создать отдельные App IDs для каждого extension
- Bundle ID format: `com.rorkkiku.app.shareextension`
- Связать с App Groups для sharing data

---

## 3. Provisioning Profiles & Certificates

### 3.1 Certificates

**Типы certificates:**
- **Development Certificate:** для local testing на devices
- **Distribution Certificate:** для TestFlight и App Store

**Создание Distribution Certificate:**

1. На Mac: открыть Keychain Access
2. Keychain Access → Certificate Assistant → Request a Certificate From a Certificate Authority
3. Email: ваш Apple ID email
4. Common Name: "Rork-Kiku Distribution"
5. Saved to disk
6. Сгенерируется файл `CertificateSigningRequest.certSigningRequest`

7. На developer.apple.com: Certificates → "+"
8. Выбрать "Apple Distribution" (для App Store and TestFlight)
9. Upload CSR file
10. Download сертификат (.cer file)
11. Double-click для install в Keychain
12. Export как .p12 file (для CI/CD):
    - Keychain Access → My Certificates → Right-click на certificate → Export
    - Сохранить с паролем

**ВАЖНО:** Private key (.p12 file) и пароль — **SECRETS**. Хранить в secure location:
- GitHub Secrets (для CI/CD)
- 1Password, LastPass (для team sharing)
- НЕ коммитить в git

### 3.2 Provisioning Profiles

**Создание Distribution Provisioning Profile:**

1. developer.apple.com → Profiles → "+"
2. Distribution → App Store Connect (для TestFlight + App Store)
3. Выбрать App ID: `com.rorkkiku.app`
4. Выбрать Distribution Certificate (созданный выше)
5. Profile Name: "Rork-Kiku App Store Profile"
6. Download `.mobileprovision` file
7. Double-click для install в Xcode

**Для CI/CD:**
- Provisioning Profile также нужно хранить как secret
- Можно использовать fastlane match для автоматизации

---

## 4. Xcode Project Configuration

### 4.1 Bundle Identifier

**В Xcode:**
1. Открыть project в Xcode
2. Выбрать target "RorkKiku" (или ваше имя)
3. General tab → Identity
4. Bundle Identifier: **com.rorkkiku.app** (должен совпадать с App ID)

### 4.2 Signing & Capabilities

1. Signing & Capabilities tab
2. Signing: **Automatically manage signing** (unchecked для manual control)
3. Team: выбрать ваш Apple Developer team
4. Provisioning Profile: выбрать "Rork-Kiku App Store Profile"
5. Signing Certificate: "Apple Distribution"

**Capabilities (добавить необходимые):**
- Push Notifications
- Sign in with Apple (если используете)
- Background Modes: Remote notifications (для push)

### 4.3 Version & Build Numbers

**В Xcode General tab:**
- **Version:** 1.0.0 (semantic versioning: MAJOR.MINOR.PATCH)
- **Build:** 1 (incrementing number, должен быть unique для каждого upload)

**Правила:**
- Version для major releases (1.0.0 → 2.0.0)
- Build number increment для каждого upload (1, 2, 3...)
- TestFlight позволяет несколько builds для одной version

**Автоматизация versioning:**
- Можно использовать fastlane для auto-increment build numbers
- Или scripts в Xcode build phase

### 4.4 Info.plist Configuration

**Ключевые поля в Info.plist:**

```xml
<key>CFBundleDisplayName</key>
<string>Rork-Kiku</string>

<key>CFBundleShortVersionString</key>
<string>1.0.0</string>

<key>CFBundleVersion</key>
<string>1</string>

<!-- Privacy descriptions (обязательно!) -->
<key>NSCameraUsageDescription</key>
<string>Используется для съёмки фото и видео для отправки родителям</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Для выбора фото из галереи</string>

<key>NSMicrophoneUsageDescription</key>
<string>Для записи голосовых сообщений</string>

<!-- Push notifications -->
<key>UIBackgroundModes</key>
<array>
    <string>remote-notification</string>
</array>
```

**КРИТИЧНО:** Все privacy usage descriptions обязательны при submission. Apple reject без них.

---

## 5. Building the App

### 5.1 Archive Build

**В Xcode:**
1. Product → Scheme → выбрать "RorkKiku" (Release configuration)
2. Product → Destination → "Any iOS Device (arm64)"
3. Product → Clean Build Folder (⇧⌘K)
4. Product → Archive (⌘⇧A)
5. Ожидать завершения build (может занять несколько минут)
6. Откроется Organizer window с list of archives

**Troubleshooting build errors:**
- Code signing errors: проверить certificates и provisioning profiles
- Missing dependencies: `pod install` или `swift package resolve`
- Compilation errors: fix code issues

### 5.2 Validating Archive

**В Organizer:**
1. Выбрать latest archive
2. Кликнуть "Validate App"
3. Выбрать Distribution method: "App Store Connect"
4. Signing options: "Automatically manage signing" или Manual (выбрать profile)
5. Кликнуть "Validate"
6. Ожидать validation (проверяет icons, info.plist, certificates)

**Если validation проходит:**
- ✅ Готово к upload

**Если errors:**
- Прочитать error messages и fix issues
- Часто: missing icons, invalid info.plist, code signing issues

---

## 6. Uploading to App Store Connect

### 6.1 Manual Upload через Xcode

**В Organizer:**
1. Выбрать validated archive
2. Кликнуть "Distribute App"
3. Distribution method: "App Store Connect"
4. Upload или Export (выбрать Upload)
5. Signing: Automatically или Manual
6. Кликнуть "Upload"
7. Ожидать upload (зависит от размера app, обычно 5-15 min)

**После upload:**
- Xcode покажет success message
- Build появится в App Store Connect через 5-10 минут (processing time)

### 6.2 Check Build Status в App Store Connect

1. Перейти на https://appstoreconnect.apple.com
2. My Apps → Rork-Kiku (или создать новую app, если first time)
3. TestFlight tab
4. iOS builds section
5. Увидите uploaded build со статусом "Processing"

**Processing может занять:**
- 10-30 минут (обычно)
- До 2 часов (в редких случаях)

**После processing:**
- Статус изменится на "Ready to Submit" или "Missing Compliance"

---

## 7. Export Compliance

### 7.1 Encryption Declaration

**Apple требует declaration об использовании encryption:**

**Если app использует HTTPS (да для Rork-Kiku):**
1. В App Store Connect → TestFlight → Build
2. Кликнуть на build → Export Compliance
3. Вопрос: "Does your app use encryption?"
   - Ответ: **Yes**
4. "Does your app use encryption other than what's provided by Apple?"
   - Если только HTTPS (standard iOS encryption): **No**
   - Если custom encryption: **Yes** (требует export documentation)

**Для Rork-Kiku (standard HTTPS):**
- Ответить "No" на второй вопрос
- Automatic approval

**Автоматизация:**
- Можно добавить в Info.plist:
```xml
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```
- Тогда вопрос не будет задаваться каждый раз

### 7.2 Compliance Documentation

**Если используете custom encryption:**
- Может потребоваться US export compliance documentation
- Обратиться к юристу или compliance expert
- Вне scope для MVP

---

## 8. TestFlight Configuration

### 8.1 Creating App в App Store Connect (First Time Only)

**Если ещё не создали app:**
1. App Store Connect → My Apps → "+"
2. New App
3. Platforms: iOS
4. Name: "Rork-Kiku"
5. Primary Language: Russian (или English)
6. Bundle ID: выбрать `com.rorkkiku.app`
7. SKU: `rork-kiku-ios` (unique identifier, не показывается пользователям)
8. User Access: Full Access (default)
9. Create

### 8.2 App Information

**В App Store Connect → App Information:**

**Локализация (Russian):**
- Name: Rork-Kiku
- Subtitle: Безопасная коммуникация для семей
- Privacy Policy URL: https://rorkkiku.com/privacy (placeholder, заменить на реальный)

**Категории:**
- Primary Category: Social Networking (или Lifestyle)
- Secondary Category: Education (опционально)

**Age Rating:**
- Запустить Age Rating questionnaire
- Отметить: Frequent/Intense:
  - None для violent content, sexual content, etc.
  - Это app для детей, должен быть 4+
- Apple может review и изменить rating

**Итоговый Age Rating:** 4+ (рекомендуется)

### 8.3 TestFlight Metadata

**TestFlight → App Information:**

**Beta App Description:**
```
Rork-Kiku — это безопасная платформа для обмена фото и видео между родителями и детьми.

Основные возможности:
- Отправка фото/видео детьми родителям с автоматической модерацией
- Родительская панель управления
- Безопасный образовательный контент
- Полный контроль родителей

Это pilot версия для тестирования. Ваш feedback поможет улучшить продукт!
```

**Beta App Review Information:**
- Контактная информация для Apple review team
- Email: [TESTFLIGHT_CONTACT_EMAIL]
- Phone: [PHONE_NUMBER]
- Notes: "Для тестирования нужны два устройства: одно для родителя, одно для ребёнка. Можно использовать demo accounts."

**Demo Accounts (обязательно для review!):**
- Parent account:
  - Email: `parent.demo@rorkkiku.com`
  - Password: [DEMO_PASSWORD]
- Child profile: уже создан и связан

**Test Information:**
- Sign-in required: Yes
- Notes: Приложение требует аккаунта для использования. Demo accounts предоставлены выше.

### 8.4 Privacy Practices Disclosure

**В TestFlight → Privacy tab:**

**Apple требует disclosure о privacy practices (iOS 14+):**

1. Data Collection:
   - **Collected:** Name, Email, Photos, Videos, Usage Data
   - **Purpose:** App Functionality, Analytics, Product Personalization
   - **Linked to User:** Yes (для большинства данных)
   - **Used for Tracking:** No

2. Contact Info:
   - **Email Address:** ✅ Collected
   - Purpose: App Functionality (account creation)
   - Linked to User: Yes

3. User Content:
   - **Photos and Videos:** ✅ Collected
   - Purpose: App Functionality (media sharing)
   - Linked to User: Yes

4. Usage Data:
   - **Product Interaction:** ✅ Collected
   - Purpose: Analytics
   - Linked to User: Yes

**Важно:** Disclosure должна совпадать с вашей Privacy Policy.

---

## 9. Internal Testing (первый этап)

### 9.1 Adding Internal Testers

**TestFlight → Internal Testing → "+" Group:**
1. Group Name: "Core Team"
2. Добавить team members (до 100 internal testers)
   - Email addresses team members
   - Они должны иметь role в App Store Connect: Admin, App Manager, Developer, Marketing, или Sales
3. Automatic Distribution: включить (новые builds автоматически)
4. Save

**После добавления:**
- Testers получат email приглашение с ссылкой на TestFlight

### 9.2 Installing TestFlight App

**Инструкции для testers:**
1. Download TestFlight app из App Store (бесплатно)
2. Открыть email приглашение
3. Tap "View in TestFlight" или "Start Testing"
4. Открывается TestFlight app
5. Accept приглашение
6. Tap "Install" для download app
7. После install: открыть app и начать тестирование

**Internal testing:**
- Немедленный доступ (no approval delay)
- До 100 internal testers
- До 90 дней testing (продлевается автоматически)

### 9.3 Collecting Feedback

**TestFlight встроенный feedback:**
- Testers могут делать screenshots в app
- Annotate screenshots и send feedback
- Feedback появляется в App Store Connect → TestFlight → Feedback

**Дополнительные каналы:**
- Internal Slack channel для bug reports
- Google Form для structured feedback
- 1-on-1 интервью с key testers

---

## 10. External Testing (pilot с пользователями)

### 10.1 Beta App Review

**Перед добавлением external testers, Apple review требуется:**

1. TestFlight → External Testing → "+" Group
2. Group Name: "Pilot Users"
3. Enable Automatic Distribution (опционально)
4. Select Build для testing
5. Add External Testers (до 10,000 emails)
6. Submit for Review

**Apple review checklist:**
- App работает без crashes
- Все features functional
- Demo accounts working
- Compliance with App Store guidelines

**Review time:**
- Обычно 24-48 hours
- Может занять до 5 дней
- Если rejected: fix issues и resubmit

### 10.2 Adding External Testers

**После approval:**

**Метод 1: Email приглашения**
1. TestFlight → External Testing → Group
2. Add Testers: ввести email addresses (можно массовый import CSV)
3. Testers получают email invitation

**Метод 2: Public Link**
1. TestFlight → External Testing → Group → Public Link
2. Enable Public Link
3. Copy link
4. Поделиться link с testers (email, website, social media)
5. Testers открывают link → install TestFlight → join beta

**Limits:**
- До 10,000 external testers
- До 90 дней testing per build
- После 90 дней: upload новый build

### 10.3 Managing Testers

**В TestFlight:**
- View tester status (invited, installed, active)
- Resend invitations
- Remove testers
- View sessions и crashes per tester

**Communication с testers:**
- "What to Test" notes при каждом build:
  ```
  Version 1.0.0 (Build 5):
  - Новая функция: голосовые сообщения
  - Улучшена производительность модерации
  - Исправлены баги с push notifications
  
  Пожалуйста, протестируйте:
  - Отправку голосовых сообщений
  - Получение push notifications
  ```

---

## 11. Fastlane Automation

### 11.1 Fastlane Setup

**Fastlane — это инструмент для автоматизации iOS builds и uploads.**

**Installation:**
```bash
sudo gem install fastlane -NV
# Или через Homebrew:
brew install fastlane
```

**Initialize Fastlane:**
```bash
cd /path/to/ios/project
fastlane init
```

**Выбрать:** "Automate beta distribution to TestFlight"

**Fastlane создаст:**
- `fastlane/` directory
- `Fastfile` (configuration)
- `Appfile` (app identifiers)

### 11.2 Fastfile Configuration

**Пример Fastfile для TestFlight:**

```ruby
default_platform(:ios)

platform :ios do
  desc "Push a new beta build to TestFlight"
  lane :beta do
    # Increment build number
    increment_build_number(xcodeproj: "RorkKiku.xcodeproj")
    
    # Build app
    build_app(
      scheme: "RorkKiku",
      export_method: "app-store",
      output_directory: "./build",
      clean: true
    )
    
    # Upload to TestFlight
    upload_to_testflight(
      skip_waiting_for_build_processing: true,
      apple_id: "APPLE_ID_FROM_APP_STORE_CONNECT"
    )
    
    # Notify team (опционально)
    slack(
      message: "New build uploaded to TestFlight!",
      success: true
    )
  end
end
```

**Appfile:**
```ruby
app_identifier("com.rorkkiku.app")
apple_id("[YOUR_APPLE_ID_EMAIL]")
team_id("[YOUR_TEAM_ID]")
```

### 11.3 Running Fastlane

**Local:**
```bash
fastlane beta
```

**Fastlane will:**
1. Increment build number
2. Build archive
3. Export IPA
4. Upload to TestFlight

**Credentials:**
- First time: Fastlane попросит Apple ID password
- Можно хранить в Keychain или использовать App-Specific Password

### 11.4 Fastlane Match (для team)

**Fastlane Match — синхронизация certificates и profiles:**

```bash
fastlane match init
```

**Выбрать storage:** git (private repo для хранения certificates)

**Match types:**
- `fastlane match development` — development certificates
- `fastlane match appstore` — distribution certificates

**Benefits:**
- Вся команда использует одни и те же certificates
- No manual certificate management
- Easy onboarding новых разработчиков

**В Fastfile:**
```ruby
lane :beta do
  match(type: "appstore")
  # ... rest of lane
end
```

---

## 12. GitHub Actions CI/CD

### 12.1 Secrets Setup в GitHub

**GitHub Repository → Settings → Secrets → Actions:**

Добавить следующие secrets:

1. **APPLE_ID** — ваш Apple ID email
2. **APPLE_APP_SPECIFIC_PASSWORD** — App-Specific Password (создать на appleid.apple.com)
3. **MATCH_PASSWORD** — пароль для Fastlane Match git repo
4. **MATCH_GIT_URL** — URL private git repo для certificates
5. **P12_PASSWORD** — пароль для certificate .p12 file (если используете manual signing)
6. **CERTIFICATES_P12_BASE64** — base64-encoded .p12 certificate
7. **PROVISIONING_PROFILE_BASE64** — base64-encoded .mobileprovision profile

**Base64 encoding:**
```bash
base64 -i certificate.p12 | pbcopy
base64 -i profile.mobileprovision | pbcopy
```

### 12.2 GitHub Actions Workflow

**Создать `.github/workflows/ios-beta.yml`:**

```yaml
name: iOS Beta Deployment

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: macos-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.0'
          bundler-cache: true
      
      - name: Install Fastlane
        run: |
          gem install fastlane
          
      - name: Setup certificates (если не используете Match)
        env:
          P12_BASE64: ${{ secrets.CERTIFICATES_P12_BASE64 }}
          P12_PASSWORD: ${{ secrets.P12_PASSWORD }}
          PROVISION_BASE64: ${{ secrets.PROVISIONING_PROFILE_BASE64 }}
        run: |
          # Decode certificates
          echo $P12_BASE64 | base64 --decode > certificate.p12
          echo $PROVISION_BASE64 | base64 --decode > profile.mobileprovision
          
          # Create temporary keychain
          security create-keychain -p "" temp.keychain
          security default-keychain -s temp.keychain
          security unlock-keychain -p "" temp.keychain
          security set-keychain-settings temp.keychain
          
          # Import certificate
          security import certificate.p12 -k temp.keychain -P $P12_PASSWORD -T /usr/bin/codesign -A
          security set-key-partition-list -S apple-tool:,apple: -s -k "" temp.keychain
          
          # Install provisioning profile
          mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
          cp profile.mobileprovision ~/Library/MobileDevice/Provisioning\ Profiles/
      
      - name: Build and upload to TestFlight
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
        run: |
          cd ios
          fastlane beta
      
      - name: Cleanup
        if: always()
        run: |
          security delete-keychain temp.keychain
          rm -f certificate.p12 profile.mobileprovision
```

**Этот workflow:**
- Triggers на push to main или manual dispatch
- Setup Ruby и Fastlane
- Decode и install certificates
- Build и upload to TestFlight
- Cleanup secrets после завершения

### 12.3 Triggering Build

**Автоматически:**
- Push to `main` branch → автоматический build и upload

**Вручную:**
- GitHub → Actions → "iOS Beta Deployment" → "Run workflow"

**Notifications:**
- GitHub Actions отправит email при success/failure
- Можно добавить Slack notifications в workflow

---

## 13. Best Practices

### 13.1 Versioning Strategy

**Semantic Versioning:**
- **MAJOR.MINOR.PATCH** (1.0.0)
- MAJOR: breaking changes
- MINOR: new features
- PATCH: bug fixes

**Build Numbers:**
- Increment каждый upload (1, 2, 3...)
- Можно использовать Git commit count: `git rev-list --count HEAD`

**For TestFlight:**
- Version 1.0.0, Build 1 (first upload)
- Version 1.0.0, Build 2 (bug fix)
- Version 1.1.0, Build 3 (new feature)

### 13.2 Release Notes

**"What to Test" в TestFlight:**
- Писать clear release notes для каждого build
- Указывать новые features и bug fixes
- Просить testers фокусироваться на конкретных областях

**Пример:**
```
Version 1.0.0 (Build 10)

Новое:
- Добавлена поддержка голосовых сообщений (до 1 минуты)
- Улучшен UI родительской панели

Исправлено:
- Crash при загрузке больших видео
- Push notifications теперь работают стабильно

Пожалуйста, протестируйте:
1. Запись и отправка голосового сообщения
2. Получение push notification при новом сообщении

Известные проблемы:
- Видео > 50 MB может загружаться долго (работаем над оптимизацией)
```

### 13.3 Security

**Никогда не коммитить secrets в git:**
- ❌ Passwords
- ❌ API keys
- ❌ Certificates (.p12 files)
- ❌ Provisioning profiles

**Использовать:**
- ✅ GitHub Secrets для CI/CD
- ✅ Environment variables
- ✅ Fastlane Match для certificates
- ✅ .gitignore для sensitive files

**Пример .gitignore:**
```
# Certificates and provisioning profiles
*.p12
*.cer
*.mobileprovision

# Fastlane
fastlane/report.xml
fastlane/Preview.html
fastlane/screenshots
fastlane/test_output

# Environment variables
.env
.env.local

# Build artifacts
*.ipa
*.dSYM.zip
```

### 13.4 Monitoring

**После каждого TestFlight upload:**
- Проверять App Store Connect → TestFlight → Crashes
- Смотреть на crash-free rate (должен быть > 99%)
- Реагировать на frequent crashes немедленно

**Crashlytics / Firebase:**
- Интегрировать для real-time crash reporting
- Символизация crash logs для readable stack traces

---

## 14. Troubleshooting

### 14.1 Common Issues

**"No signing identity found":**
- Solution: создать Distribution Certificate или импортировать существующий
- Проверить validity (не expired)

**"Provisioning profile doesn't include signing certificate":**
- Solution: создать новый Provisioning Profile с правильным certificate

**"App ID doesn't match":**
- Solution: Bundle ID в Xcode должен совпадать с App ID на developer.apple.com

**"Build processing too long" (> 2 hours):**
- Solution: проверить App Store Connect status page (могут быть outages)
- Или contact Apple Developer Support

**"Export compliance missing":**
- Solution: ответить на encryption questions в App Store Connect → TestFlight → Build

**TestFlight upload failed "Invalid IPA":**
- Solution: убедиться, что build для "Any iOS Device" (не simulator)
- Проверить validation в Xcode Organizer

### 14.2 Support Resources

**Apple Developer:**
- Documentation: https://developer.apple.com/documentation
- Forums: https://developer.apple.com/forums
- Support: https://developer.apple.com/support (для paid accounts)

**Fastlane:**
- Documentation: https://docs.fastlane.tools
- GitHub: https://github.com/fastlane/fastlane
- Community: Fastlane Slack

**GitHub Actions:**
- Documentation: https://docs.github.com/en/actions
- Marketplace: https://github.com/marketplace?type=actions

---

## 15. Примечания и placeholders

**ВАЖНО: Данный документ содержит placeholders, которые нужно заменить:**

- `[TESTFLIGHT_CONTACT_EMAIL]` — email для Apple review team contact
- `[PHONE_NUMBER]` — phone number для contact
- `[DEMO_PASSWORD]` — пароль для demo accounts (хранить в secure location)
- `[FOUNDERS_EMAIL]` — email основателей для questions
- `[YOUR_APPLE_ID_EMAIL]` — ваш Apple ID
- `[YOUR_TEAM_ID]` — Team ID из Apple Developer account

**Безопасное хранение credentials:**
- Используйте 1Password, LastPass, или GitHub Secrets
- Никогда не отправляйте credentials в plain text (email, Slack)
- Ротация credentials периодически (certificates expire через 1 год)

**Temporary unavailability of Apple Developer access:**
- Если владелец не имеет Apple Developer account сейчас, инструкции помогут setup когда аккаунт будет доступен
- Рекомендуется создать Organization account для компании (не Individual)

---

**Последнее обновление:** 2026-01-02  
**Версия:** 1.0  
**Контакт:** [FOUNDERS_EMAIL]
