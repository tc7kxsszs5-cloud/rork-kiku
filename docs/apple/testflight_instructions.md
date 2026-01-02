# Инструкции по подготовке iOS сборки для TestFlight

## Обзор

Подробное руководство по подготовке, сборке и публикации iOS приложения kiku в TestFlight для пилотного тестирования.

## Предварительные требования

### 1. Apple Developer Account

**Необходимо:**
- ✅ Apple Developer Program membership ($99/год)
- ✅ Доступ к App Store Connect
- ✅ Права Admin или App Manager

**Регистрация:**
1. Перейти на https://developer.apple.com/programs/
2. Sign up for Apple Developer Program
3. Выбрать тип аккаунта: Individual или Organization
4. Оплатить $99
5. Дождаться подтверждения (1-2 дня)

### 2. Expo Account

**Необходимо:**
- ✅ Бесплатный Expo account
- ✅ EAS CLI установлен локально

**Регистрация:**
```bash
# Создать аккаунт
npm install -g @expo/eas-cli
eas login
# или
eas register
```

### 3. Локальная среда разработки

**macOS (рекомендуется для iOS):**
- Xcode 15+ (для preview и debugging)
- Node.js 18+
- Bun (или npm/yarn)

**Windows/Linux (возможно через EAS):**
- Node.js 18+
- Bun
- Не требуется macOS благодаря EAS Build в облаке

## Шаг 1: Настройка App Store Connect

### 1.1 Создание App ID

1. Перейти на https://developer.apple.com/account/
2. Certificates, IDs & Profiles → Identifiers
3. Click "+" для создания нового App ID
4. Выбрать "App IDs"
5. Заполнить информацию:

```
Description: kiku Child Safety App
Bundle ID: Explicit
Bundle ID: com.kikuapp.kiku (пример, выберите свой уникальный)

Capabilities (включить):
✅ Push Notifications
✅ Background Modes
✅ Location (для SOS)
✅ App Groups (если планируется)
✅ Sign in with Apple (опционально)
```

6. Click "Continue" → "Register"

### 1.2 Создание App в App Store Connect

1. Перейти на https://appstoreconnect.apple.com
2. My Apps → "+" → New App
3. Заполнить информацию:

```
Platform: iOS
Name: kiku
Primary Language: Russian
Bundle ID: com.kikuapp.kiku (выбрать созданный ранее)
SKU: KIKU001 (уникальный ID для внутреннего использования)
User Access: Full Access
```

4. Click "Create"

### 1.3 Настройка App Information

**App Information:**
```
Name: kiku
Subtitle: AI-Powered Child Safety Monitor (max 30 символов)
Category:
  Primary: Parental Control
  Secondary: Education

Content Rights:
  ☑ Contains Third-Party Content
  
Age Rating: (важно для детских приложений!)
  - Click "Edit"
  - Заполнить анкету:
    • Made for Kids: No (приложение для родителей)
    • Ориентировано на детей младше 13 лет: No
    • Требуется parental gate: No (так как для родителей)
  
Privacy Policy URL: https://kiku-app.com/privacy
  (⚠️ ОБЯЗАТЕЛЬНО для детских приложений)
  
User Privacy Choices URL: (optional)
  https://kiku-app.com/privacy-choices
```

### 1.4 Подготовка Privacy Policy

**Требования:**
- Описать какие данные собираются
- Как используются данные
- Соответствие COPPA для детских данных
- Права пользователей (доступ, удаление, экспорт)
- Контактная информация

**Разместить:**
- На отдельной странице вашего сайта
- Доступна без регистрации
- URL должен быть HTTPS

**Пример структуры:** См. `/docs/legal/privacy_policy_draft.md`

## Шаг 2: Настройка проекта Expo

### 2.1 Обновление app.json/app.config.js

```json
{
  "expo": {
    "name": "kiku",
    "slug": "kiku",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "kiku",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.kikuapp.kiku",
      "buildNumber": "1",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "kiku использует вашу геолокацию для функции экстренного SOS.",
        "NSCameraUsageDescription": "kiku нужен доступ к камере для загрузки фотографий в чаты.",
        "NSPhotoLibraryUsageDescription": "kiku нужен доступ к фото для загрузки изображений в чаты.",
        "NSMicrophoneUsageDescription": "kiku нужен доступ к микрофону для записи голосовых сообщений.",
        "NSFaceIDUsageDescription": "kiku использует Face ID для быстрого входа в приложение."
      },
      "associatedDomains": [
        "applinks:kiku-app.com"
      ],
      "usesAppleSignIn": false
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.kikuapp.kiku"
    },
    "plugins": [
      "expo-router",
      "expo-secure-store",
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "kiku использует вашу геолокацию для функции экстренного SOS."
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "kiku нужен доступ к фото для загрузки изображений."
        }
      ]
    ],
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "your-project-id-here"
      }
    },
    "owner": "your-expo-username"
  }
}
```

### 2.2 Настройка EAS Build

**Файл:** `eas.json`

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
        "simulator": true,
        "resourceClass": "m-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false,
        "resourceClass": "m-medium"
      }
    },
    "production": {
      "ios": {
        "simulator": false,
        "resourceClass": "m-medium",
        "buildConfiguration": "Release"
      },
      "channel": "production"
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDEFGHIJ"
      }
    }
  }
}
```

**Как узнать значения:**
```bash
# ascAppId - из App Store Connect URL
# https://appstoreconnect.apple.com/apps/[ascAppId]/appstore

# appleTeamId - из Apple Developer
# https://developer.apple.com/account/ → Membership → Team ID
```

## Шаг 3: Подготовка ассетов

### 3.1 App Icon

**Требования:**
- Размер: 1024x1024 px
- Формат: PNG (без прозрачности)
- Не должен содержать: alpha channel, rounded corners, text "Beta"
- Рекомендуется: простой, узнаваемый дизайн

**Генерация всех размеров:**
```bash
# Expo автоматически создаст все необходимые размеры
# из вашего icon.png (1024x1024)

# Или используйте онлайн-сервисы:
# - https://www.appicon.co/
# - https://makeappicon.com/
```

**Файл:** `./assets/images/icon.png`

### 3.2 Splash Screen

**Требования:**
- Рекомендуемый размер: 1284x2778 px (iPhone 13 Pro Max)
- Формат: PNG
- Минималистичный дизайн (показывается при запуске)

**Файл:** `./assets/images/splash.png`

### 3.3 Screenshots для App Store

**Обязательные размеры:**
```
6.7" Display (iPhone 14 Pro Max):
  - 1290 x 2796 px (3-8 screenshots)

6.5" Display (iPhone 11 Pro Max):
  - 1242 x 2688 px (3-8 screenshots)

5.5" Display (iPhone 8 Plus) - optional:
  - 1242 x 2208 px
```

**Содержание screenshots:**
1. Onboarding экран (показать value proposition)
2. Dashboard с алертами
3. Chat monitoring view
4. Parental controls
5. Statistics/Analytics
6. SOS feature (если возможно без sensitive content)

**Инструменты для создания:**
- Xcode Simulator + Command+S
- https://www.screely.com/ (добавить device frames)
- Figma/Sketch для mockups

### 3.4 App Preview Video (опционально, но рекомендуется)

**Требования:**
- Длительность: 15-30 секунд
- Размер: 6.7" или 6.5" display
- Формат: M4V, MP4, или MOV
- No audio OR localized audio

**Содержание:**
- Показать core features (5-7 секунд на feature)
- Highlight unique value proposition
- Демонстрация в реальном использовании

## Шаг 4: Сборка приложения

### Вариант A: С доступом к Apple Developer Account

**Рекомендуется:** Если у вас есть доступ к Apple Developer Account

#### 4.1 Локальная конфигурация

```bash
# 1. Установить EAS CLI
npm install -g @expo/eas-cli

# 2. Login в Expo
eas login

# 3. Configure проект
eas build:configure

# 4. Связать с Apple Developer Account
eas device:create
# Следуйте инструкциям для регистрации устройств
```

#### 4.2 Создание сборки

```bash
# Production сборка для TestFlight
eas build --platform ios --profile production

# Выбрать:
# - Apple ID
# - Apple Team ID
# - Generate new credentials? Yes (first time)

# EAS создаст:
# - Distribution Certificate
# - Provisioning Profile
# - Push Notification Key

# Ожидать завершения сборки (15-30 минут)
```

**Отслеживание сборки:**
- Web dashboard: https://expo.dev/accounts/[your-account]/projects/kiku/builds
- CLI: `eas build:list`

#### 4.3 Загрузка в TestFlight

**Автоматически (рекомендуется):**
```bash
eas submit --platform ios --latest

# Потребуется:
# - Apple ID
# - App-Specific Password (см. раздел Credentials)
```

**Вручную:**
1. Скачать .ipa файл из EAS dashboard
2. Открыть Transporter app (macOS)
3. Drag & drop .ipa файл
4. Click "Deliver"

### Вариант B: Без прямого доступа (через владельца)

**Если владелец репозитория будет загружать сам:**

#### 4.1 Подготовить инструкции для владельца

**Документ:** `OWNER_BUILD_INSTRUCTIONS.md`

```markdown
# Инструкции для владельца Apple Developer Account

## Шаг 1: Создать App в App Store Connect
1. Перейти https://appstoreconnect.apple.com
2. My Apps → "+" → New App
3. Bundle ID: com.kikuapp.kiku
4. Name: kiku
5. Primary Language: Russian

## Шаг 2: Предоставить доступ команде разработки

Option A - Предоставить App Manager доступ:
1. Users and Access → "+"
2. Email: developer@example.com
3. Role: App Manager
4. Apps: kiku

Option B - Предоставить API Key (рекомендуется):
1. Users and Access → Keys tab
2. Generate API Key
3. Key Name: "kiku CI/CD"
4. Access: App Manager
5. Download .p8 файл
6. Передать команде:
   - Key ID
   - Issuer ID
   - .p8 файл (safely!)

## Шаг 3: Создать App Store Connect API Key для CI/CD

[Следуйте инструкциям выше]

## Шаг 4: TestFlight Internal Testing

1. App Store Connect → My Apps → kiku
2. TestFlight tab
3. Internal Testing → "+" группа
4. Добавить internal testers (email addresses)
5. После загрузки билда → автоматически доступен тестерам
```

#### 4.2 GitHub Actions для автоматической загрузки

**Владельцу нужно добавить GitHub Secrets:**
```bash
# Repository Settings → Secrets → Actions

EXPO_TOKEN=<expo-access-token>
APPLE_API_KEY_JSON=<json-with-key-id-issuer-key>
```

**Команда:** Trigger GitHub Actions workflow manually

## Шаг 5: Настройка TestFlight

### 5.1 Internal Testing (сначала)

**App Store Connect → TestFlight:**

1. **Create Internal Testing Group:**
   ```
   Group Name: kiku Internal Team
   
   Add Internal Testers:
   - Engineering team (max 100)
   - Product team
   - QA team
   
   Builds: Автоматически доступны после загрузки
   ```

2. **Test Information:**
   ```
   What to Test:
   "Пожалуйста, протестируйте основной flow:
   1. Регистрация и создание профиля ребенка
   2. Добавление тестового чата
   3. AI анализ сообщений
   4. Просмотр алертов
   5. Настройки родительского контроля
   6. SOS функция (в безопасном окружении)
   
   Обращайте внимание на:
   - Производительность
   - UI/UX issues
   - Crashes
   - Неточности AI модерации"
   
   Feedback Email: feedback@kiku-app.com
   ```

**Internal testing:** Не требует App Review, доступно сразу после загрузки

### 5.2 External Testing (для пилота)

**После успешного internal testing:**

1. **Create External Testing Group:**
   ```
   Group Name: kiku Pilot Program
   
   Add External Testers:
   - До 10,000 внешних тестеров
   - Email приглашения
   - Public link (опционально)
   
   ⚠️ Требуется Beta App Review (1-2 дня)
   ```

2. **Beta App Review Information:**
   ```
   Beta App Description:
   "kiku - это AI-powered приложение для родительского мониторинга 
   безопасности детских чатов. Приложение использует искусственный 
   интеллект для обнаружения потенциально опасного контента (буллинг, 
   груминг, мошенничество) и уведомления родителей в реальном времени.
   
   Основные функции:
   - AI анализ текстовых сообщений и изображений
   - Родительская панель управления
   - Система алертов
   - SOS кнопка для экстренных ситуаций
   - Соответствие COPPA и GDPR"
   
   Beta App Review Notes:
   "Для тестирования используйте:
   Email: demo@kiku-app.com
   Password: TestDemo123
   
   Тестовые сценарии доступны в приложении в разделе About.
   
   Privacy Policy: https://kiku-app.com/privacy
   
   Все AI функции работают в безопасном test mode.
   Никакие реальные детские данные не используются в тестировании."
   
   Contact Information:
   First Name: [Your Name]
   Last Name: [Your Last Name]
   Phone: +X-XXX-XXX-XXXX
   Email: support@kiku-app.com
   ```

3. **Export Compliance:**
   ```
   Does your app use encryption? Yes
   
   Is your app exempt from export compliance? Yes
   (для большинства стандартных приложений с HTTPS)
   
   Если нет - потребуется:
   - CCATS classification или
   - Self-classification report
   ```

4. **Submit для Beta Review:**
   - Click "Submit for Review"
   - Ожидать 1-2 рабочих дня
   - Следить за статусом в TestFlight tab

## Шаг 6: Распространение TestFlight

### 6.1 Для Internal Testers

**Автоматически после загрузки билда:**
- Email с invite link
- Install TestFlight app из App Store
- Open link → Accept invite → Install app

### 6.2 Для External Testers (Pilot)

**Способ 1: Email invites**
```
1. TestFlight → External Testing → Add Testers
2. Ввести email addresses
3. Отправить приглашения
4. Тестеры получают email с instructions
```

**Способ 2: Public Link**
```
1. TestFlight → External Testing → Public Link
2. Enable Public Link
3. Copy link: https://testflight.apple.com/join/XXXXXXXX
4. Распространить link (email, сайт, соц. сети)
5. Любой может присоединиться (до лимита)
```

**Рекомендуемое сообщение пилотным пользователям:**

```
Тема: Приглашение в пилотную программу kiku

Уважаемые родители,

Мы рады пригласить вас в пилотную программу kiku - инновационного 
приложения для защиты детей в цифровой среде.

Как присоединиться:
1. Установите TestFlight из App Store (бесплатно)
2. Перейдите по ссылке: https://testflight.apple.com/join/XXXXXXXX
3. Нажмите "Accept" и установите kiku
4. Следуйте onboarding инструкциям

Важно:
• Это пилотная версия для тестирования
• Ваш feedback критически важен для нас
• Все данные защищены и зашифрованы
• Вы можете отписаться в любой момент

Длительность пилота: 8-12 недель
Feedback: feedback@kiku-app.com

Благодарим за участие!
Команда kiku
```

### 6.3 Мониторинг Feedback

**TestFlight Feedback:**
- Crashes автоматически собираются
- Screenshots от тестеров
- Текстовый feedback

**App Store Connect → TestFlight → Feedback:**
- Review всех feedback еженедельно
- Prioritize critical bugs
- Respond to users (если возможно)

## Шаг 7: Итерации и обновления

### 7.1 Выпуск новой версии

```bash
# 1. Обновить версию в app.json
{
  "expo": {
    "version": "1.0.1",  // increment version
    "ios": {
      "buildNumber": "2"  // increment build number
    }
  }
}

# 2. Commit changes
git add .
git commit -m "Bump version to 1.0.1 (build 2)"
git push

# 3. Create new build
eas build --platform ios --profile production

# 4. Submit to TestFlight
eas submit --platform ios --latest
```

### 7.2 Версионирование

**Semantic Versioning:**
```
MAJOR.MINOR.PATCH (buildNumber)

1.0.0 (1)   - Initial release
1.0.1 (2)   - Bug fixes
1.1.0 (3)   - New features
2.0.0 (4)   - Major changes
```

**Best practices:**
- Increment PATCH для bug fixes
- Increment MINOR для новых features (backward compatible)
- Increment MAJOR для breaking changes
- Increment buildNumber на каждую сборку (даже если version не меняется)

## Credentials Management

### App Store Connect API Key

**Создание:**
1. App Store Connect → Users and Access → Keys
2. "+" для создания нового key
3. Name: "kiku CI/CD"
4. Access: App Manager
5. Generate и download .p8 file

**Формат для GitHub Secrets:**
```json
{
  "key_id": "ABC123XYZ",
  "issuer_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "key": "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...\n-----END PRIVATE KEY-----"
}
```

### App-Specific Password (Alternative)

**Создание:**
1. https://appleid.apple.com
2. Sign in
3. Security → App-Specific Passwords
4. Generate password for "EAS CLI"
5. Copy и сохранить (показывается только раз!)

**Использование:**
```bash
# Environment variable
export EXPO_APPLE_APP_SPECIFIC_PASSWORD="abcd-efgh-ijkl-mnop"

# Or в eas.json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDEFGHIJ"
      }
    }
  }
}
```

## Troubleshooting

### Issue: "Missing Compliance"

**Решение:**
```
1. App Store Connect → TestFlight → Builds
2. Select build → Export Compliance
3. "Provide Export Compliance Information"
4. Answer questions:
   - Uses encryption? Yes (HTTPS)
   - Exempt? Yes (standard encryption)
5. Submit
```

### Issue: "Invalid Bundle ID"

**Решение:**
```
1. Проверить app.json: ios.bundleIdentifier
2. Проверить App Store Connect: Bundle ID matches
3. Удалить node_modules и ios/ folder
4. bun install
5. eas build --platform ios --clear-cache
```

### Issue: "Provisioning Profile Error"

**Решение:**
```bash
# Re-generate credentials
eas credentials

# Select iOS → Production
# Remove все existing credentials
# Re-generate

# Rebuild
eas build --platform ios --profile production
```

### Issue: "TestFlight не показывает билд"

**Возможные причины:**
1. Beta App Review pending (для external)
2. Processing (подождать 10-30 минут)
3. Missing compliance info
4. Build expired (90 дней для TestFlight)

**Проверить:**
- App Store Connect → Activity tab
- Email notifications от Apple

## Лимиты TestFlight

```
Internal Testers:   До 100 (Apple Developer Program members)
External Testers:   До 10,000
Build Expiration:   90 дней с даты загрузки
Max Groups:         Unlimited internal, 25 external
Daily Installs:     No limit
```

## Следующие шаги после пилота

**После успешного пилота:**
1. ✅ Собрать feedback от всех тестеров
2. ✅ Исправить критические bugs
3. ✅ Подготовить Marketing materials
4. ✅ Submit для App Store Review (Production)
5. ✅ Подготовить Support documentation
6. ✅ Plan launch date

**App Store Submission:**
- Создать App Store listing
- Добавить screenshots, description
- Set pricing (Free or Paid)
- Submit для review (3-7 дней обычно)
- Release!

---

**Документ обновлен:** 2026-01-02
**Версия:** 1.0 (Draft)

**Полезные ссылки:**
- [Expo EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [App Store Connect Guide](https://developer.apple.com/app-store-connect/)
- [TestFlight Best Practices](https://developer.apple.com/testflight/)
- [Apple Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

**Контакты:**
- Technical Lead: tech@kiku-app.com
- Apple Developer Account: appledev@kiku-app.com
