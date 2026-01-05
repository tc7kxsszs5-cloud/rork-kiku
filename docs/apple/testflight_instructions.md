# TestFlight Instructions для Rork-Kiku iOS App

## Обзор

Данный документ описывает процесс подготовки iOS приложения Rork-Kiku для beta-тестирования через Apple TestFlight.

**Статус**: 🟡 Временная недоступность Apple Developer Account  
**Важно**: Владелец должен зарегистрировать Apple Developer Account или предоставить доступ команде.

## Предварительные требования

### 1. Apple Developer Account

**Тип аккаунта**: Apple Developer Program ($99/год)

**Регистрация**:
1. Перейти на https://developer.apple.com/programs/
2. Зарегистрироваться как Individual или Organization
   - **Individual**: Быстрее (1-2 дня), на имя владельца
   - **Organization**: Требует D-U-N-S number, 2-4 недели
3. Оплатить $99/год
4. Дождаться approval от Apple

**Текущий статус**: 🔴 Не зарегистрирован

---

### 2. App ID и Bundle ID

#### App ID
**Format**: `com.rork-kiku.app` (example)  
**Capabilities**:
- Push Notifications
- Sign in with Apple
- iCloud (опционально)
- ~~Associated Domains (если deep links)~~

**Создание**:
1. Apple Developer Portal > Certificates, Identifiers & Profiles
2. Identifiers > App IDs > "+"
3. Explicit App ID (не wildcard)
4. Enable capabilities

#### Bundle ID
**Recommendation**: `com.rork-kiku.app` или `com.[company-name].rork-kiku`

**В Xcode**:
```swift
// Info.plist или project settings
CFBundleIdentifier = com.rork-kiku.app
```

**Важно**: Bundle ID должен совпадать с App ID в Developer Portal.

---

### 3. Provisioning Profiles

#### Development Profile
Для локальной разработки и тестирования на physical devices.

**Создание**:
1. Developer Portal > Profiles > "+"
2. iOS App Development
3. Select App ID
4. Select Development Certificates
5. Select Devices (тестовые устройства team)
6. Download и install в Xcode

#### App Store Connect Profile (Distribution)
Для TestFlight и App Store submission.

**Создание**:
1. Developer Portal > Profiles > "+"
2. App Store
3. Select App ID
4. Select Distribution Certificate
5. Download и install в Xcode

**Automatic Signing**: Xcode может управлять provisioning profiles автоматически (рекомендуется для simple cases).

---

### 4. Certificates

#### Development Certificate
Для разработки и тестирования.

**Создание**:
1. Keychain Access (macOS) > Certificate Assistant > Request a Certificate from a Certificate Authority
2. Email: [developer email], Common Name: [Your Name]
3. Save to disk
4. Developer Portal > Certificates > "+"
5. iOS App Development
6. Upload CSR (Certificate Signing Request)
7. Download certificate
8. Double-click для install в Keychain

**Важно**: Certificate привязан к конкретному Mac. Для CI/CD требуется export и secure storage.

#### Distribution Certificate
Для TestFlight и App Store.

**Создание**:
1. Аналогично Development, но выбрать "iOS Distribution"
2. Download и install

**Team sharing**: Для team, export certificate + private key (p12) и share securely.

---

### 5. Devices (для TestFlight Internal Testing)

**TestFlight External Testing**: Не требует регистрации devices (до 10,000 testers)  
**TestFlight Internal Testing**: Требует регистрации devices (до 100 devices)

**Регистрация devices**:
1. Получить UDID устройства:
   - Xcode > Window > Devices and Simulators
   - iTunes/Finder (для non-developers)
2. Developer Portal > Devices > "+"
3. Enter Device Name и UDID
4. Register

**Для Internal Testing team**: Зарегистрировать devices команды (iOS developers, QA).

---

## App Store Connect Setup

### 1. Создание App в App Store Connect

**URL**: https://appstoreconnect.apple.com/

**Шаги**:
1. Login с Apple Developer Account
2. My Apps > "+" > New App
3. Platforms: iOS
4. Name: "Rork-Kiku"
5. Primary Language: Russian (или English)
6. Bundle ID: Select `com.rork-kiku.app`
7. SKU: `rork-kiku-ios` (internal identifier)
8. User Access: Full Access (по умолчанию)
9. Create

**App Information**:
- **Name**: Rork-Kiku (или localized name)
- **Subtitle**: "Безопасная семейная платформа" (32 chars max)
- **Privacy Policy URL**: https://www.rork-kiku.com/privacy (placeholder)
- **Category**: Primary: Social Networking, Secondary: Photo & Video
- **Content Rights**: [TBD]

---

### 2. App Metadata (для TestFlight и App Store)

#### App Description
**Краткое описание** (170 chars):
```
Безопасная платформа для семейного обмена фото и видео с AI-модерацией. Создана для детей 4-12 лет и их родителей. COPPA/GDPR compliant.
```

**Полное описание** (4000 chars max):
```
Rork-Kiku — это первая семейная платформа для безопасного обмена фото и видео, созданная специально для детей 4-12 лет и их родителей.

🔒 Безопасность превыше всего
• Закрытая семейная сеть (не публичная)
• AI-модерация контента (95%+ accuracy)
• Ручная проверка подозрительного контента
• COPPA/GDPR compliant

👨‍👩‍👧‍👦 Для всей семьи
• Профили для родителей и детей
• Семейная лента с фото и видео
• Настройки модерации (строгая/умеренная/мягкая)
• Push-уведомления о новом контенте

🤖 Умная модерация
• Автоматическое сканирование всего контента
• Детекция небезопасного контента
• Быстрая модерация (<5 секунд для safe content)
• Прозрачность решений

📱 Просто и удобно
• Интуитивный интерфейс
• Быстрая загрузка медиа
• Offline-first (в разработке)

[EN] Rork-Kiku is the first family-safe media sharing platform with AI moderation, designed for kids 4-12 and their parents. Private, secure, COPPA/GDPR compliant.
```

#### Keywords (100 chars max)
```
семья,дети,фото,видео,безопасность,модерация,приватность,COPPA,родители,family,kids,safe
```

#### Screenshots
**Required**:
- iPhone 6.5" (iPhone 14 Pro Max): Минимум 3, рекомендуется 5-10
- iPhone 5.5" (опционально): Backward compatibility

**Content**:
1. Onboarding screen (Welcome to Rork-Kiku)
2. Family feed
3. Upload photo flow
4. Moderation notification
5. Settings/Privacy

**Localization**: Русский (primary), English (secondary)

**Design guidelines**:
- No UI chrome (status bar, nav bar с безопасным контентом)
- Highlight key features
- Use family-friendly imagery (stock photos или mockups)

**Placeholder**: Использовать mockup screenshots до готовности реального app.

#### App Preview Video (опционально)
- 15-30 секунд
- Demo key features
- Family-friendly content

---

### 3. Age Rating (Обязательно)

**Apple Age Rating Questionnaire**:

**Важно для family app**: Правильный age rating critical для trust.

**Ожидаемый rating**: **4+** (No objectionable content)

**Questionnaire answers**:
- Cartoon or Fantasy Violence: None
- Realistic Violence: None
- Sexual Content or Nudity: None
- Profanity or Crude Humor: None
- Alcohol, Tobacco, or Drug Use: None
- Mature/Suggestive Themes: None
- Horror/Fear Themes: None
- Gambling: None
- Unrestricted Web Access: No
- User Generated Content: **Yes** (это ключевой пункт)

**User Generated Content** (UGC):
- ✅ "This app features user-generated content"
- ✅ "This app has moderation for user-generated content"
- **Moderation frequency**: "All content is moderated"
- **Moderation method**: "AI-powered automated moderation + human review"

**Parental Gate**: Implement если App Store требует (для UGC apps с детьми).

---

### 4. Privacy Disclosures (iOS 14+)

**App Privacy section** в App Store Connect (обязательно с iOS 14):

#### Data Collection
Мы собираем:
- **Contact Info**: Email
- **User Content**: Photos, Videos
- **Identifiers**: User ID
- **Usage Data**: Product interaction

#### Data Usage
- Used for App Functionality
- Used for Analytics (opt-in)
- Not used for Advertising
- **Not shared with third parties** (for advertising)

#### Data Linked to User
- Email, Photos, Videos

#### Data Not Linked to User
- Crash data, Diagnostics

**Privacy Label**: Apple генерирует label на основе ваших ответов.

**Важно**: Быть честным. False disclosures → App rejection или removal.

---

## Build и Upload для TestFlight

### Вариант 1: Ручная сборка (Владелец)

**Требуется**:
- Mac с Xcode 14+ (latest)
- Apple Developer Account access
- Provisioning profiles и certificates установлены

**Шаги**:

#### 1. Подготовка проекта

```bash
# В Xcode project
# 1. Increment build number (CFBundleVersion)
# Например: 1.0 (1) → 1.0 (2)

# 2. Archive build
Xcode > Product > Archive

# 3. Дождаться успешной сборки
```

#### 2. Distribute для TestFlight

```
# После успешного Archive
1. Xcode Organizer > Archives tab
2. Select latest archive
3. "Distribute App"
4. Выбрать "App Store Connect"
5. "Upload"
6. Выбрать Distribution Certificate и Provisioning Profile
7. "Upload"
8. Дождаться "Upload Successful"
```

#### 3. App Store Connect

```
1. Login на https://appstoreconnect.apple.com/
2. My Apps > Rork-Kiku > TestFlight tab
3. Дождаться обработки build (5-30 минут)
4. Build появится в "iOS Builds" section
5. Add build для Internal или External Testing
```

**Время обработки**: Apple обрабатывает build (проверка на malware, etc.) — 5-30 минут.

---

### Вариант 2: Fastlane (Автоматизация)

**Fastlane**: Инструмент для автоматизации iOS deployment.

**Установка**:
```bash
# Install Fastlane
sudo gem install fastlane

# Initialize Fastlane в iOS project directory
cd ios/
fastlane init
```

**Fastfile example** (placeholder):
```ruby
# ios/fastlane/Fastfile

default_platform(:ios)

platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    # Increment build number
    increment_build_number(xcodeproj: "RorkKiku.xcodeproj")
    
    # Build app
    build_app(
      scheme: "RorkKiku",
      export_method: "app-store"
    )
    
    # Upload to TestFlight
    upload_to_testflight(
      skip_waiting_for_build_processing: true,
      distribute_external: false # Internal testing only
    )
  end
end
```

**Запуск**:
```bash
fastlane beta
```

**Credentials**: Fastlane потребует Apple ID и App-Specific Password.

**App-Specific Password**:
1. appleid.apple.com > Sign In
2. Security > App-Specific Passwords > Generate
3. Использовать для Fastlane

**Хранение credentials**: **НИКОГДА не commitить в git**. Использовать:
- Environment variables (`FASTLANE_USER`, `FASTLANE_PASSWORD`)
- Fastlane Match для certificates (см. ниже)

---

### Вариант 3: GitHub Actions CI/CD (Автоматизация)

**Плюсы**:
- Автоматическая сборка на каждый push/tag
- Reproducible builds
- Team access

**Минусы**:
- Требует setup (certificates, secrets)
- macOS runners платные на GitHub (free tier: 2000 минут/месяц)

**GitHub Actions workflow example** (placeholder):
```yaml
# .github/workflows/ios-testflight.yml

name: iOS TestFlight Deploy

on:
  push:
    tags:
      - 'v*' # Trigger на version tags (e.g., v1.0.0)

jobs:
  deploy:
    runs-on: macos-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Xcode
      uses: maxim-lobanov/setup-xcode@v1
      with:
        xcode-version: '14.3'
    
    - name: Install dependencies
      run: |
        cd ios
        pod install # If using CocoaPods
    
    - name: Install Fastlane
      run: sudo gem install fastlane
    
    - name: Decode certificates
      env:
        CERTIFICATES_P12: ${{ secrets.CERTIFICATES_P12 }}
        CERTIFICATES_PASSWORD: ${{ secrets.CERTIFICATES_PASSWORD }}
      run: |
        echo $CERTIFICATES_P12 | base64 --decode > certificates.p12
        security create-keychain -p "" build.keychain
        security import certificates.p12 -k build.keychain -P $CERTIFICATES_PASSWORD -T /usr/bin/codesign
        security set-key-partition-list -S apple-tool:,apple: -s -k "" build.keychain
        security list-keychains -s build.keychain
        security default-keychain -s build.keychain
        security unlock-keychain -p "" build.keychain
    
    - name: Build and upload to TestFlight
      env:
        FASTLANE_USER: ${{ secrets.FASTLANE_USER }}
        FASTLANE_PASSWORD: ${{ secrets.FASTLANE_PASSWORD }}
      run: |
        cd ios
        fastlane beta
```

**GitHub Secrets** (обязательны):
- `FASTLANE_USER`: Apple ID email
- `FASTLANE_PASSWORD`: App-Specific Password
- `CERTIFICATES_P12`: Base64-encoded p12 certificate
- `CERTIFICATES_PASSWORD`: Password для p12

**Setup GitHub Secrets**:
1. GitHub repo > Settings > Secrets and variables > Actions
2. New repository secret
3. Добавить каждый secret

**Export certificate для CI**:
```bash
# On Mac with Xcode
1. Keychain Access > My Certificates
2. Select "iPhone Distribution" certificate
3. Right-click > Export "iPhone Distribution..."
4. Save as certificates.p12 with password
5. Base64 encode:
   base64 certificates.p12 | pbcopy
6. Paste в GitHub Secrets as CERTIFICATES_P12
```

---

## Безопасная загрузка App Store Connect Credentials

**⚠️ КРИТИЧНО**: **НИКОГДА не хардкодить credentials в коде или CI config.**

### Рекомендуемые методы:

#### 1. Environment Variables (Local)
```bash
export FASTLANE_USER="your-apple-id@example.com"
export FASTLANE_PASSWORD="app-specific-password"

fastlane beta
```

#### 2. GitHub Secrets (CI/CD)
- См. выше (GitHub Actions example)

#### 3. Fastlane Match (Certificates)
**Fastlane Match**: Синхронизация certificates и provisioning profiles через Git repo или cloud storage.

**Setup**:
```bash
fastlane match init
# Выбрать storage type: git, google_cloud, s3, etc.
# Создать private Git repo для certificates

fastlane match appstore # Download/create certificates
```

**Benefits**:
- Централизованное управление certificates
- Легко share между team и CI
- Автоматическая генерация/обновление

**Security**: Private repo должен быть secure (2FA, limited access).

#### 4. HashiCorp Vault (Enterprise)
Для более крупных команд:
```bash
# Store credentials в Vault
vault kv put secret/rork-kiku/ios fastlane_user=... fastlane_password=...

# Retrieve в CI
export FASTLANE_USER=$(vault kv get -field=fastlane_user secret/rork-kiku/ios)
```

#### 5. AWS Secrets Manager (Cloud)
```bash
# Store в AWS Secrets Manager
aws secretsmanager create-secret --name rork-kiku/ios/fastlane \
  --secret-string '{"user":"...","password":"..."}'

# Retrieve в CI
export FASTLANE_USER=$(aws secretsmanager get-secret-value --secret-id rork-kiku/ios/fastlane --query SecretString --output text | jq -r .user)
```

**Recommendation**: Начать с GitHub Secrets для MVP, migrate к Vault/AWS Secrets Manager после seed.

---

## TestFlight Distribution

### Internal Testing

**Пользователи**: До 100 members (team, employees)  
**Review**: No App Store review required  
**Device limit**: До 100 devices (registered UDIDs)

**Шаги**:
1. App Store Connect > TestFlight > Internal Testing
2. Add Internal Testers (по email, должны иметь App Store Connect access)
3. Select build
4. Add What to Test (release notes)
5. Start Testing

**Testers receive**:
- Email с TestFlight link
- Notification в TestFlight app

### External Testing

**Пользователи**: До 10,000 testers (public beta)  
**Review**: **Apple review required** (первая build, ~24 hours)  
**Device limit**: Не требуется (любые devices)

**Шаги**:
1. App Store Connect > TestFlight > External Testing
2. Create New Group (e.g., "Public Beta", "Pilot Users")
3. Add build (дождаться Apple review)
4. Generate Public Link или Add Testers by email
5. Start Testing

**Public Link**:
- Share link с potential testers
- Anyone с link может install (до 10,000)
- Track installs в App Store Connect

**Beta App Review**:
- Apple проверяет app на compliance
- Обычно 24-48 hours
- Если rejected, fix issues и resubmit

---

## Testing Instructions для Beta Testers

**Email template для testers**:

```
Subject: Rork-Kiku iOS Beta Testing Invitation

Здравствуйте!

Вы приглашены протестировать beta-версию Rork-Kiku — безопасной семейной платформы для обмена фото и видео.

Как начать:
1. Install TestFlight app на ваш iPhone (iOS 15+):
   App Store: https://apps.apple.com/app/testflight/id899247664

2. Open invitation link:
   [TestFlight Public Link]

3. Tap "Start Testing" в TestFlight app

4. Install Rork-Kiku beta

Что тестировать:
- Регистрация и onboarding
- Создание профиля ребёнка
- Загрузка фото/видео
- Семейная лента
- Настройки модерации

Feedback:
- Bugs: Report через TestFlight (встроенный feedback)
- Suggestions: Email [FOUNDERS_EMAIL]
- Survey: [Google Form link]

Спасибо за участие!

Команда Rork-Kiku
```

---

## Troubleshooting

### Common Issues

#### 1. "No provisioning profiles found"
**Solution**:
- Xcode > Preferences > Accounts > Download Manual Profiles
- Или enable Automatic Signing в Xcode

#### 2. "Code signing error"
**Solution**:
- Проверить certificate expiration
- Regenerate provisioning profile
- Clean build folder (Cmd+Shift+K)

#### 3. "Upload failed: Invalid bundle"
**Solution**:
- Проверить Info.plist (required keys)
- Проверить Bundle ID match
- Validate Archive before upload

#### 4. "Processing build takes too long"
**Solution**:
- Normal (5-30 минут)
- Если > 1 hour, contact Apple Support

#### 5. "TestFlight beta review rejected"
**Solution**:
- Read rejection reason carefully
- Fix issues (обычно: privacy policy missing, inappropriate content)
- Resubmit

---

## Roadmap (Post-MVP)

### Phase 1: Internal Alpha (Current)
- Team testing (5-10 devices)
- Bug fixes и iterations

### Phase 2: Private Beta (Q1 2026)
- Internal Testing (50-100 families)
- Collect feedback

### Phase 3: Public Beta (Q2 2026)
- External Testing (100-200 families)
- Apple Beta Review

### Phase 4: App Store Launch (Q2-Q3 2026)
- Full App Store submission
- Public release

---

## Полезные ресурсы

**Apple Documentation**:
- TestFlight Guide: https://developer.apple.com/testflight/
- App Store Connect Help: https://help.apple.com/app-store-connect/
- Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/

**Fastlane**:
- Documentation: https://docs.fastlane.tools/
- Match: https://docs.fastlane.tools/actions/match/

**GitHub Actions**:
- iOS CI/CD: https://docs.github.com/en/actions/deployment/deploying-to-your-cloud-provider

---

**Дата создания**: 2026-01-02  
**Версия документа**: 1.0 (Draft)  
**Автор**: Команда Rork-Kiku  
**Контакт**: [FOUNDERS_EMAIL]

**ВНИМАНИЕ**: Документ содержит placeholders. Владелец должен зарегистрировать Apple Developer Account и настроить credentials перед использованием.
