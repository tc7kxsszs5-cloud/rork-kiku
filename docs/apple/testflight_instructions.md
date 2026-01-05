# TestFlight Instructions для Rork-Kiku

## Обзор

Этот документ содержит подробные инструкции по подготовке iOS-сборки и загрузке в TestFlight для pilot testing платформы Rork-Kiku.

⚠️ **ВАЖНО:** Для загрузки в TestFlight требуется Apple Developer Program membership ($99/год). Владелец репозитория должен зарегистрироваться или предоставить доступ.

---

## Предварительные требования

### 1. Apple Developer Account

**Зарегистрироваться:**
- https://developer.apple.com/programs/
- Стоимость: $99/год
- Требуется: Apple ID, credit card, 2FA
- Время активации: 24-48 часов после payment

**Роли:**
- **Account Holder:** Полный доступ (рекомендуется для founder)
- **Admin:** Может управлять certificates, provisioning (рекомендуется для CTO/Lead iOS Engineer)
- **Developer:** Ограниченный доступ

### 2. App Store Connect

После регистрации Developer Account:
- Доступ: https://appstoreconnect.apple.com/
- Создать app record
- Настроить team, roles

### 3. Development Environment

**На локальной машине:**
- macOS (Big Sur или новее)
- Xcode 14+ (latest stable recommended)
- Node.js 18+ (`nvm install 18`)
- Bun (`curl -fsSL https://bun.sh/install | bash`)
- EAS CLI (`bun i -g @expo/eas-cli`)

**Expo Account:**
- Создать аккаунт: https://expo.dev/signup
- Бесплатный tier достаточен для pilot
- Paid tier ($29/month) для больше concurrent builds

---

## Шаг 1: Настройка проекта в App Store Connect

### 1.1 Создать App Record

1. Login к https://appstoreconnect.apple.com/
2. **My Apps** → **+** → **New App**
3. Fill in:
   - **Platform:** iOS
   - **Name:** Rork-Kiku (или выбранное marketing name)
   - **Primary Language:** Russian (или English)
   - **Bundle ID:** `com.rork.kiku` (или выбранный, см. ниже)
   - **SKU:** `rork-kiku-1` (internal identifier)
   - **User Access:** Full Access

### 1.2 Bundle ID

**Рекомендуемый формат:** `com.[company].[app]`

**Example:** `com.rork.kiku`

**Создать в Developer Portal:**
1. https://developer.apple.com/account/resources/identifiers/list
2. **+** (Add)
3. **App IDs** → Continue
4. **App** → Continue
5. **Description:** Rork-Kiku iOS App
6. **Bundle ID:** Explicit, введите `com.rork.kiku`
7. **Capabilities:** Select:
   - Push Notifications
   - Sign in with Apple (если OAuth)
   - Background Modes (для notifications)
8. **Continue** → **Register**

### 1.3 App Information

В App Store Connect → **App Information**:

**Category:**
- **Primary:** Social Networking (или Photography)
- **Secondary:** Lifestyle

**Age Rating:**
- Настроить через questionnaire
- Target: 4+ (parent-controlled app)
- Answers должны reflect parental control nature

**Privacy Policy URL:** [TO BE PROVIDED]
- Требуется для App Store submission
- См. `docs/legal/privacy_policy_draft.md`

**Terms of Service URL (optional):** [TO BE PROVIDED]

---

## Шаг 2: Certificates и Provisioning Profiles

### Option A: Managed by Expo (Recommended для начинающих)

**EAS Build automatically manages certificates:**

1. Login:
   ```bash
   eas login
   ```

2. Configure project:
   ```bash
   eas build:configure
   ```

3. EAS создаст certificates автоматически при первой сборке

**Плюсы:**
- Простота (no manual management)
- Automatic renewal
- Team sharing

**Минусы:**
- Less control
- Requires EAS account

### Option B: Manual Management (Для advanced users)

#### 2.1 Development Certificate

1. https://developer.apple.com/account/resources/certificates/list
2. **+** (Add)
3. **iOS App Development** → Continue
4. Generate CSR:
   - macOS: Keychain Access → Certificate Assistant → Request Certificate from CA
   - Save to disk
5. Upload CSR → Download certificate
6. Double-click `.cer` file (installs в Keychain)

#### 2.2 Distribution Certificate (для TestFlight)

1. Same portal → **+**
2. **Apple Distribution** → Continue
3. Generate CSR (same process)
4. Upload → Download → Install

#### 2.3 Provisioning Profile

**Development Profile:**
1. https://developer.apple.com/account/resources/profiles/list
2. **+** (Add)
3. **iOS App Development** → Continue
4. Select App ID → Continue
5. Select certificates → Continue
6. Select devices (test devices) → Continue
7. **Name:** Rork-Kiku Development
8. Download → Double-click (installs в Xcode)

**Distribution Profile (App Store / TestFlight):**
1. Same portal → **+**
2. **App Store** → Continue
3. Select App ID → Continue
4. Select distribution certificate → Continue
5. **Name:** Rork-Kiku AppStore
6. Download

---

## Шаг 3: Конфигурация проекта

### 3.1 app.json configuration

Обновить `app.json`:

```json
{
  "expo": {
    "name": "Rork-Kiku",
    "slug": "rork-kiku",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "rork-kiku",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "bundleIdentifier": "com.rork.kiku",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "Rork-Kiku needs access to your photos to upload family content.",
        "NSCameraUsageDescription": "Rork-Kiku needs access to your camera to capture photos and videos.",
        "NSUserTrackingUsageDescription": "This identifier will be used to deliver personalized ads to you."
      }
    },
    "android": {
      "package": "com.rork.kiku",
      "versionCode": 1
    },
    "plugins": [
      "expo-router"
    ]
  }
}
```

### 3.2 eas.json configuration

Обновить `eas.json`:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
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
      "distribution": "store",
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "[APPLE_ID_EMAIL]",
        "ascAppId": "[APP_STORE_CONNECT_APP_ID]",
        "appleTeamId": "[APPLE_TEAM_ID]"
      }
    }
  }
}
```

**Заменить placeholders:**
- `[APPLE_ID_EMAIL]`: Your Apple ID (e.g., founder@example.com)
- `[APP_STORE_CONNECT_APP_ID]`: Find в App Store Connect (app record URL)
- `[APPLE_TEAM_ID]`: Find в https://developer.apple.com/account → Membership

---

## Шаг 4: Создание сборки

### 4.1 Build для TestFlight (Production Profile)

```bash
# Login к Expo (if not already)
eas login

# Build
eas build --platform ios --profile production

# Процесс:
# 1. Upload source code to Expo servers
# 2. Build на macOS machines
# 3. Sign с certificates
# 4. Generate .ipa file
# 5. Provide download link
```

**Build time:** 10-30 minutes (depending на queue)

**Output:**
- Build ID (e.g., `abc12345-6789-...`)
- .ipa file URL
- QR code для download

### 4.2 Мониторинг сборки

**Via CLI:**
```bash
eas build:list
eas build:view [BUILD_ID]
```

**Via Web:**
- https://expo.dev/accounts/[account]/projects/[project]/builds

**Troubleshooting:**
- Если build fails, check logs
- Common issues:
  - Missing certificates
  - Invalid Bundle ID
  - Code signing errors
  - Dependency conflicts

---

## Шаг 5: Upload к TestFlight

### Option A: Automatic Submit (Recommended)

**Требуется:** App Store Connect API Key

#### 5.1 Создать API Key

1. App Store Connect → **Users and Access** → **Keys** tab
2. **+** (Generate API Key)
3. **Name:** EAS CI/CD
4. **Access:** App Manager (minimum)
5. **Generate**
6. **Download API Key** (.p8 file) — СКАЧАТЬ СЕЙЧАС (только 1 раз доступен!)
7. Save: `Issuer ID` и `Key ID`

#### 5.2 Хранение API Key (SECURE!)

**Option 1: Local file (для manual submissions)**
```bash
mkdir -p ~/.private_keys
mv ~/Downloads/AuthKey_*.p8 ~/.private_keys/
chmod 600 ~/.private_keys/AuthKey_*.p8
```

**Option 2: GitHub Secrets (для CI/CD)**
```bash
# Base64 encode key
cat AuthKey_*.p8 | base64

# Add to GitHub Secrets:
# APPLE_API_KEY_CONTENT: [base64 encoded key]
# APPLE_API_KEY_ID: [Key ID from App Store Connect]
# APPLE_API_KEY_ISSUER_ID: [Issuer ID from App Store Connect]
```

⚠️ **НИКОГДА не коммитить .p8 file в Git!**

#### 5.3 Submit

```bash
eas submit --platform ios --profile production --latest

# Если требуется API key локально:
eas submit --platform ios --profile production --latest \
  --apple-id [APPLE_ID_EMAIL] \
  --asc-app-id [APP_STORE_CONNECT_APP_ID] \
  --apple-team-id [APPLE_TEAM_ID] \
  --key ~/.private_keys/AuthKey_*.p8 \
  --key-id [KEY_ID] \
  --issuer-id [ISSUER_ID]
```

**Process:**
1. EAS downloads .ipa
2. Validates
3. Uploads к App Store Connect via API
4. Processing begins (5-10 minutes)

### Option B: Manual Upload (Transporter)

**If API key not available:**

1. Download .ipa from EAS build
2. Install **Transporter** app (Mac App Store)
3. Open Transporter
4. Drag .ipa file
5. **Deliver**
6. Wait для processing (5-10 minutes)

### Option C: Manual Upload (Xcode)

**Alternative:**

1. Xcode → **Window** → **Organizer**
2. **Distribute App**
3. **App Store Connect** → Next
4. **Upload** → Next
5. Select certificates → Next
6. **Upload**

---

## Шаг 6: Настройка TestFlight

### 6.1 Дождаться Processing

После upload, App Store Connect processing:
- **Processing:** 5-20 minutes (обычно)
- **Status:** App Store Connect → **TestFlight** tab → **iOS Builds** → проверить Status

**Status:**
- 🟡 **Processing:** Wait
- 🟢 **Ready to Submit:** Proceed
- 🔴 **Invalid Binary:** Check error, rebuild

### 6.2 Заполнить Test Information

**В App Store Connect → TestFlight:**

**What to Test:**
```
Мы тестируем новую платформу безопасного детского контента с AI-модерацией.

Пожалуйста, попробуйте:
1. Создать аккаунт родителя
2. Добавить профиль ребенка
3. Загрузить фото или видео
4. Проверить результаты модерации
5. Предоставить feedback

Спасибо за участие в пилоте!
```

**Export Compliance:**
- **Encryption:** Yes (если HTTPS enabled, which it is)
- **Exemption:** Choose appropriate exemption (likely "standard encryption")

**Beta App Review Information:**
- **Contact Information:** [FOUNDERS_EMAIL], phone
- **Sign-In Required:** Yes
- **Test Account:**
  - Email: `testuser@example.com` (placeholder)
  - Password: `TestPassword123!`
  - Notes: "This is a parent test account with pre-configured child profile"

⚠️ **PLACEHOLDER credentials:** Создать реальный test account перед submission!

### 6.3 Добавить Beta Testers

**Internal Testing (до 100 users, любой в App Store Connect team):**
1. TestFlight → **Internal Testing** → **+** → Выбрать build
2. Add testers (team members)
3. **Start Testing**

**External Testing (до 10,000 users, требуется Beta App Review):**
1. TestFlight → **External Testing** → **+** → Create Group
2. **Group Name:** Pilot Testers
3. Add build
4. **Provide Test Information** (см. выше)
5. **Submit для Beta App Review**
6. Wait approval (1-2 дня обычно)
7. После approval, add testers via:
   - Email (ввести emails)
   - Public Link (generate link, share)

### 6.4 Приглашение Testers

**Via Email:**
- TestFlight → External Group → **Testers** → **+**
- Ввести email addresses (до 100 за раз)
- Testers получат email invite

**Via Public Link:**
- Generate public link
- Share link (WhatsApp, Telegram, email)
- Anyone с link может join (до 10,000 cap)

**Testers Instructions:**
1. Install **TestFlight** app (App Store)
2. Open invite email или link
3. **Accept** → **Install**
4. Open app → Begin testing

---

## Шаг 7: GitHub Actions CI/CD (Опционально но рекомендуется)

### 7.1 GitHub Secrets Setup

**Required Secrets:**
- `EXPO_TOKEN`: Expo access token (https://expo.dev/accounts/[account]/settings/access-tokens)
- `APPLE_API_KEY_CONTENT`: Base64-encoded .p8 file
- `APPLE_API_KEY_ID`: Key ID from App Store Connect
- `APPLE_API_KEY_ISSUER_ID`: Issuer ID

**Add в GitHub:**
- Repository → Settings → Secrets and variables → Actions → New repository secret

### 7.2 GitHub Actions Workflow

Создать `.github/workflows/eas-build-ios.yml`:

```yaml
name: EAS Build & Submit (iOS)

on:
  workflow_dispatch:
    inputs:
      profile:
        description: 'Build profile'
        required: true
        default: 'production'
        type: choice
        options:
          - production
          - preview
  push:
    branches:
      - main
      - 'release/**'

jobs:
  build:
    name: Build iOS
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 18.x

      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build iOS
        run: eas build --platform ios --profile ${{ inputs.profile || 'production' }} --non-interactive --no-wait

  submit:
    name: Submit to TestFlight
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main' || startsWith(github.ref, 'refs/heads/release/')
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Submit to TestFlight
        env:
          APPLE_API_KEY_CONTENT: ${{ secrets.APPLE_API_KEY_CONTENT }}
          APPLE_API_KEY_ID: ${{ secrets.APPLE_API_KEY_ID }}
          APPLE_API_KEY_ISSUER_ID: ${{ secrets.APPLE_API_KEY_ISSUER_ID }}
        run: |
          echo "$APPLE_API_KEY_CONTENT" | base64 -d > /tmp/apple-api-key.p8
          eas submit --platform ios --profile production --latest --non-interactive \
            --key /tmp/apple-api-key.p8 \
            --key-id $APPLE_API_KEY_ID \
            --issuer-id $APPLE_API_KEY_ISSUER_ID
          rm /tmp/apple-api-key.p8
```

**Trigger:**
- Automatic: push to `main` or `release/**`
- Manual: Actions tab → Run workflow

---

## Шаг 8: Metadata и App Store Listing (Preparation)

### 8.1 App Metadata (для eventual App Store release)

**App Name:** Rork-Kiku

**Subtitle:** Безопасная платформа детского контента

**Description:**
```
Rork-Kiku — это безопасная платформа для семейного контента с автоматической модерацией на основе искусственного интеллекта.

Родители могут:
• Создавать профили для детей
• Загружать семейные фото и видео
• Быть уверенными в безопасности контента (AI + ручная модерация)
• Управлять настройками конфиденциальности

Особенности:
✓ Двухуровневая модерация (AI + человек)
✓ COPPA и GDPR compliant
✓ Полный родительский контроль
✓ Приватные семейные аккаунты
✓ Быстрая модерация (< 5 секунд для фото)

Безопасность превыше всего. Ваши данные защищены end-to-end encryption.

Для пилота: присоединяйтесь к TestFlight beta!
```

**Keywords:**
- child safety
- family photos
- parental control
- kids content
- AI moderation

**Screenshots:** 6.5" и 5.5" screens (см. `docs/branding/brand-guidelines.md`)

**App Icon:** 1024x1024 (см. `docs/branding/logo_placeholders/`)

### 8.2 Privacy Policy & Terms

**⚠️ ОБЯЗАТЕЛЬНО перед submission:**
- Publish privacy policy на website
- Publish Terms of Service
- Update URLs в App Store Connect

**См.:**
- `docs/legal/privacy_policy_draft.md`
- Terms of Service (TO BE CREATED)

---

## Troubleshooting

### Build Errors

**"Unable to resolve module..."**
- Solution: `bun install` и clear cache: `bunx expo start -c`

**"Certificate not found"**
- Solution: Re-generate certificates или enable EAS auto-management

**"Provisioning profile expired"**
- Solution: Renew profile в Developer Portal или EAS will auto-renew

### Upload Errors

**"Invalid Binary"**
- Check: Info.plist permissions, Bundle ID match, certificates valid

**"Missing Compliance"**
- Solution: Fill Export Compliance Information в TestFlight

**"Invalid API Key"**
- Solution: Verify Key ID, Issuer ID, .p8 file content

### TestFlight Issues

**Testers not receiving invites**
- Check: Email correct, spam folder, TestFlight app installed

**Build not appearing**
- Wait: Processing может занять до 30 minutes
- Check: Status в App Store Connect

---

## Security Best Practices

### Credential Management

**✅ DO:**
- Use GitHub Secrets для CI/CD
- Use .gitignore для local credentials
- Rotate API keys ежегодно
- Limit API key scope (App Manager, not Admin)

**❌ DON'T:**
- Commit .p8 files
- Share API keys в Slack/email
- Use personal Apple ID для production
- Store credentials в code

### Access Control

- **Minimum 2 people** с access (founder + engineer)
- **Role:** Admin для engineers, Account Holder для founder
- **MFA:** Enable 2FA на all Apple IDs

---

## Cost Breakdown

| Item | Cost | Frequency |
|------|------|-----------|
| Apple Developer Program | $99 | Annual |
| Expo EAS (Free tier) | $0 | - |
| Expo EAS (Paid, optional) | $29 | Monthly |
| **Total (minimum)** | **$99** | **Annual** |

**Note:** Free Expo tier adequate для pilot. Paid tier для more concurrent builds и priority support.

---

## Timeline Estimate

| Task | Time |
|------|------|
| Apple Developer registration | 24-48 hours |
| App Store Connect setup | 30 minutes |
| Bundle ID & certificates | 1 hour |
| EAS configuration | 30 minutes |
| First build | 20-30 minutes |
| Upload & processing | 10-20 minutes |
| TestFlight setup | 1 hour |
| Beta App Review | 1-2 дня |
| **Total** | **~3-4 дня** |

---

## Next Steps

1. [ ] Зарегистрировать Apple Developer Account
2. [ ] Создать App ID в Developer Portal
3. [ ] Создать app record в App Store Connect
4. [ ] Configure EAS (`eas.json`)
5. [ ] Run test build locally
6. [ ] Generate production build via EAS
7. [ ] Submit к TestFlight
8. [ ] Add beta testers
9. [ ] Begin pilot testing

---

**Контакт для вопросов:** [FOUNDERS_EMAIL]

**Related Documents:**
- `docs/pilot/pilot_plan.md` - Pilot testing plan
- `docs/infra/ci_cd.md` - CI/CD setup
- `docs/branding/brand-guidelines.md` - App icons и screenshots
