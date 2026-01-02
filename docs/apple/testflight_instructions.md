# TestFlight Instructions для Rork-Kiku

## Обзор

Это руководство описывает процесс подготовки iOS приложения Rork-Kiku для распространения через TestFlight, включая настройку Fastlane, GitHub Actions CI/CD, и безопасное управление секретами.

---

## Требования

### Prerequisites

1. **Apple Developer Account** ($99/год)
   - Team ID
   - Apple ID (developer account email)
   
2. **App ID** (Bundle Identifier)
   - Формат: `com.rork-kiku.app` или `com.yourcompany.rork-kiku`
   - Должен быть уникальным в App Store

3. **Provisioning Profiles**
   - Development profile (для локальной разработки)
   - Ad Hoc profile (для TestFlight)
   - App Store profile (для production)

4. **Certificates**
   - Development certificate
   - Distribution certificate

5. **Tools**
   - Xcode 14+ (на Mac для создания certificates)
   - Fastlane (automation tool)
   - EAS CLI (Expo Application Services)

---

## Шаг 1: Apple Developer Portal Setup

### 1.1 Создать App ID

1. Зайти в [Apple Developer Portal](https://developer.apple.com/)
2. Перейти в **Certificates, Identifiers & Profiles** → **Identifiers**
3. Нажать **+** (создать новый identifier)
4. Выбрать **App IDs** → **Continue**
5. Заполнить:
   - **Description**: Rork-Kiku
   - **Bundle ID**: `com.rork-kiku.app` (explicit, не wildcard)
   - **Capabilities**: Выбрать необходимые:
     - ✅ Push Notifications
     - ✅ Associated Domains (для deep linking)
     - ⚠️ Sign in with Apple (если планируется)
6. **Register**

### 1.2 Создать App в App Store Connect

1. Зайти в [App Store Connect](https://appstoreconnect.apple.com/)
2. **My Apps** → **+** → **New App**
3. Заполнить:
   - **Platform**: iOS
   - **Name**: Rork-Kiku
   - **Primary Language**: English (или Russian)
   - **Bundle ID**: Выбрать созданный App ID
   - **SKU**: `rork-kiku-ios` (unique identifier для внутреннего учета)
   - **User Access**: Full Access (или ограничить)
4. **Create**

### 1.3 Настроить TestFlight

В App Store Connect → **TestFlight** tab:

1. **External Groups** (опционально, для wider beta):
   - Create group (например, "Public Beta")
   - Add testers (email addresses)
   - ⚠️ Требует **Beta App Review** (первый раз)

2. **Internal Testing** (recommended для MVP):
   - Автоматически доступно для членов команды (App Store Connect Users)
   - Без review, моментальное распространение
   - Лимит: 100 devices per account

---

## Шаг 2: Локальная настройка (Expo + EAS)

### 2.1 Install EAS CLI

```bash
npm install -g @expo/eas-cli

# или
bun add -g @expo/eas-cli
```

### 2.2 Login to Expo

```bash
eas login
```

**Если нет Expo account**:
```bash
eas register
```

### 2.3 Configure EAS Build

```bash
cd /path/to/rork-kiku
eas build:configure
```

Это создаст файл `eas.json` (если еще не создан).

### 2.4 Update eas.json

Наш текущий `eas.json`:
```json
{
  "cli": {
    "version": ">= 13.2.0"
  },
  "build": {
    "production": {
      "ios": {
        "buildType": "archive",
        "distribution": "store"
      }
    },
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "[YOUR_APPLE_ID_EMAIL]",
        "ascAppId": "[APP_STORE_CONNECT_APP_ID]",
        "appleTeamId": "[YOUR_TEAM_ID]"
      }
    }
  }
}
```

**Заполнить placeholders**:
- `appleId`: Email вашего Apple Developer account
- `ascAppId`: Найти в App Store Connect → App Information → Apple ID (число, например `1234567890`)
- `appleTeamId`: Найти в Apple Developer → Membership → Team ID

### 2.5 Update app.json

Убедиться, что `app.json` содержит правильные настройки:

```json
{
  "expo": {
    "name": "Rork-Kiku",
    "slug": "rork-kiku",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.rork-kiku.app",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "We need access to your photo library to set profile pictures.",
        "NSCameraUsageDescription": "We need access to your camera to take profile pictures.",
        "NSUserTrackingUsageDescription": "We use tracking to provide personalized content and ads."
      }
    }
  }
}
```

**Privacy Strings** (обязательно для App Store):
- Описать, зачем приложению нужен каждый permission
- На русском и английском (если multi-language)

---

## Шаг 3: Certificates & Provisioning (Fastlane Match)

### Option A: EAS Managed (Рекомендуется для начала)

EAS может автоматически создать и управлять certificates/provisioning:

```bash
eas build --platform ios --profile production
```

При первом запуске EAS спросит:
- Would you like us to handle credentials? **Yes**
- EAS создаст certificates и provisioning profiles

**Плюсы**:
- Просто, автоматически
- Подходит для small teams

**Минусы**:
- Меньше контроля
- Для CI/CD нужно настроить EXPO_TOKEN

### Option B: Fastlane Match (Для продвинутых)

Fastlane Match хранит certificates в git repo (private, encrypted).

**Setup**:
```bash
# Install fastlane
gem install fastlane

# Initialize fastlane
cd ios/  # если есть iOS папка
fastlane init
```

**Create Matchfile**:
```ruby
git_url("https://github.com/your-org/certificates")
storage_mode("git")
type("appstore") # или "adhoc" для TestFlight
app_identifier(["com.rork-kiku.app"])
username("your@apple.id")
team_id("YOUR_TEAM_ID")
```

**Run match**:
```bash
fastlane match appstore
# Enter passphrase для encryption (store securely!)
```

**Плюсы**:
- Shared certificates (team members)
- Version controlled
- CI/CD friendly

**Минусы**:
- Сложнее setup
- Требует отдельный git repo

---

## Шаг 4: Локальный Build & Upload

### 4.1 Build для TestFlight

```bash
eas build --platform ios --profile production
```

**Что происходит**:
1. EAS собирает код (в облаке, на Mac servers)
2. Создает `.ipa` file (iOS app package)
3. Загружает в EAS dashboard

**Duration**: 10-20 минут (первый build дольше)

**Monitor progress**:
- В терминале (progress bar)
- EAS dashboard: https://expo.dev/accounts/[your-account]/projects/rork-kiku/builds

### 4.2 Submit to TestFlight

После успешного build:

```bash
eas submit --platform ios --profile production
```

**Или автоматически** (добавить в `eas.json`):
```json
{
  "build": {
    "production": {
      "ios": {
        "autoSubmit": true
      }
    }
  }
}
```

**Что происходит**:
1. EAS загружает `.ipa` в App Store Connect
2. Apple обрабатывает build (10-30 минут)
3. Build появляется в TestFlight

### 4.3 Distribute to Testers

В App Store Connect → TestFlight:

1. Выбрать build (последний загруженный)
2. **Internal Testing**: 
   - Автоматически доступно team members
   - Отправить ссылку: TestFlight → Copy Link
   
3. **External Testing** (если нужно):
   - Добавить External Group
   - Добавить testers (emails)
   - Submit for **Beta App Review** (первый раз, 24-48 часов)
   - После approval → testers получат invite

---

## Шаг 5: GitHub Actions CI/CD

### 5.1 Secrets Setup

В GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

**Обязательные secrets**:

1. **EXPO_TOKEN**
   - Создать: `eas whoami` → `eas login` → `eas build:configure`
   - Или: Expo website → Account Settings → Access Tokens → Create
   - Значение: Сохранить token

2. **APPLE_ID** (если используете eas submit)
   - Значение: Your Apple ID email
   
3. **APPLE_APP_SPECIFIC_PASSWORD**
   - Создать: https://appleid.apple.com/ → Sign In → Security → App-Specific Passwords
   - Generate password (label: "GitHub Actions EAS")
   - Значение: Сохранить password (one-time показ)

**Опциональные** (для Fastlane):
4. **MATCH_PASSWORD** (encryption passphrase для certificates)
5. **FASTLANE_PASSWORD** (Apple ID password, если не используете app-specific)

### 5.2 GitHub Actions Workflow

Создать файл `.github/workflows/ios-testflight.yml`:

```yaml
name: iOS TestFlight Build & Deploy

on:
  push:
    branches:
      - main
      - release/**
  workflow_dispatch:  # Manual trigger

jobs:
  build:
    name: Build and Submit iOS to TestFlight
    runs-on: macos-latest  # Required for iOS builds
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'  # or 'bun' if using bun
          
      - name: Install dependencies
        run: npm ci  # or bun install
        
      - name: Setup Expo and EAS
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
          
      - name: Build iOS app with EAS
        run: eas build --platform ios --profile production --non-interactive --no-wait
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          
      - name: Submit to TestFlight
        run: eas submit --platform ios --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
```

**Примечания**:
- `--no-wait`: Не ждет завершения build (быстрее, но не показывает ошибки сразу)
- Можно удалить `--no-wait` для синхронного build (но workflow займет 15-20 минут)
- `workflow_dispatch`: Позволяет запускать вручную через GitHub UI

### 5.3 Fastlane Alternative (Advanced)

Если используете Fastlane, можно заменить EAS команды:

**Create `fastlane/Fastfile`**:
```ruby
default_platform(:ios)

platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    # Sync certificates
    match(type: "appstore", readonly: true)
    
    # Increment build number
    increment_build_number(
      build_number: ENV["GITHUB_RUN_NUMBER"]  # Uses GitHub run number
    )
    
    # Build app
    gym(
      scheme: "RorkKiku",
      export_method: "app-store",
      output_directory: "./build"
    )
    
    # Upload to TestFlight
    upload_to_testflight(
      skip_waiting_for_build_processing: true,
      skip_submission: true,  # Don't submit for review
      apple_id: ENV["APPLE_ID"]
    )
  end
end
```

**GitHub Actions** (with Fastlane):
```yaml
- name: Build and Deploy with Fastlane
  run: |
    cd ios
    fastlane beta
  env:
    MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
    FASTLANE_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
    APPLE_ID: ${{ secrets.APPLE_ID }}
```

---

## Шаг 6: App Store Metadata

### 6.1 App Information

В App Store Connect → **App Information**:

- **Name**: Rork-Kiku
- **Subtitle**: Child Safety in Digital World (до 30 символов)
- **Category**: 
  - Primary: Education или Lifestyle
  - Secondary: Parenting (если есть)
- **Age Rating**: 4+ (app designed для родителей)
- **Privacy Policy URL**: https://rork-kiku.com/privacy
- **Support URL**: https://rork-kiku.com/support

### 6.2 Version Information

Для каждой версии (в TestFlight или App Store):

**What to Localize** (English + Russian minimum):
- **Description**: Подробное описание продукта (до 4,000 символов)
- **Keywords**: Разделенные запятыми (до 100 символов)
  - Example: "parental control, child safety, content filter, family, kids protection"
- **Screenshots**: 
  - iPhone 6.7" (iPhone 14 Pro Max) — **обязательно**
  - iPhone 6.5" (iPhone 11 Pro Max)
  - iPad Pro 12.9" (если поддерживается)
  - Минимум 1, максимум 10 per device size
- **App Preview Video** (опционально, но рекомендуется)
  - 15-30 seconds
  - Показать ключевые функции

### 6.3 Privacy Disclosures

⚠️ **Критически важно** для детских приложений!

В App Store Connect → **App Privacy**:

**Data Collection**:
- **Contact Info**: Email (родителей)
- **Usage Data**: Device ID, Product Interaction, Crash Data
- **Identifiers**: User ID
- **Sensitive Info**: нет (если правда нет)

**Data Use**:
- **App Functionality**: Все собранные данные
- **Analytics**: Usage Data
- **Product Personalization**: нет (или да, если применимо)
- **Advertising**: нет

**Data Linked to User**: Да (Contact Info, Usage Data)

**Tracking**: нет (если не используете third-party tracking для ads)

---

## Шаг 7: Security & Secrets Best Practices

### 7.1 Никогда не коммитить

❌ **NEVER commit to git**:
- API keys
- Apple ID passwords
- Certificates (.p12, .cer files)
- Provisioning profiles
- EXPO_TOKEN
- Any secrets

### 7.2 Где хранить secrets

**Local development**:
```bash
# .env.local (в .gitignore!)
EXPO_TOKEN=abc123...
APPLE_ID=your@email.com
```

**CI/CD**:
- **GitHub Secrets** (Settings → Secrets)
- **EAS Secrets**: `eas secret:create --name SECRET_NAME --value "secret value"`

**Production** (backend secrets):
- **AWS Secrets Manager**
- **HashiCorp Vault**
- **Kubernetes Secrets**

### 7.3 Environment Variables в Expo

**In app code**:
```typescript
// Use expo-constants
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra?.apiUrl || 'https://api.rork-kiku.com';
```

**In app.json**:
```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://api.rork-kiku.com",
      "environment": "production"
    }
  }
}
```

**For secrets** (use EAS Secrets):
```bash
eas secret:create --name API_KEY --value "your-api-key"
```

Then access via:
```typescript
import Constants from 'expo-constants';
const API_KEY = Constants.expoConfig.extra?.eas?.API_KEY;
```

---

## Шаг 8: Troubleshooting

### Common Issues

#### Build fails with "No provisioning profile found"

**Solution**:
```bash
# Let EAS regenerate
eas build --platform ios --profile production --clear-cache
```

Или:
```bash
# If using Fastlane Match
fastlane match appstore --force_for_new_devices
```

#### "Invalid Bundle Identifier"

**Check**:
- `app.json` → `ios.bundleIdentifier` matches App ID в Apple Developer Portal
- No typos, case-sensitive

#### TestFlight build stuck on "Processing"

**Wait**: Apple processing обычно 10-30 минут, иногда до 2 часов

**If > 2 hours**:
- Check App Store Connect → Activity (может быть error message)
- Возможно, проблема с metadata (missing required info)

#### GitHub Actions fails with "EXPO_TOKEN invalid"

**Solution**:
```bash
# Generate new token
eas login
eas whoami --token

# Update GitHub Secret
# Settings → Secrets → EXPO_TOKEN → Update
```

#### App crashes on launch (TestFlight)

**Debug**:
1. Check App Store Connect → **TestFlight** → **Crashes**
2. Download crash logs
3. Symbolicate с build artifacts
4. Fix bug → новый build

**Prevention**:
- Локальное тестирование перед upload
- Unit tests и integration tests
- CI/CD linting

---

## Шаг 9: Release Checklist

Перед каждым TestFlight release:

### Pre-Build
- [ ] Код reviewed и merged
- [ ] Tests passed (CI)
- [ ] Version number incremented (`app.json` → `version`)
- [ ] Build number incremented (или автоматически в CI)
- [ ] Changelog updated

### Build & Submit
- [ ] Build успешно завершился (EAS или Fastlane)
- [ ] Submit to TestFlight прошел
- [ ] Apple processing completed (check App Store Connect)

### Testing
- [ ] Internal testers получили build
- [ ] Smoke test (basic functionality works)
- [ ] No critical bugs

### Distribution
- [ ] External testers добавлены (если applicable)
- [ ] Beta App Review submitted (если первый раз external)
- [ ] Release notes написаны (для testers)

### Post-Release
- [ ] Monitor crashes в App Store Connect
- [ ] Collect feedback от testers
- [ ] Plan next iteration

---

## Ресурсы

**Apple**:
- [Apple Developer Portal](https://developer.apple.com/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [TestFlight Guide](https://developer.apple.com/testflight/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

**Expo & EAS**:
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [Expo Credentials](https://docs.expo.dev/app-signing/app-credentials/)

**Fastlane**:
- [Fastlane Docs](https://docs.fastlane.tools/)
- [Fastlane Match](https://docs.fastlane.tools/actions/match/)
- [Fastlane Gym](https://docs.fastlane.tools/actions/gym/)

**GitHub Actions**:
- [GitHub Actions for Mobile](https://github.com/features/actions)
- [expo-github-action](https://github.com/expo/expo-github-action)

---

**Автор**: DevOps & Mobile Team, Rork-Kiku  
**Версия**: v0.1.0 (Черновик)  
**Дата**: Январь 2026  
**Статус**: Ready для использования (обновлять по мере необходимости)  
**Следующий ревью**: После первого TestFlight release
