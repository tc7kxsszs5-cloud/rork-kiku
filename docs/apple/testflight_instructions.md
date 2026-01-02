# TestFlight инструкции для Rork-Kiku iOS

## Обзор

Этот документ содержит пошаговые инструкции для подготовки и загрузки iOS приложения Rork-Kiku в TestFlight для beta testing.

**⚠️ Важно:** На данный момент Apple Developer доступ временно отсутствует. Инструкции подготовлены для того момента, когда доступ будет предоставлен.

---

## Предварительные требования

### 1. Apple Developer Account

**Необходимо:**
- Apple Developer Program membership ($99/год)
- Account тип: Organization (рекомендуется) или Individual
- Admin access к App Store Connect

**Credentials:** [PLACEHOLDER - ИСПОЛЬЗОВАТЬ GITHUB SECRETS]

**Инструкция по безопасной загрузке credentials:**
1. НЕ добавляйте credentials в код или репозиторий
2. Используйте GitHub Secrets для CI/CD
3. Или храните в HashiCorp Vault / AWS Secrets Manager
4. Или владелец вручную загружает через Xcode

### 2. Certificates и Provisioning Profiles

**Необходимые certificates:**
- iOS Distribution Certificate (для App Store/TestFlight)
- Push Notification Certificate (для push notifications)

**Provisioning Profiles:**
- App Store Distribution Profile
- Development Profile (для локальной разработки)

---

## Шаг 1: Настройка App ID

### 1.1. Создание App ID в Apple Developer Portal

1. Войти в https://developer.apple.com/account
2. Navigate к **Certificates, Identifiers & Profiles**
3. Select **Identifiers** → **+** (новый identifier)
4. Choose **App IDs** → Continue
5. Configure App ID:
   - **Description**: Rork-Kiku
   - **Bundle ID**: com.rork-kiku.app (explicit, не wildcard)
   - **Capabilities**: Select required:
     - ✅ Push Notifications
     - ✅ Sign in with Apple (если планируется)
     - ✅ Associated Domains (если используются)
6. Register

### 1.2. App ID Configuration

**Bundle Identifier:** `com.rork-kiku.app`  
**App Name:** Rork-Kiku  
**Primary Language:** Russian

---

## Шаг 2: Certificates

### 2.1. Создание Distribution Certificate

**Если certificate уже не существует:**

1. В Apple Developer Portal → **Certificates** → **+**
2. Choose **iOS Distribution (App Store and Ad Hoc)**
3. Create Certificate Signing Request (CSR):
   - Открыть **Keychain Access** на Mac
   - Menu → Certificate Assistant → Request a Certificate from a Certificate Authority
   - Enter email и common name
   - Select "Saved to disk"
   - Save CSR file
4. Upload CSR к Apple Developer Portal
5. Download certificate (.cer file)
6. Double-click чтобы install в Keychain

**Важно:** 
- Certificate expires через 1 год, нужно renewal
- Backup private key из Keychain (Export .p12 file, храните в secure location)

### 2.2. Push Notification Certificate

1. В App ID settings → **Push Notifications** → Configure
2. Create certificate для Production
3. Upload CSR (аналогично Distribution certificate)
4. Download и install

---

## Шаг 3: Provisioning Profiles

### 3.1. App Store Distribution Profile

1. Apple Developer Portal → **Profiles** → **+**
2. Choose **App Store** → Continue
3. Select App ID: com.rork-kiku.app
4. Select Distribution Certificate
5. Profile Name: "Rork-Kiku App Store"
6. Generate и Download (.mobileprovision file)

### 3.2. Installation

**Automatic (Xcode):**
- Xcode обычно автоматически синхронизирует profiles
- Xcode → Preferences → Accounts → Download Manual Profiles

**Manual:**
- Double-click .mobileprovision file чтобы install
- Или копировать в `~/Library/MobileDevice/Provisioning Profiles/`

---

## Шаг 4: Xcode Configuration

### 4.1. Project Settings

1. Open Rork-Kiku.xcodeproj в Xcode
2. Select project в Navigator
3. Select target **Rork-Kiku**
4. **General** tab:
   - **Bundle Identifier**: com.rork-kiku.app
   - **Version**: 1.0.0 (semantic versioning)
   - **Build**: 1 (increment для каждой new build)
   - **Deployment Target**: iOS 14.0 (minimum)
5. **Signing & Capabilities** tab:
   - **Automatically manage signing**: OFF (для manual control)
   - **Team**: Select your Apple Developer Team
   - **Provisioning Profile**: Select "Rork-Kiku App Store"
   - **Signing Certificate**: iOS Distribution

### 4.2. Capabilities

Add required capabilities:
- Push Notifications
- Background Modes (если используется)
- Associated Domains (если используется)

### 4.3. Build Settings

Key settings:
- **Code Signing Identity**: iOS Distribution
- **Code Signing Style**: Manual
- **Provisioning Profile**: Rork-Kiku App Store

---

## Шаг 5: App Store Connect Setup

### 5.1. Создание App в App Store Connect

1. Login к https://appstoreconnect.apple.com
2. **My Apps** → **+** → **New App**
3. Configure:
   - **Platform**: iOS
   - **Name**: Rork-Kiku
   - **Primary Language**: Russian
   - **Bundle ID**: com.rork-kiku.app
   - **SKU**: RORK-KIKU-001 (уникальный identifier)
   - **User Access**: Full Access (или ограничить)
4. Create

### 5.2. App Information

**Основная информация:**
- **Name**: Rork-Kiku
- **Subtitle**: Безопасное пространство для детей (макс 30 символов)
- **Category**: 
  - Primary: Parenting (или Social Networking)
  - Secondary: Education

**Contact Information:**
- **Name**: [CONTACT NAME] [PLACEHOLDER]
- **Phone**: [PHONE NUMBER] [PLACEHOLDER]
- **Email**: [CONTACT EMAIL] [PLACEHOLDER]

### 5.3. Age Rating

**ОЧЕНЬ ВАЖНО для детского приложения!**

1. App Store Connect → App Information → Age Rating
2. Select **Edit** для questionnaire
3. Answer questions:
   - **Made for Kids**: YES (4+ или 6+)
   - **Unrestricted Web Access**: NO
   - **User Generated Content**: YES (с moderation)
   - **Shares Location**: NO (или YES if используется)
   - **COPPA Compliance**: YES
4. Age rating result: вероятно **4+** или **9+** (зависит от answers)

**Рекомендация:** Age rating 6+ или 9+ чтобы соответствовать целевой аудитории.

### 5.4. Privacy & Data Use

**App Privacy section** (обязательно для iOS 14+):

1. App Store Connect → App Privacy → Get Started
2. Answer questions about data collection:
   - **Contact Info**: Collected (email для родителей)
   - **User Content**: Collected (photos, videos)
   - **Identifiers**: Collected (device ID для analytics)
   - **Usage Data**: Collected (app usage)
3. For each data type, specify:
   - **Linked to User**: YES (для персональных данных)
   - **Used for Tracking**: NO (мы не используем для ads)
   - **Purpose**: Specify (app functionality, analytics, etc.)
4. Publish

**Key points:**
- Честно указывайте все собранные данные
- Explain purpose для каждого типа
- Emphasize parent control и child safety

---

## Шаг 6: Build и Archive

### 6.1. Prepare for Archive

**Pre-build checklist:**
- [ ] Increment Build number
- [ ] Test на physical device (не только simulator)
- [ ] Run all tests (unit, integration, UI)
- [ ] Check for warnings в Xcode (fix critical ones)
- [ ] Ensure no debug code или test credentials в build
- [ ] Verify entitlements (Push Notifications, etc.)

### 6.2. Create Archive

**In Xcode:**

1. Select target device: **Any iOS Device (arm64)**
2. Product → Archive
3. Ожидайте завершения build (может занять 5-15 минут)
4. Archive появится в Organizer

**Troubleshooting:**
- **Signing errors**: проверьте Provisioning Profile и Certificate
- **Missing entitlements**: добавьте в Signing & Capabilities
- **Build failures**: проверьте error logs в Xcode

### 6.3. Validate Archive

**Before upload:**

1. В Organizer, select Archive
2. Click **Validate App**
3. Choose distribution method: **App Store Connect**
4. Select upload options:
   - **Include bitcode**: YES (recommended)
   - **Upload symbols**: YES (для crash reporting)
   - **Manage Version and Build Number**: автоматически (recommended)
5. Wait для validation (проверяет signing, entitlements, privacy, etc.)
6. If validation successful → proceed to upload
7. If validation fails → fix issues и re-archive

---

## Шаг 7: Upload к App Store Connect

### 7.1. Upload через Xcode

**Manual upload:**

1. В Organizer, select Archive
2. Click **Distribute App**
3. Choose **App Store Connect** → Next
4. Choose **Upload** → Next
5. Select distribution options (аналогично validation)
6. Review рор-up: App, Signing Certificate, Provisioning Profile
7. Click **Upload**
8. Wait (может занять 10-30 минут)
9. Success notification → build доступна в App Store Connect

**Check status:**
- App Store Connect → My Apps → Rork-Kiku → TestFlight
- Новая build появится в "Builds" section
- Status: **Processing** → **Ready to Submit** (может занять 15-60 минут)

### 7.2. Альтернатива: Upload через Fastlane

**Если используется CI/CD (рекомендуется):**

```bash
# Install Fastlane
gem install fastlane

# Setup Fastlane
cd ios/
fastlane init

# Upload to TestFlight
fastlane beta
```

См. `docs/infra/ci_cd.md` для детальных Fastlane инструкций.

### 7.3. Альтернатива: Upload через Transporter

**Apple Transporter app:**

1. Download Transporter от App Store (Mac App Store)
2. Export IPA из Xcode Organizer
3. Drag IPA в Transporter
4. Login с Apple Developer credentials
5. Upload

---

## Шаг 8: TestFlight Setup

### 8.1. Build Review Information

**После upload, в App Store Connect:**

1. TestFlight → Select Build
2. **Test Information**:
   - **What to Test**: Опишите key features для testing
   - **Test Notes**: Инструкции для testers (на русском)
   - **Build Details**: автоматически заполнено
3. **Export Compliance**: 
   - **Uses Encryption**: вероятно YES (HTTPS, TLS)
   - **Export Compliance Documentation**: может потребоваться
4. Save

### 8.2. External Testing Review (опционально для пилота)

**Для external testers (не internal):**

1. TestFlight → External Testing → Create New Group
2. Group Name: "Pilot Testers"
3. Add Build к группе
4. **Automatic Distribution**: ON (новые builds автоматически)
5. Submit для **Beta App Review**:
   - Описание app functionality
   - Test user credentials (если требуется login)
   - Notes для reviewers

**Review timeline:** 24-48 hours обычно

**Важно:** External testing requires Beta App Review каждый раз.

### 8.3. Internal Testing (рекомендуется для pilot)

**Internal Testers** (до 100 users, no review required):

1. TestFlight → Internal Testing → Default Group
2. Add Internal Testers:
   - Enter email addresses
   - Users must have Apple ID
3. Select Build
4. **Distribute Build**
5. Testers получат email с инструкциями

**Преимущества Internal Testing:**
- ✅ No Beta App Review (instant distribution)
- ✅ Up to 100 testers
- ✅ Быстрая итерация

---

## Шаг 9: Добавление Testers

### 9.1. Internal Testers

**Кто может быть Internal Tester:**
- Члены Apple Developer Team (Admin, Developer roles)
- Employees компании

**Добавление:**
1. App Store Connect → Users and Access → Add People
2. Assign role: **App Manager** или **Developer**
3. Invite via email
4. После принятия invite → автоматически доступ к Internal Testing

### 9.2. External Testers

**Кто:**
- Pilot participants (50-100 семей)
- Partners, advisors

**Добавление:**
1. TestFlight → External Testing → Group → Testers → Add
2. Enter email addresses (list или CSV import)
3. Testers получат invite link
4. Install TestFlight app от App Store
5. Redeem invite code

**Лимиты:**
- До 10,000 external testers per app
- TestFlight build expires через 90 дней

---

## Шаг 10: Monitoring TestFlight

### 10.1. Feedback Collection

**TestFlight built-in feedback:**
- Testers могут отправлять screenshots с notes
- Feedback доступен в App Store Connect → TestFlight → Feedback

**Additional channels:**
- Email: testflight@rork-kiku.com [PLACEHOLDER]
- Survey: Google Forms или Typeform
- 1-on-1 interviews

### 10.2. Crash Reports

**В App Store Connect:**
- TestFlight → Crashes
- View crash logs, stack traces
- Integrate с Firebase Crashlytics для more details

### 10.3. Metrics

**Available metrics:**
- Installs
- Sessions
- Crashes
- Feedback submissions

---

## Шаг 11: Updating Builds

### 11.1. New Build Process

**Для каждой new build:**

1. **Increment Build Number**:
   - В Xcode: Target → General → Build
   - Increment: 1 → 2 → 3 (sequential)
   - Version остаётся 1.0.0 (unless major changes)
2. **Test changes** locally
3. **Archive и Upload** (аналогично Шагу 6-7)
4. **Wait для processing**
5. **Distribute** к testers (automatic или manual)

### 11.2. Versioning Strategy

**Semantic Versioning:**
- **Version**: 1.0.0 (MAJOR.MINOR.PATCH)
  - MAJOR: incompatible API changes
  - MINOR: backwards-compatible features
  - PATCH: backwards-compatible bug fixes
- **Build**: 1, 2, 3... (monotonically increasing)

**Example:**
- Version 1.0.0, Build 1 → Initial release
- Version 1.0.0, Build 2 → Bug fix
- Version 1.1.0, Build 3 → New feature
- Version 2.0.0, Build 4 → Major redesign

---

## Варианты загрузки сборки

### Вариант 1: Владелец загружает вручную (рекомендуется для pilot)

**Процесс:**
1. Developer creates Archive в Xcode
2. Export IPA
3. Отправляет владельцу (secure channel)
4. Владелец uploads через Transporter или Xcode

**Pros:**
- ✅ Полный контроль над релизами
- ✅ Минимальные security risks
- ✅ No need для shared credentials

**Cons:**
- ❌ Manual process (slower)
- ❌ Requires владелец доступность

### Вариант 2: Team member с доступом (при наличии)

**Процесс:**
1. Владелец grants App Manager role к trusted team member
2. Team member uploads builds

**Security:**
- ✅ Use 2FA для Apple ID
- ✅ Limit permissions (App Manager, не Account Holder)
- ✅ Regular access audits

### Вариант 3: CI/CD (Fastlane + GitHub Actions)

**Процесс:**
1. Setup Fastlane для automated builds
2. Store Apple credentials в GitHub Secrets
3. GitHub Actions workflow triggers на push к main/release branch
4. Automated build, sign, upload

**Security:**
- ✅ Use App Store Connect API Key (не password)
- ✅ Store в GitHub Secrets (encrypted)
- ✅ Never commit credentials к code

**См. `docs/infra/ci_cd.md` для setup инструкций.**

---

## Безопасная загрузка credentials

### ⚠️ КРИТИЧЕСКИ ВАЖНО ⚠️

**НИКОГДА НЕ ДОБАВЛЯЙТЕ В КОД:**
- ❌ Apple ID password
- ❌ Certificates (.p12 files)
- ❌ Provisioning Profiles
- ❌ API Keys
- ❌ App Store Connect credentials

### Рекомендуемые методы хранения:

#### 1. GitHub Secrets (для CI/CD)

```yaml
# В GitHub repository → Settings → Secrets and variables → Actions
Secrets:
  APPLE_ID: your-apple-id@example.com
  APPLE_APP_SPECIFIC_PASSWORD: xxxx-xxxx-xxxx-xxxx
  APPLE_TEAM_ID: ABCD1234
  MATCH_PASSWORD: your-match-password
  CERTIFICATES_P12_BASE64: <base64-encoded-p12>
```

#### 2. HashiCorp Vault

```bash
# Store credentials
vault kv put secret/apple \
  apple_id="your-apple-id@example.com" \
  app_specific_password="xxxx-xxxx-xxxx-xxxx"

# Retrieve в CI/CD
vault kv get -field=apple_id secret/apple
```

#### 3. AWS Secrets Manager

```bash
# Store credentials
aws secretsmanager create-secret \
  --name apple-developer-credentials \
  --secret-string '{"apple_id":"...","password":"..."}'

# Retrieve в CI/CD
aws secretsmanager get-secret-value --secret-id apple-developer-credentials
```

#### 4. Local secure storage (для manual uploads)

- **Keychain Access** (Mac): храните passwords безопасно
- **1Password / LastPass**: для team sharing (encrypted vaults)
- **Never share** через email, Slack, или unsecured channels

---

## Troubleshooting

### Common Issues

**1. "No valid signing identity found"**
- **Причина**: Certificate не installed или expired
- **Fix**: Download и install Distribution Certificate

**2. "Provisioning profile doesn't include signing certificate"**
- **Причина**: Profile создан с другим certificate
- **Fix**: Regenerate Provisioning Profile с correct certificate

**3. "App Store Connect upload failed"**
- **Причина**: Network issue, invalid credentials, или build issue
- **Fix**: Проверьте network, credentials, validate archive снова

**4. "Build processing takes too long"**
- **Причина**: Apple backend delays (нормально)
- **Fix**: Wait (может занять до 1 часа, обычно 15-30 минут)

**5. "Beta App Review rejected"**
- **Причина**: Policy violation, missing information
- **Fix**: Address feedback от Apple, resubmit

---

## Checklist перед первым TestFlight

- [ ] Apple Developer Account активен
- [ ] App ID создан (com.rork-kiku.app)
- [ ] Distribution Certificate создан и installed
- [ ] Provisioning Profile создан и installed
- [ ] Xcode project configured (Bundle ID, Signing)
- [ ] App в App Store Connect создан
- [ ] Age Rating установлен (4+ или 6+)
- [ ] Privacy Disclosures заполнены
- [ ] Build tested на physical device
- [ ] Archive created successfully
- [ ] Archive validated successfully
- [ ] Build uploaded к App Store Connect
- [ ] Build status: Ready to Submit
- [ ] Test Information заполнено
- [ ] Internal Testers added
- [ ] Distribution начато

---

## Полезные ресурсы

**Apple Documentation:**
- [App Store Connect Guide](https://developer.apple.com/app-store-connect/)
- [TestFlight Documentation](https://developer.apple.com/testflight/)
- [Code Signing Guide](https://developer.apple.com/support/code-signing/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

**Third-party Tools:**
- [Fastlane](https://fastlane.tools/)
- [GitHub Actions for iOS](https://github.com/features/actions)
- [Firebase App Distribution](https://firebase.google.com/products/app-distribution) (альтернатива TestFlight)

---

**Примечание:** Apple Developer доступ временно отсутствует. Эти инструкции готовы для использования, когда доступ будет предоставлен. Все credentials должны храниться в GitHub Secrets, HashiCorp Vault, или AWS Secrets Manager — никогда не в коде.

**Contact:** Если у вас вопросы по TestFlight setup, contact [TEAM EMAIL] [PLACEHOLDER].
