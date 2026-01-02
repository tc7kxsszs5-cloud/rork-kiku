# TestFlight Instructions — kiku

## Обзор

Этот документ описывает процесс подготовки iOS приложения для TestFlight beta testing и дальнейшей публикации в App Store.

---

## Требования

### 1. Apple Developer Account

**Необходимо:**
- Apple Developer Program membership ($99/год)
- Admin access к Apple Developer account
- Access к App Store Connect

**Регистрация:**
1. Перейти на [developer.apple.com](https://developer.apple.com/programs/)
2. Записаться (Sign up)
3. Заполнить информацию о компании
4. Оплатить $99/год
5. Дождаться approval (обычно 24-48 часов)

### 2. Expo Account

**Необходимо:**
- Expo account (бесплатный или платный для EAS Build)
- EAS CLI установлен

```bash
# Установить EAS CLI
npm install -g eas-cli

# Или
bun install -g eas-cli

# Login
eas login
```

### 3. Локальные инструменты

**Опционально (для local builds):**
- Xcode 14+ (только на macOS)
- CocoaPods (`sudo gem install cocoapods`)

---

## Шаг 1: Настройка проекта

### 1.1 App ID и Bundle Identifier

**В Expo:**
```json
// app.json
{
  "expo": {
    "name": "kiku",
    "slug": "kiku",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.kiku.app",
      "buildNumber": "1",
      "supportsTablet": false
    }
  }
}
```

**В Apple Developer:**
1. Перейти на [developer.apple.com/account/resources/identifiers](https://developer.apple.com/account/resources/identifiers/list)
2. Создать новый App ID:
   - Name: kiku
   - Bundle ID: `com.kiku.app` (explicit, не wildcard)
   - Capabilities: Push Notifications, Sign in with Apple (если нужны)
3. Save

### 1.2 Provisioning Profiles

**EAS автоматически управляет provisioning profiles**, но если нужно вручную:

1. Certificates, Identifiers & Profiles → Profiles
2. Create new Profile:
   - Type: App Store (для production) или Ad Hoc (для internal testing)
   - App ID: `com.kiku.app`
   - Certificate: Your distribution certificate
3. Download и установить (двойной клик)

### 1.3 App Store Connect Setup

1. Перейти на [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. My Apps → + → New App
3. Заполнить:
   - **Platform:** iOS
   - **Name:** kiku - Защита детей
   - **Primary Language:** Russian
   - **Bundle ID:** `com.kiku.app`
   - **SKU:** KIKU-001 (internal identifier)
   - **User Access:** Full Access
4. Create

---

## Шаг 2: Конфигурация EAS Build

### 2.1 Инициализация EAS

```bash
cd /path/to/rork-kiku

# Configure EAS
eas build:configure
```

Это создаст файл `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "default"
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
        "resourceClass": "default"
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

**Заполнить placeholders:**
- `[APPLE_ID_EMAIL]` — ваш Apple ID email
- `[APP_STORE_CONNECT_APP_ID]` — ID приложения в App Store Connect (найти в App Information)
- `[APPLE_TEAM_ID]` — Team ID (найти в Apple Developer → Membership)

### 2.2 Credentials Management

**Опция 1: EAS Managed (рекомендуется для начинающих)**

EAS автоматически создаст и управляет certificates и profiles:

```bash
eas build --platform ios --profile production
```

При первом запуске EAS спросит:
- Создать новый Distribution Certificate? → Yes
- Создать новый Provisioning Profile? → Yes

**Опция 2: Manual (если хотите контролировать credentials)**

```bash
# Configure credentials
eas credentials
```

Выбрать:
- iOS → Distribution Certificate → Upload existing or Create new
- iOS → Provisioning Profile → Upload existing or Create new

---

## Шаг 3: Подготовка метаданных

### 3.1 App Information (в App Store Connect)

**General Information:**
- **App Name:** kiku - Защита детей
- **Subtitle:** (опционально, до 30 символов)
- **Category:** Primary: Utilities, Secondary: Education

**Age Rating:**
1. App Store Connect → App Information → Age Rating → Edit
2. Ответить на вопросы:
   - Made for Kids? **NO** (это родительское приложение)
   - Unrestricted Web Access? NO
   - Содержит ли контент для взрослых? NO
3. Результат должен быть: **4+** (или 12+ в зависимости от ответов)

### 3.2 Privacy Information

**App Privacy (обязательно для App Store):**

1. App Store Connect → App Privacy
2. Get Started
3. Заполнить:

**Data Types Collected:**
- **Contact Info:**
  - ✅ Name (родителя)
  - ✅ Email Address (родителя)
  - ✅ Phone Number (опционально, для SMS alerts)
  
- **User Content:**
  - ✅ Messages (для AI-анализа)
  - ✅ Photos (если image analysis enabled)
  - ✅ Audio Data (если voice message analysis enabled)
  
- **Location:**
  - ✅ Precise Location (только для SOS feature)

**Purpose:**
- Child Safety Monitoring
- Product Personalization
- App Functionality

**Linked to User?** YES

**Used for Tracking?** NO

**Save and Publish**

### 3.3 App Store Description

**Description (4000 characters max):**

```
kiku — умный ассистент для родителей, который защищает детей в цифровых мессенджерах 24/7.

🛡️ ЧТО ДЕЛАЕТ KIKU?

• AI-АНАЛИЗ СООБЩЕНИЙ
Автоматический мониторинг всех сообщений ребенка с использованием искусственного интеллекта. Обнаружение: кибербуллинга, насилия, сексуального контента, мошенничества, призывов к самоповреждению.

• УМНЫЕ УВЕДОМЛЕНИЯ
Родители получают алерты только о реальных угрозах. 5-уровневая система оценки рисков с объяснением AI, почему сообщение опасно.

• SOS КНОПКА
Ребенок может экстренно вызвать помощь одним нажатием. Родители получают геолокацию и мгновенное уведомление.

• РОДИТЕЛЬСКИЙ КОНТРОЛЬ
Настройка временных ограничений, лимитов использования, белого списка контактов, блокировка неизвестных собеседников.

• СТАТИСТИКА БЕЗОПАСНОСТИ
Детальная аналитика рисков и активности ребенка с рекомендациями по защите.

✅ БЕЗОПАСНОСТЬ И ПРИВАТНОСТЬ

• Локальное хранилище данных
• Шифрование end-to-end
• COPPA/GDPR compliance
• Нет рекламы для детей
• Родительское согласие обязательно

🎯 ДЛЯ КОГО?

kiku предназначен для родителей детей 8-17 лет, которые хотят защитить своих детей в цифровом мире, не нарушая их приватность.

📊 ПОЧЕМУ KIKU?

• 95% подростков используют смартфоны ежедневно
• 42% детей сталкиваются с кибербуллингом
• 1 из 5 получает нежелательные сексуальные сообщения
• 70% родителей беспокоятся о безопасности детей онлайн

kiku дает родителям спокойствие и детям защиту.

💰 ЦЕНООБРАЗОВАНИЕ

• FREE: Базовый функционал (до 100 сообщений/месяц)
• BASIC: $4.99/месяц — безлимитный AI-анализ
• PREMIUM: $9.99/месяц — анализ изображений, аудио, до 3 детей

🔗 ПОДДЕРЖКА

Вопросы? support@kiku-app.com
Сайт: www.kiku-app.com

---

⚠️ ВАЖНО: kiku — инструмент для родительского контроля, требующий согласия родителя перед использованием. Мы соблюдаем все законы о защите данных детей (COPPA/GDPR).
```

**Keywords (100 characters max):**
```
parental control,child safety,cyberbullying,AI monitoring,family safety,kids protection
```

**Promotional Text (170 characters, опционально):**
```
Защитите своего ребенка от киберугроз с помощью AI. Умные алерты, SOS кнопка, родительский контроль. Попробуйте бесплатно!
```

### 3.4 Screenshots

**Требования:**
- iPhone 6.7" display (iPhone 14 Pro Max, 15 Pro Max): 1290 x 2796 px
- iPhone 6.5" display (iPhone 11 Pro Max, XS Max): 1242 x 2688 px
- Минимум 3 screenshots, максимум 10

**Рекомендуемые screenshots:**
1. Home screen (список чатов с индикаторами риска)
2. Alerts screen (активные уведомления)
3. Chat detail (просмотр сообщений)
4. Parental Controls (настройки)
5. Statistics (графики безопасности)

**Как создать:**
- Использовать iOS Simulator в Xcode
- Или использовать сервис типа [AppMockUp](https://appmockup.com/)
- Добавить captions (подписи) к каждому screenshot

---

## Шаг 4: Build для TestFlight

### 4.1 Локальный build (для теста)

```bash
# Preview build (для тестирования)
eas build --platform ios --profile preview --local
```

Это создаст `.ipa` файл локально (не загружает в App Store Connect).

### 4.2 Production build для TestFlight

```bash
# Production build (загрузит в App Store Connect)
eas build --platform ios --profile production
```

**Процесс:**
1. EAS загружает код на Expo servers
2. Build происходит на удаленных серверах (обычно 15-30 минут)
3. `.ipa` автоматически загружается в App Store Connect
4. Вы получите email когда build готов

**Мониторинг:**
- Посмотреть статус: `eas build:list`
- Или на [expo.dev](https://expo.dev/) → Projects → kiku → Builds

### 4.3 Автоматический submit в TestFlight (опционально)

```bash
# Build и сразу submit в TestFlight
eas build --platform ios --profile production --auto-submit
```

Или отдельно после build:

```bash
eas submit --platform ios --latest
```

---

## Шаг 5: TestFlight Setup

### 5.1 В App Store Connect

1. Перейти на [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. My Apps → kiku → TestFlight
3. Дождаться processing (обычно 10-30 минут после upload)
4. Когда status "Ready to Submit" → заполнить:
   - **Test Information:**
     - Beta App Description: Краткое описание для testers
     - Feedback Email: [FOUNDERS_EMAIL]
     - What to Test: "Тестируем основные функции: AI-анализ, алерты, SOS"
   - **Export Compliance:**
     - Uses Encryption? YES (HTTPS)
     - Exempt from export compliance? YES (standard encryption)

### 5.2 Internal Testing (опционально)

**Для команды (до 100 человек):**
1. TestFlight → Internal Testing → Add Internal Testers
2. Выбрать users с access к App Store Connect
3. Они получат email invite
4. Скачать TestFlight app → Install kiku

### 5.3 External Testing (для пилота)

**Для внешних testers (до 10,000 человек):**

1. TestFlight → External Testing → Create New Group
2. Заполнить:
   - **Group Name:** Pilot Q1 2024
   - **Public Link:** Включить (optional, для easy distribution)
3. Add Build (выбрать последний build)
4. Submit for Review (Apple reviews в течение 24-48 часов)
5. После approval:
   - Add Testers (по email)
   - Или поделиться Public Link

**Public Link example:**
```
https://testflight.apple.com/join/ABC123XYZ
```

Отправить этот link участникам пилота.

### 5.4 Invite Testers

**Email invite (через App Store Connect):**
1. External Testing → Group → Testers → Add
2. Ввести email addresses (по одному на строку)
3. Send Invites

**Public Link (проще для массовой рассылки):**
1. Включить Public Link в настройках группы
2. Скопировать link
3. Отправить участникам (email, Telegram, etc.)

**Testers получат:**
- Email с invite link
- Инструкции по установке TestFlight app
- Ссылка на установку kiku

---

## Шаг 6: Monitoring и Feedback

### 6.1 TestFlight Analytics

**В App Store Connect:**
- TestFlight → Testers → View metrics
- **Metrics:**
  - Invites sent / Accepted
  - Installs
  - Sessions
  - Crashes
  - Feedback

### 6.2 Crash Reports

**Expo Crashlytics (если интегрирован):**
```bash
# Install Sentry or Crashlytics
npm install @sentry/react-native

# Or built-in Expo crash reporting
eas update:configure
```

**Apple Crash Reports:**
- App Store Connect → TestFlight → Crashes
- Download crash logs для анализа

### 6.3 User Feedback

**TestFlight Feedback:**
- Testers могут отправить feedback через TestFlight app (shake device → Send Feedback)
- Вы получите screenshots и logs

**External Feedback:**
- Email: pilot@kiku-app.com
- Telegram group для pilot participants
- In-app feedback форма

---

## Шаг 7: Iterate и Update

### 7.1 Новая версия

```bash
# Update version в app.json
{
  "expo": {
    "version": "1.0.1", // Increment
    "ios": {
      "buildNumber": "2" // Increment
    }
  }
}

# Build новая версия
eas build --platform ios --profile production --auto-submit
```

### 7.2 Over-the-Air Updates (для minor fixes)

**Expo Updates (для JS changes, без rebuild):**
```bash
# Publish update
eas update --branch production --message "Fix bug in chat screen"
```

Пользователи получат update при следующем открытии приложения.

**Когда НЕ работает OTA:**
- Native code changes (Swift, Objective-C)
- Dependencies changes (CocoaPods)
- Expo SDK upgrade

---

## Шаг 8: Production Release (после пилота)

### 8.1 Подготовка к App Store

1. App Store Connect → App Store → Prepare for Submission
2. Заполнить всё (см. раздел 3.3 выше)
3. Add Build (последний TestFlight build)
4. Pricing: Free (с in-app purchases)
5. App Review Information:
   - Demo Account (если нужен)
   - Contact: [FOUNDERS_EMAIL]
   - Notes: "This app requires parental consent for children under 13"
6. Submit for Review

### 8.2 App Review Process

**Timeline:** 1-3 дня (обычно)

**Common rejection reasons:**
- Missing privacy policy
- Неясное описание app functionality
- Требуется demo account
- Age rating неправильный
- Privacy disclosures неполные

**Если rejected:**
- Read rejection reason carefully
- Fix issues
- Resubmit

### 8.3 Release

**После approval:**
- Status → "Ready for Sale"
- Выбрать:
  - **Automatic Release:** Сразу после approval
  - **Manual Release:** Вы нажимаете "Release" когда готовы

---

## Fastlane (альтернатива EAS Submit)

### Установка

```bash
# Install Fastlane
sudo gem install fastlane -NV

# Or with Homebrew
brew install fastlane

# Initialize
cd ios
fastlane init
```

### Fastfile Example

```ruby
# ios/fastlane/Fastfile

default_platform(:ios)

platform :ios do
  desc "Push a new beta build to TestFlight"
  lane :beta do
    # Increment build number
    increment_build_number(xcodeproj: "kiku.xcodeproj")
    
    # Build
    build_app(
      scheme: "kiku",
      export_method: "app-store"
    )
    
    # Upload to TestFlight
    upload_to_testflight(
      skip_waiting_for_build_processing: true
    )
  end
  
  desc "Release to App Store"
  lane :release do
    build_app(scheme: "kiku")
    upload_to_app_store
  end
end
```

### Использование

```bash
# TestFlight upload
fastlane beta

# App Store release
fastlane release
```

---

## GitHub Actions CI/CD

### Workflow Example

```yaml
# .github/workflows/ios-build.yml

name: iOS Build & TestFlight

on:
  push:
    branches: [main, release/**]
  workflow_dispatch: # Manual trigger

jobs:
  build:
    runs-on: macos-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Build iOS app
        run: eas build --platform ios --profile production --non-interactive --no-wait
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
      
      # Optional: Submit to TestFlight
      - name: Submit to TestFlight
        if: github.ref == 'refs/heads/main'
        run: eas submit --platform ios --latest --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          EXPO_APPLE_ID: ${{ secrets.APPLE_ID }}
          EXPO_APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
```

### GitHub Secrets Setup

**Требуемые secrets (Settings → Secrets → Actions):**

1. **EXPO_TOKEN** (обязательно)
   - Получить: `eas whoami` → expo.dev → Settings → Access Tokens
   
2. **APPLE_ID** (для auto-submit)
   - Ваш Apple ID email
   
3. **APPLE_APP_SPECIFIC_PASSWORD** (для auto-submit)
   - Получить: [appleid.apple.com](https://appleid.apple.com/) → Security → App-Specific Passwords → Generate

4. **APPLE_API_KEY_JSON** (альтернатива APPLE_APP_SPECIFIC_PASSWORD, рекомендуется)
   ```json
   {
     "key_id": "ABC123DEF4",
     "issuer_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
     "key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
   }
   ```

**Получить Apple API Key:**
1. [App Store Connect → Users and Access → Keys](https://appstoreconnect.apple.com/access/api)
2. Generate API Key
3. Download `.p8` file
4. Create JSON с key_id, issuer_id, и содержимым `.p8`
5. Store JSON as `APPLE_API_KEY_JSON` secret

---

## Troubleshooting

### Build Errors

**Error: "Certificate not found"**
```bash
# Re-configure credentials
eas credentials

# Or delete and recreate
eas credentials:delete
eas build --platform ios --profile production
```

**Error: "Provisioning profile expired"**
- EAS автоматически обновит при следующем build
- Или manually update в Apple Developer

**Error: "Build failed with exit code 65"**
- Check build logs в Expo dashboard
- Обычно проблема с native dependencies

### TestFlight Errors

**"Missing compliance"**
- Заполнить Export Compliance в TestFlight → Test Information

**"Missing privacy info"**
- Добавить App Privacy в App Store Connect

**"Binary rejected"**
- Read email от Apple с причиной
- Fix и resubmit

### Секреты не работают в CI

```bash
# Verify secrets
echo "$EXPO_TOKEN" # Should print token (locally only!)

# Re-generate EXPO_TOKEN if expired
eas login
eas whoami
```

---

## Resources

**Official Docs:**
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Expo Submit](https://docs.expo.dev/submit/introduction/)
- [Apple TestFlight](https://developer.apple.com/testflight/)
- [App Store Connect](https://appstoreconnect.apple.com/)

**Guides:**
- [Expo iOS Guide](https://docs.expo.dev/guides/ios/)
- [Fastlane iOS Guide](https://docs.fastlane.tools/getting-started/ios/setup/)

**Support:**
- Expo Discord: [expo.dev/discord](https://expo.dev/discord)
- Stack Overflow: Tag `expo` и `react-native`

---

## Контакты

**Вопросы по TestFlight:**
- Email: [FOUNDERS_EMAIL]
- Support: support@kiku-app.com

**⚠️ ВАЖНО:** Этот документ предполагает, что у вас есть Apple Developer account. Если нет, пожалуйста, зарегистрируйтесь на [developer.apple.com](https://developer.apple.com/programs/) перед началом.

**Статус:** Инструкции для команды  
**Последнее обновление:** Январь 2024
