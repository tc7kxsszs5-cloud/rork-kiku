# Инструкции по TestFlight для kiku

## Обзор

Данный документ содержит подробные инструкции по подготовке iOS приложения kiku для распространения через TestFlight — платформу Apple для beta testing.

**Целевая аудитория:** Разработчики, DevOps команда

**Предварительные требования:**
- Apple Developer Account (Individual или Organization)
- Xcode установлен на macOS
- Expo CLI и EAS CLI
- Access к репозиторию kiku

⚠️ **ВАЖНО:** Apple Developer Account временно недоступен (placeholder). Эти инструкции предполагают, что доступ появится. Если нет — обсудим альтернативные каналы распространения.

---

## 1. Apple Developer Account Setup

### 1.1 Создание/Доступ к Apple Developer Account

**Если аккаунт еще не создан:**

1. **Зарегистрироваться на Apple Developer Program:**
   - Перейти на: https://developer.apple.com/programs/enroll/
   - Выбрать тип аккаунта:
     - **Individual** ($99/year) — для личного проекта
     - **Organization** ($99/year) — для компании (требуется D-U-N-S Number)
   - Заполнить форму и оплатить

2. **Подтверждение email и телефона:**
   - Apple может занять 24-48 часов для approval

**Если аккаунт уже существует:**
- **Login:** https://developer.apple.com/account/
- **Credentials:** [PLACEHOLDER — Apple ID email/password]
- **Two-Factor Authentication:** Убедитесь, что 2FA включён

### 1.2 Team Management (если Organization account)

- **Перейти в:** App Store Connect → Users and Access
- **Добавить developers:**
  - Admin role (для lead developer)
  - App Manager role (для других developers, нужен для TestFlight)
  - Developer role (только для development, не TestFlight)

**Рекомендация:** Минимум 2 человека с App Manager access (backup на случай недоступности primary developer)

---

## 2. App ID и Bundle Identifier

### 2.1 Создание App ID

**Что такое App ID:**
- Уникальный identifier вашего приложения в Apple экосистеме
- Формат: `com.kiku.app` (или подобный)

**Шаги:**

1. **Перейти в:** Apple Developer → Certificates, Identifiers & Profiles → Identifiers
2. **Нажать "+"** для создания нового App ID
3. **Выбрать тип:** App IDs
4. **Настройки:**
   - **Description:** kiku - Child Safety Monitor
   - **Bundle ID:** Explicit (не Wildcard)
     - **Формат:** `com.[your-company-name].kiku` (например, `com.kiku.app`)
     - ⚠️ **Важно:** Bundle ID должен совпадать с `identifier` в `app.json` / `app.config.js`
   - **Capabilities** (включить нужные):
     - ✅ Push Notifications (для алертов родителям)
     - ✅ Associated Domains (если используете deep links)
     - ✅ Sign In with Apple (если планируете в будущем)
     - ✅ App Groups (если нужна синхронизация между extension/main app)
5. **Сохранить**

**В `app.json`:**
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.kiku.app"
    }
  }
}
```

### 2.2 Проверка Bundle Identifier в проекте

```bash
# Проверить текущий bundle ID
cat app.json | grep bundleIdentifier

# Или в eas.json
cat eas.json
```

---

## 3. Certificates и Provisioning Profiles

### 3.1 Certificates (Сертификаты)

**Типы certificates:**
- **Development Certificate:** Для local development (запуск на физическом устройстве)
- **Distribution Certificate:** Для TestFlight и App Store (production builds)

#### Создание Distribution Certificate:

**Option 1: Через EAS (рекомендовано):**
```bash
# EAS автоматически создаст certificates
eas build:configure
eas credentials
```

**Option 2: Manually через Apple Developer Portal:**

1. **Перейти в:** Certificates, Identifiers & Profiles → Certificates
2. **Нажать "+"**
3. **Выбрать:** iOS Distribution (App Store and Ad Hoc)
4. **Certificate Signing Request (CSR):**
   - На macOS:
     ```bash
     # Открыть Keychain Access
     # Keychain Access → Certificate Assistant → Request a Certificate From a Certificate Authority
     # User Email Address: [your-email]
     # Common Name: [your-name]
     # Save to disk
     ```
5. **Upload CSR** и download `.cer` file
6. **Double-click** `.cer` file to install в Keychain

**Хранение:**
- ⚠️ **Secrets:** Certificates содержат private keys — не коммитить в Git
- **Рекомендация:** Хранить в secure location (1Password, AWS Secrets Manager)
- **Для CI/CD:** Использовать EAS Credentials или GitHub Secrets

### 3.2 Provisioning Profiles

**Что такое Provisioning Profile:**
- Связывает App ID, certificates, и devices (для development) или all devices (для App Store distribution)

#### Создание Provisioning Profile для TestFlight:

**Option 1: Через EAS (рекомендовано):**
```bash
eas build --platform ios --profile production
# EAS автоматически создаст provisioning profile
```

**Option 2: Manually:**

1. **Перейти в:** Profiles → "+"
2. **Выбрать:** iOS App Development (для development) или App Store (для TestFlight/App Store)
3. **Выбрать App ID:** `com.kiku.app`
4. **Выбрать Certificate:** Ваш Distribution Certificate
5. **Name:** kiku App Store Profile
6. **Download** и save (`.mobileprovision` file)

**Для EAS:** Profiles автоматически управляются EAS, manual setup не требуется.

---

## 4. Сборка приложения для TestFlight

### 4.1 Подготовка проекта

**Проверка `app.json` / `app.config.js`:**

```json
{
  "expo": {
    "name": "kiku",
    "slug": "kiku",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.kiku.app",
      "buildNumber": "1",
      "supportsTablet": false,
      "infoPlist": {
        "NSCameraUsageDescription": "kiku использует камеру для загрузки фотографий в чаты.",
        "NSPhotoLibraryUsageDescription": "kiku использует галерею для загрузки изображений.",
        "NSMicrophoneUsageDescription": "kiku использует микрофон для записи голосовых сообщений.",
        "NSLocationWhenInUseUsageDescription": "kiku использует локацию только при нажатии кнопки SOS для экстренной помощи."
      }
    }
  }
}
```

**Важные поля:**
- `version`: Semantic versioning (например, 1.0.0)
- `buildNumber`: Increment при каждом build (1, 2, 3, ...)
- `infoPlist`: Обязательные permission descriptions (Apple требует)

### 4.2 Настройка EAS Build

**Установка EAS CLI:**
```bash
npm install -g @expo/eas-cli
# Или
bun add -g @expo/eas-cli
```

**Login:**
```bash
eas login
# Введите Expo account credentials
```

**Configure EAS:**
```bash
eas build:configure
```

Это создаст `eas.json`:
```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "ios": {
        "buildType": "archive"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "[PLACEHOLDER — your-apple-id@example.com]",
        "ascAppId": "[PLACEHOLDER — App Store Connect App ID]"
      }
    }
  }
}
```

### 4.3 Build для TestFlight (Production)

**Command:**
```bash
eas build --platform ios --profile production
```

**Что произойдёт:**
1. EAS загрузит ваш код на Expo servers
2. Создаст iOS build (`.ipa` file) на macOS машинах Expo
3. Подпишет build вашими certificates/profiles
4. Вернёт download link на `.ipa` file

**Время:** 15-30 минут (зависит от queue)

**Monitoring:**
- Следить за build в terminal или на: https://expo.dev/accounts/[your-account]/projects/kiku/builds

**Troubleshooting common errors:**
- **Certificate missing:** Run `eas credentials` и setup credentials
- **Bundle ID mismatch:** Проверьте `app.json`
- **Build failed:** Проверьте logs на expo.dev

### 4.4 Локальный build с fastlane (альтернатива)

**Если вы хотите build локально (не через EAS):**

**Prerequisites:**
- Xcode установлен
- CocoaPods установлен
- fastlane установлен

**Install fastlane:**
```bash
sudo gem install fastlane -NV
# Или через Homebrew
brew install fastlane
```

**Initialize fastlane:**
```bash
cd ios/
fastlane init
```

**Fastfile (пример):**
```ruby
default_platform(:ios)

platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    # Increment build number
    increment_build_number(xcodeproj: "kiku.xcodeproj")
    
    # Build app
    build_app(
      scheme: "kiku",
      export_method: "app-store",
      output_directory: "./build"
    )
    
    # Upload to TestFlight
    upload_to_testflight(
      skip_waiting_for_build_processing: true
    )
  end
end
```

**Run:**
```bash
fastlane beta
```

**⚠️ Note:** Для Expo проектов, manual fastlane setup сложнее. **Рекомендуется использовать EAS.**

---

## 5. Создание App в App Store Connect

### 5.1 Login в App Store Connect

- **URL:** https://appstoreconnect.apple.com/
- **Credentials:** [PLACEHOLDER — Apple ID email/password + 2FA]

### 5.2 Создание App

1. **Перейти в:** My Apps → "+" → New App
2. **Настройки:**
   - **Platform:** iOS
   - **Name:** kiku
   - **Primary Language:** Russian (или English)
   - **Bundle ID:** Выбрать `com.kiku.app` (созданный ранее)
   - **SKU:** Уникальный identifier (например, `kiku-ios-001`)
   - **User Access:** Full Access (по умолчанию)
3. **Create**

### 5.3 App Information

**Заполнить основные поля:**
- **Name:** kiku
- **Subtitle:** AI-Powered Child Safety Monitor
- **Privacy Policy URL:** [PLACEHOLDER — https://kiku-app.com/privacy]
- **Category:** Primary — Utilities или Education
- **Secondary Category:** Lifestyle

---

## 6. Подготовка Metadata для TestFlight

### 6.1 App Store Metadata

**Что нужно подготовить:**

1. **App Icon (1024x1024px):**
   - Без alpha channel (no transparency)
   - Формат: PNG или JPEG
   - Находится в `assets/icon.png` (Expo автоматически генерирует из этого)

2. **Screenshots (обязательно):**
   - **iPhone 6.7" (iPhone 14 Pro Max):** минимум 1, рекомендовано 3-5
   - **iPhone 6.5" (iPhone 11 Pro Max):** минимум 1
   - Размеры: 1290x2796px или 1284x2778px
   - **Содержание:** Ключевые экраны приложения (dashboard, alerts, parental controls)

   **Как создать:**
   - Использовать Simulator в Xcode
   - Или tools: https://www.appstorescreenshot.com/

3. **App Preview Video (опционально):**
   - 15-30 секунд
   - Демонстрация ключевых функций

4. **Description:**
   ```
   kiku — это AI-powered платформа для мониторинга и обеспечения безопасности детских чатов.

   Защитите своих детей онлайн с помощью:
   🤖 AI-анализа сообщений в реальном времени
   🚨 Мгновенных алертов при обнаружении опасного контента
   📊 Dashboard с полной картиной безопасности ребёнка
   🆘 Кнопки SOS с геолокацией для экстренных ситуаций

   Полное соответствие COPPA и GDPR-K.
   ```

5. **Keywords (100 characters max):**
   ```
   child safety,parental control,AI monitor,cyberbullying,chat safety,kids protection
   ```

6. **Support URL:** [PLACEHOLDER — https://kiku-app.com/support]

7. **Marketing URL (optional):** [PLACEHOLDER — https://kiku-app.com]

### 6.2 Age Rating

**В App Store Connect:** App Information → Age Rating → Edit

**Вопросы Apple (примерные ответы для kiku):**
- **Cartoon or Fantasy Violence:** No
- **Realistic Violence:** No
- **Sexual Content or Nudity:** No
- **Profanity or Crude Humor:** No
- **Alcohol, Tobacco, or Drug Use:** No
- **Mature/Suggestive Themes:** No
- **Horror/Fear Themes:** No
- **Gambling:** No
- **Contests:** No
- **Unrestricted Web Access:** No (kiku не встроенный browser)
- **Made For Kids:** No (это для родителей, но касается детей)

**Expected Rating:** 4+ или 9+ (зависит от ответов)

### 6.3 Privacy Disclosures (iOS 14+)

**Apple требует disclosure о data collection:**

**В App Store Connect:** App Privacy → Get Started

**Что нужно указать:**

1. **Do you collect data from this app?** Yes

2. **Какие данные собираются:**

   **Contact Info:**
   - ✅ Email Address
   - ✅ Name
   - ✅ Phone Number (optional)
   
   **User Content:**
   - ✅ Photos or Videos
   - ✅ Audio Data
   - ✅ Customer Support (chat logs)
   - ✅ Other User Content (текстовые сообщения для AI анализа)
   
   **Identifiers:**
   - ✅ User ID
   - ✅ Device ID
   
   **Usage Data:**
   - ✅ Product Interaction
   - ✅ Crash Data
   
   **Location:**
   - ✅ Precise Location (только для SOS)

3. **Для каждого типа данных:**
   - **Linked to User:** Yes (большинство данных)
   - **Used for Tracking:** No (kiku не отслеживает для ads)
   - **Purpose:** 
     - App Functionality (основная цель)
     - Analytics (для улучшения продукта)
     - Product Personalization (для AI настройки)

4. **Privacy Policy URL:** [PLACEHOLDER — https://kiku-app.com/privacy]

**⚠️ ВАЖНО:** Privacy disclosures должны соответствовать вашей Privacy Policy. Несоответствие — причина rejection от Apple.

---

## 7. Загрузка Build в TestFlight

### 7.1 Через EAS (автоматически)

**Command:**
```bash
eas submit --platform ios --profile production
```

**Что нужно:**
- **Apple ID:** [PLACEHOLDER — your-apple-id@example.com]
- **App-Specific Password:** Сгенерировать на https://appleid.apple.com/account/manage
  - Sign In → Security → App-Specific Passwords → Generate
  - Сохранить password в GitHub Secrets: `APPLE_APP_SPECIFIC_PASSWORD`

**EAS автоматически:**
1. Скачает `.ipa` build
2. Upload в App Store Connect через Transporter
3. Build появится в TestFlight через 5-15 минут (после Apple processing)

### 7.2 Manually (через Xcode Transporter)

**Если EAS submit не работает:**

1. **Download `.ipa`** build из expo.dev
2. **Install Transporter:** https://apps.apple.com/app/transporter/id1450874784
3. **Open Transporter** → Sign in with Apple ID
4. **Drag & drop `.ipa`** file
5. **Deliver** → Wait for upload (5-30 minutes depending on file size)

### 7.3 Проверка в App Store Connect

1. **Перейти в:** App Store Connect → My Apps → kiku → TestFlight
2. **iOS Builds:** Ваш build должен появиться после processing (5-30 минут)
3. **Status:** "Processing" → "Ready to Submit" → "Waiting for Review" (если external testing)

---

## 8. Настройка TestFlight Testing

### 8.1 Internal Testing (Internal Testers)

**Кто:** Члены вашей команды (до 100 человек с App Manager/Admin/Developer role в App Store Connect)

**Как добавить:**
1. **Перейти в:** TestFlight → Internal Testing
2. **Добавить testers:**
   - Users and Access → Invite (если еще нет)
   - Или выбрать из existing team members
3. **Select Build:** Выбрать ваш build
4. **Start Testing**

**Testers получают:**
- Email invite с link на TestFlight app
- Могут установить сразу (без review от Apple)

**Ограничения:**
- Нет external users (только team)
- Max 100 internal testers

### 8.2 External Testing (Beta Testers)

**Кто:** Любые пользователи (до 10,000 external testers)

**Требования:**
- **App Review Required:** Первый build для external testing должен пройти Apple review (обычно 24-48 часов)
- **Export Compliance:** Если приложение использует шифрование (обычно Yes для большинства приложений)

**Как настроить:**

1. **Перейти в:** TestFlight → External Testing → "+" Create New Group
2. **Group Name:** "Pilot Users" (или другое имя)
3. **Add Testers:**
   - **Option A:** Manually add emails (по одному)
   - **Option B:** Public Link (любой с link может join)
     - TestFlight → Public Link → Enable
     - Share link: `https://testflight.apple.com/join/[unique-code]`
4. **Select Build:** Выбрать ваш build
5. **What to Test (optional):** Описание для testers (на русском):
   ```
   Спасибо за участие в beta тестировании kiku!

   В этой версии:
   - Базовый AI-анализ текстовых сообщений
   - Алерты родителям при обнаружении рисков
   - Родительская панель управления

   Пожалуйста, сообщайте о любых багах или предложениях через встроенную форму feedback.
   ```
6. **Submit for Review** (если первый external build)

### 8.3 Export Compliance

**Вопрос от Apple:** "Does your app use encryption?"

**Ответ:**
- **Yes** (если используете HTTPS, TLS — почти все приложения)
- Но вы можете указать, что это standard encryption (не custom), и вам не нужен export license

**Как указать в app.json:**
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    }
  }
}
```

Это означает: "Мы используем только standard encryption (HTTPS), не custom cryptography"

**Если Apple спросит больше:**
- Explain: "We only use HTTPS for API calls, no custom encryption algorithms"

---

## 9. Распространение через TestFlight

### 9.1 Приглашение Testers

**Internal testers:**
- Автоматически получают email после добавления build

**External testers:**
- **Option 1:** Отправить email invites вручную
  - TestFlight → External Testing → Group → Add Testers → Enter emails
- **Option 2:** Public Link
  - Поделиться link в social media, email, Telegram, etc.
  - Testers переходят по link → Install TestFlight app → Join beta

**TestFlight App:**
- Testers должны установить TestFlight app из App Store: https://apps.apple.com/app/testflight/id899247664
- После установки: Open invite link → Accept → Install kiku

### 9.2 Feedback от Testers

**Встроенный feedback в TestFlight:**
- Testers могут shake device → Send feedback
- Screenshot + comment
- Feedback появляется в App Store Connect → TestFlight → Feedback

**Альтернативные каналы:**
- Email: [PLACEHOLDER — beta@kiku-app.com]
- Telegram group для beta testers
- Google Form для structured feedback

### 9.3 Updating Builds

**Как отправить новый build:**
1. **Increment `buildNumber`** в `app.json` (например, 1 → 2)
2. **Build:** `eas build --platform ios --profile production`
3. **Submit:** `eas submit --platform ios`
4. **В TestFlight:** Select new build для existing test group
5. **Testers получают notification** о новой версии

**⚠️ Note:** Каждый external build (первый в группе) требует Apple review. Subsequent builds в той же группе — no review (instant availability).

---

## 10. CI/CD с GitHub Actions

### 10.1 Setup GitHub Secrets

**В GitHub:** Settings → Secrets and variables → Actions → New repository secret

**Нужные secrets:**
- `EXPO_TOKEN`: Expo access token (https://expo.dev/settings/access-tokens)
- `APPLE_ID`: [PLACEHOLDER — your-apple-id@example.com]
- `APPLE_APP_SPECIFIC_PASSWORD`: Generated на appleid.apple.com

**Optional (если используете API Key вместо password):**
- `APPLE_API_KEY_JSON`: JSON с API key, issuer ID, key ID
  ```json
  {
    "key_id": "[KEY_ID]",
    "issuer_id": "[ISSUER_ID]",
    "key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
  }
  ```

### 10.2 GitHub Actions Workflow

**File:** `.github/workflows/eas-build-submit.yml`

```yaml
name: EAS Build & Submit (iOS)

on:
  push:
    branches:
      - main
      - release/**
  workflow_dispatch:

jobs:
  build:
    name: Build and Submit to TestFlight
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build iOS app
        run: eas build --platform ios --profile production --non-interactive

      - name: Submit to TestFlight
        run: eas submit --platform ios --profile production --non-interactive
        env:
          EXPO_APPLE_ID: ${{ secrets.APPLE_ID }}
          EXPO_APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
```

**Trigger:**
- Автоматически при push в `main` или `release/**` branches
- Manually через GitHub Actions UI (workflow_dispatch)

---

## 11. Troubleshooting

### Common Issues

**1. Build Failed: Certificate Missing**
```
Error: No valid iOS Distribution certificate found
```

**Fix:**
```bash
eas credentials
# Выбрать iOS → Select Build Credentials → Add new certificate
```

**2. Submit Failed: Invalid Bundle ID**
```
Error: Bundle ID 'com.kiku.app' does not match
```

**Fix:** Проверьте `app.json`:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.kiku.app"
    }
  }
}
```

**3. TestFlight: App Stuck in "Processing"**
- Обычно занимает 5-15 минут, но может быть до 1 часа
- Если > 1 час → check Apple System Status: https://developer.apple.com/system-status/
- Или contact Apple Developer Support

**4. External Testing Rejected**
```
Guideline X.X - We found that your app...
```

**Common rejection reasons:**
- Missing privacy disclosures
- Incomplete metadata (screenshots, description)
- App crashes на launch

**Fix:** Следуйте feedback от Apple, исправьте и resubmit

**5. Crash on Launch**
- **Check logs:** TestFlight → Crashes
- **Common причины:**
  - Missing permissions в `infoPlist`
  - API keys не настроены (OpenAI, AWS)
  - Backend недоступен

---

## 12. Альтернативные каналы (если Apple Developer Account недоступен)

### Option 1: Ad Hoc Distribution

**Описание:** Распространение `.ipa` напрямую registered devices (до 100 devices)

**Steps:**
1. Зарегистрировать UDIDs devices
2. Создать Ad Hoc Provisioning Profile
3. Build с ad hoc profile
4. Распространить `.ipa` через email/link

**Ограничения:**
- Max 100 devices
- Нужен UDID каждого device (получается через Xcode или third-party tools)
- Не scalable для большого pilot

### Option 2: Enterprise Distribution (маловероятно)

**Требования:** Apple Developer Enterprise Program ($299/year, только для крупных организаций)

**Ограничения:** Apple очень строго ограничивает, кто может использовать (только internal employees)

### Option 3: Third-Party Beta Platforms

- **diawi.com** — upload `.ipa` и получить download link
- **installonair.com**
- **BrowserStack App Live** — test на real devices

**Ограничения:** Devices должны быть registered в provisioning profile (ad hoc)

---

## 13. Checklist перед запуском TestFlight

- [ ] Apple Developer Account активен и оплачен
- [ ] App ID создан с правильным Bundle ID
- [ ] Certificates и Provisioning Profiles настроены (или используем EAS auto-management)
- [ ] `app.json` / `eas.json` настроены корректно
- [ ] App icon (1024x1024) готов
- [ ] Screenshots (минимум 1 per device size) готовы
- [ ] Privacy Policy URL доступен
- [ ] Age Rating заполнен
- [ ] Privacy Disclosures заполнены
- [ ] Build успешно создан через EAS
- [ ] Build uploaded в App Store Connect
- [ ] Build прошёл Apple processing
- [ ] Internal testing group создан и testers добавлены
- [ ] External testing group создан (если нужен)
- [ ] Public Link enabled (если используется)
- [ ] "What to Test" описание заполнено
- [ ] Feedback channels настроены (email, Telegram, etc.)
- [ ] CI/CD pipeline настроен (optional, но рекомендовано)

---

## 14. Полезные ссылки

**Apple Resources:**
- Apple Developer Portal: https://developer.apple.com/
- App Store Connect: https://appstoreconnect.apple.com/
- TestFlight Documentation: https://developer.apple.com/testflight/
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/

**Expo Resources:**
- EAS Build Documentation: https://docs.expo.dev/build/introduction/
- EAS Submit Documentation: https://docs.expo.dev/submit/introduction/
- Expo Credentials: https://docs.expo.dev/app-signing/app-credentials/

**Tools:**
- Transporter App: https://apps.apple.com/app/transporter/id1450874784
- fastlane: https://fastlane.tools/
- Screenshot Generator: https://www.appstorescreenshot.com/

---

## 15. Контакты и поддержка

**Для технических вопросов:**
- Lead Developer: [PLACEHOLDER — Имя, email]
- DevOps: [PLACEHOLDER — Имя, email]

**Для Apple-related issues:**
- Apple Developer Support: https://developer.apple.com/support/
- App Store Connect Support: В App Store Connect → ? → Contact Us

**Для EAS issues:**
- Expo Forums: https://forums.expo.dev/
- Expo Discord: https://chat.expo.dev/

---

**Дата создания:** 2026-01-02  
**Версия:** 1.0 (черновик)  
**Автор:** kiku Development Team  
**Статус:** Draft — требуется обновление после получения Apple Developer Account
