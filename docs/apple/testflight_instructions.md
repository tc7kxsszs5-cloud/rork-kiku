# Инструкции по TestFlight для Rork-Kiku

**Версия**: 1.0 (ЧЕРНОВИК)  
**Дата**: Январь 2026  
**Платформа**: iOS

---

## Обзор

Этот документ содержит подробные инструкции по подготовке iOS build'а и загрузке его в TestFlight для пилотного тестирования. TestFlight — это официальная платформа Apple для beta-тестирования iOS приложений.

**Цель**: Запуск pilot с 100-500 пользователями через TestFlight (Q2-Q3 2026).

---

## Предварительные требования

### 1. Apple Developer Account

**Стоимость**: $99/год

**Шаги**:
1. Зарегистрируйтесь на [developer.apple.com](https://developer.apple.com)
2. Оплатите membership ($99)
3. Согласитесь с Apple Developer Agreement

**Типы аккаунтов**:
- **Individual**: для одного разработчика
- **Organization**: для компании (рекомендуется для Rork-Kiku)
  - Требует DUNS number
  - Требует legal entity documentation

**Важно**: Organization account позволяет добавлять team members и разделять роли.

### 2. App Store Connect Access

После создания Developer Account, у вас будет доступ к:
- **App Store Connect**: [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
- Здесь создаются app records, управляются builds и TestFlight

### 3. Локальная разработка

**Установите**:
- Xcode (последняя версия)
  - Скачать с Mac App Store или [developer.apple.com](https://developer.apple.com/xcode/)
- Node.js и Bun (уже установлены для React Native)
- Expo CLI: `bun i -g @expo/eas-cli`

---

## Шаг 1: Создание App ID

### 1.1 В Apple Developer Portal

1. Откройте [developer.apple.com/account](https://developer.apple.com/account)
2. Перейдите в **Certificates, IDs & Profiles**
3. Нажмите **Identifiers** → **+** (создать новый)
4. Выберите **App IDs** → Continue
5. Заполните:
   - **Description**: Rork-Kiku
   - **Bundle ID**: `com.rorkkiku.app` (или ваш bundle ID)
     - **Explicit**: выберите Explicit App ID (не Wildcard)
   - **Capabilities**: выберите нужные
     - ✅ Push Notifications
     - ✅ Sign in with Apple
     - ✅ Associated Domains (для deep links)
     - ✅ App Groups (если требуется)
6. Нажмите **Register**

### 1.2 В app.json (Expo)

Обновите `app.json` с вашим Bundle ID:

```json
{
  "expo": {
    "name": "Rork-Kiku",
    "slug": "rork-kiku",
    "ios": {
      "bundleIdentifier": "com.rorkkiku.app",
      "buildNumber": "1",
      "supportsTablet": true
    }
  }
}
```

---

## Шаг 2: Certificates и Provisioning Profiles

### 2.1 Distribution Certificate

**Что это**: Сертификат для подписания iOS builds для distribution (TestFlight, App Store).

**Создание**:

#### Вариант A: Автоматически через EAS (рекомендуется)

```bash
eas credentials
```

EAS автоматически создаст и управляет сертификатами.

#### Вариант B: Вручную

1. Откройте [developer.apple.com/account](https://developer.apple.com/account)
2. **Certificates, IDs & Profiles** → **Certificates** → **+**
3. Выберите **iOS Distribution** → Continue
4. Создайте CSR (Certificate Signing Request):
   - Откройте **Keychain Access** (Mac)
   - **Keychain Access** → **Certificate Assistant** → **Request Certificate From a Certificate Authority**
   - Email: ваш email
   - Saved to disk: сохраните CSR файл
5. Upload CSR → Download certificate (.cer)
6. Двойной клик на .cer → установится в Keychain

### 2.2 Provisioning Profile

**Что это**: Профиль, связывающий App ID, Certificate и Device IDs (для TestFlight не требуются device IDs).

**Создание**:

1. **Certificates, IDs & Profiles** → **Profiles** → **+**
2. Выберите **App Store** (для TestFlight + production) → Continue
3. Выберите App ID: `com.rorkkiku.app`
4. Выберите Certificate (созданный выше)
5. Нажмите **Generate**
6. Download profile (.mobileprovision)

**Важно**: Для TestFlight internal testing, используйте **App Store** provisioning profile (не Ad Hoc).

---

## Шаг 3: Настройка EAS Build

### 3.1 Установка EAS CLI

```bash
bun i -g @expo/eas-cli
```

### 3.2 Login в Expo

```bash
eas login
```

Введите ваш Expo username и password.

### 3.3 Создание проекта в EAS

```bash
cd /path/to/rork-kiku
eas build:configure
```

Это создаст `eas.json` файл:

```json
{
  "build": {
    "production": {
      "ios": {
        "resourceClass": "m-medium",
        "distribution": "store",
        "autoIncrement": true
      }
    },
    "development": {
      "ios": {
        "resourceClass": "m-medium",
        "distribution": "development",
        "developmentClient": true
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDE12345"
      }
    }
  }
}
```

### 3.4 Настройка credentials

```bash
eas credentials
```

Выберите:
- **Select platform**: iOS
- **Select profile**: production
- **What do you want to do**: Set up credentials from scratch

EAS автоматически создаст или загрузит существующие credentials.

---

## Шаг 4: Build приложения

### 4.1 Локальная проверка

Перед build'ом, убедитесь что приложение работает локально:

```bash
bun install
bun run start
# Press 'i' для iOS simulator
```

Проверьте:
- ✅ Приложение запускается без ошибок
- ✅ Все критические функции работают
- ✅ Нет console warnings/errors

### 4.2 Запуск build на EAS

```bash
eas build --platform ios --profile production
```

**Что происходит**:
1. EAS загружает ваш код на их servers
2. Build происходит в cloud (без локального Xcode)
3. Build занимает ~15-30 минут
4. Вы получите URL для скачивания .ipa файла

**Мониторинг build**:
- В терминале: вы увидите прогресс + URL
- В браузере: [expo.dev/accounts/[account]/projects/[project]/builds](https://expo.dev)

**Логи**:
- Если build fails, проверьте logs в Expo dashboard
- Распространённые ошибки:
  - Missing dependencies: `bun install` перед build
  - Bundle ID mismatch: проверьте `app.json`
  - Certificate issues: заново run `eas credentials`

### 4.3 Скачать .ipa (опционально)

После успешного build'а:
- Скачайте .ipa файл с Expo dashboard
- Или получите download URL из терминала

---

## Шаг 5: Создание App Record в App Store Connect

### 5.1 Создать новое приложение

1. Откройте [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Перейдите в **My Apps** → **+** (Add New App)
3. Заполните:
   - **Platform**: iOS
   - **Name**: Rork-Kiku
   - **Primary Language**: English (или Russian)
   - **Bundle ID**: выберите `com.rorkkiku.app` из dropdown
   - **SKU**: уникальный identifier (например, `rork-kiku-ios-001`)
   - **User Access**: Full Access
4. Нажмите **Create**

### 5.2 App Information

**General Information**:
- **Name**: Rork-Kiku
- **Subtitle** (опционально): "Безопасное общение для детей и родителей"
- **Category**: 
  - **Primary**: Education или Social Networking
  - **Secondary**: Parenting

**Age Rating**:
- ⚠️ **Важно**: Для детских приложений
- Questionnaire:
  - **Made for Kids**: No (приложение для родителей И детей)
  - **Age Range**: 6-12
  - **Requires parental consent**: Yes
- После заполнения → Age Rating: 4+ или 9+ (в зависимости от контента)

**Privacy Policy URL**:
- URL: `https://rork-kiku.com/privacy` (placeholder)
- ⚠️ Должен быть доступен публично перед submission

---

## Шаг 6: Upload Build в TestFlight

### 6.1 Вариант A: Автоматическая загрузка через EAS (рекомендуется)

```bash
eas submit --platform ios --profile production
```

**Что происходит**:
1. EAS загружает .ipa в App Store Connect
2. Apple обрабатывает build (~5-30 минут)
3. Build появится в TestFlight

**Credentials**:
- EAS попросит:
  - **Apple ID**: ваш Apple ID email
  - **App-Specific Password**: создайте на [appleid.apple.com](https://appleid.apple.com)

**Создание App-Specific Password**:
1. Откройте [appleid.apple.com](https://appleid.apple.com)
2. **Sign-in and Security** → **App-Specific Passwords**
3. **Generate Password** → введите label (например, "EAS CLI")
4. Скопируйте password (будет показан только один раз)

### 6.2 Вариант B: Ручная загрузка через Transporter (Mac)

1. Скачайте .ipa с Expo dashboard
2. Откройте **Transporter** app (Mac App Store)
3. Drag & drop .ipa файл
4. Нажмите **Deliver**

### 6.3 Вариант C: Через Xcode (если есть .xcarchive)

1. Откройте Xcode
2. **Window** → **Organizer**
3. Выберите build → **Distribute App**
4. Выберите **App Store Connect** → **Upload**

---

## Шаг 7: Настройка TestFlight

### 7.1 Дождаться обработки build

После загрузки build'а:
1. Откройте [App Store Connect](https://appstoreconnect.apple.com)
2. **My Apps** → **Rork-Kiku** → **TestFlight**
3. Build появится в разделе **iOS Builds** (статус: "Processing")
4. Обработка занимает 5-30 минут
5. Статус изменится на **Ready to Submit** или **Ready to Test**

**Если build в статусе "Missing Compliance"**:
- Нажмите на build → **Provide Export Compliance**
- Ответьте на вопросы (обычно "No" для большинства)

### 7.2 Добавить Test Information

**Test Information** (обязательно для external testing):
- **Beta App Description**: краткое описание приложения для testers
  - Пример: "Rork-Kiku — платформа для безопасного общения детей и родителей. В этом beta-тесте мы проверяем основные функции: регистрация, чаты, модерация контента."
- **Beta App Review Information**:
  - **Contact Email**: [SUPPORT_EMAIL]
  - **Phone Number**: [SUPPORT_PHONE]
  - **Test Account**: если требуется login
    - Username: `test@example.com` (создайте test account)
    - Password: `TestPassword123!`
  - **Notes**: инструкции для reviewers
    - "Для тестирования создайте родительский профиль и добавьте ребёнка."

### 7.3 Internal Testing (опционально)

**Internal testers** — это members вашего App Store Connect team (до 100 человек).

**Добавить internal testers**:
1. **TestFlight** → **Internal Testing**
2. Нажмите **+** → введите email members
3. Они получат invite по email
4. Builds доступны сразу (без Apple review)

**Использование**:
- Быстрое тестирование перед external testing
- Team members могут проверить build до отправки external testers

### 7.4 External Testing (для pilot)

**External testers** — это пользователи вне вашей команды (до 10,000 человек).

**Требования**:
- Apple review (1-2 дня)
- Test Information заполнена
- Build должен пройти basic compliance checks

**Создать external testing group**:
1. **TestFlight** → **External Testing** → **+** (Create Group)
2. **Group Name**: `Pilot Users` (или любое имя)
3. **Add Build**: выберите build для тестирования
4. **Submit for Review** → Apple review (1-2 дня)

**Добавить external testers**:
- **Вариант A**: Email addresses
  - Введите emails (до 10,000)
  - Testers получат invite email
- **Вариант B**: Public Link
  - **Public Link** → **Enable**
  - Получите ссылку: `https://testflight.apple.com/join/XXXXXXX`
  - Поделитесь ссылкой с testers (через email, соцсети, и т.д.)

**Ограничения**:
- External testing build истекает через **90 дней**
- Максимум 10,000 external testers per app

---

## Шаг 8: Приглашение тестеров

### 8.1 Invite по email

1. **External Testing** → **Pilot Users** group
2. **Testers** → **+** → введите emails
3. Testers получат email с кнопкой "View in TestFlight"
4. Они скачают TestFlight app (если нет) и установят ваше приложение

### 8.2 Public Link

1. **External Testing** → **Pilot Users** → **Public Link** → **Enable**
2. Скопируйте ссылку
3. Отправьте ссылку:
   - Email campaign
   - Parenting communities (Reddit, Facebook groups)
   - School partnerships
   - Social media

**Пример сообщения**:
```
Приглашаем вас протестировать Rork-Kiku — безопасную платформу для общения детей и родителей!

🎯 Мы ищем 100 семей для пилотного тестирования.

✅ Бесплатно
✅ iOS (iPhone/iPad)
✅ Дети 6-12 лет

Присоединяйтесь: https://testflight.apple.com/join/XXXXXXX

Ваш feedback поможет нам создать лучший продукт!
```

### 8.3 Мониторинг тестеров

**TestFlight Dashboard**:
- **Sessions**: сколько раз тестеры открыли приложение
- **Crashes**: crash reports
- **Feedback**: тестеры могут отправлять screenshots и feedback через TestFlight

---

## Шаг 9: CI/CD автоматизация (опционально, но рекомендуется)

### 9.1 GitHub Actions для автоматического build

Создайте `.github/workflows/eas-build-ios.yml`:

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
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build iOS
        run: eas build --platform ios --profile production --non-interactive

      - name: Submit to TestFlight (optional)
        run: eas submit --platform ios --profile production --non-interactive
        if: github.ref == 'refs/heads/main'
```

### 9.2 GitHub Secrets setup

**Необходимые secrets**:
1. **EXPO_TOKEN**:
   - Создайте на [expo.dev/accounts/[account]/settings/access-tokens](https://expo.dev/accounts/)
   - Добавьте в GitHub Secrets: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

2. **Apple Credentials** (для `eas submit`):
   - **Вариант A**: App Store Connect API Key (рекомендуется)
     - Создайте API key в [App Store Connect](https://appstoreconnect.apple.com/access/api)
     - Download .p8 файл
     - В GitHub Secrets добавьте JSON:
       ```json
       {
         "key_id": "XXXXXXXXXX",
         "issuer_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
         "key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
       }
       ```
     - Secret name: `APPLE_API_KEY_JSON`

   - **Вариант B**: Apple ID + App-Specific Password
     - `APPLE_ID`: ваш Apple ID email
     - `APPLE_SPECIFIC_PASSWORD`: app-specific password с [appleid.apple.com](https://appleid.apple.com)

**⚠️ ВАЖНО**:
- **НЕ коммитить secrets в код**
- Использовать GitHub Secrets или другие secure vaults (HashiCorp Vault, AWS Secrets Manager)

### 9.3 Fastlane (альтернатива EAS)

Если вы предпочитаете Fastlane:

**Установка**:
```bash
bun i -g fastlane
fastlane init
```

**Fastfile** (упрощенный):
```ruby
default_platform(:ios)

platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    build_app(scheme: "RorkKiku")
    upload_to_testflight(
      skip_waiting_for_build_processing: true
    )
  end
end
```

**Run**:
```bash
fastlane beta
```

---

## Шаг 10: Metadata и Privacy Disclosures

### 10.1 App Metadata (для App Store, но можно заполнить сейчас)

В App Store Connect → **Rork-Kiku** → **App Information**:

**App Name**: Rork-Kiku

**Subtitle** (30 chars): Безопасная связь родителей и детей

**Description** (4000 chars):
```
Rork-Kiku — безопасная платформа для общения детей (6-12 лет) и родителей с проактивной AI-модерацией контента.

Основные функции:
• Приватные чаты родитель ↔ ребёнок
• AI-модерация всего контента (текст, фото, видео)
• Родительская панель с полной прозрачностью
• Библиотека образовательного контента
• COPPA/GDPR compliant

Для родителей:
✓ Верификация и создание детских профилей
✓ Просмотр всех сообщений ребёнка
✓ Настройки модерации (строгая/средняя/мягкая)
✓ Отчеты о заблокированном контенте

Для детей:
✓ Безопасный чат с родителями
✓ Отправка текста и фото (с модерацией)
✓ Доступ к образовательному контенту

Конфиденциальность: мы не продаём данные детей. Подробнее: [privacy policy URL]
```

**Keywords** (100 chars): parental control, kids safety, child messaging, safe chat, moderation

**Screenshots**:
- 5-10 screenshots (разных screen sizes: 6.5", 5.5")
- ⚠️ Требуется design (можно использовать Figma mockups для начала)

### 10.2 Privacy Disclosures (обязательно)

**App Privacy** (App Store Connect):
1. **Rork-Kiku** → **App Privacy**
2. **Get Started** → заполните questionnaire

**Вопросы**:
- **Collect Data**: Yes
- **Data Types**:
  - Contact Info (email)
  - User Content (messages, photos)
  - Identifiers (user ID)
  - Usage Data (analytics)
- **Linked to User**: Yes (большинство)
- **Used for Tracking**: No (важно для COPPA)
- **Third-Party Data**: No

**Privacy Policy URL**: `https://rork-kiku.com/privacy`

---

## Troubleshooting

### Build Fails

**Ошибка**: "Missing bundle identifier"
- **Решение**: проверьте `app.json` → `ios.bundleIdentifier`

**Ошибка**: "Certificate expired"
- **Решение**: обновите certificate через `eas credentials`

**Ошибка**: "Provisioning profile doesn't match bundle identifier"
- **Решение**: пересоздайте provisioning profile с правильным Bundle ID

### Upload Fails

**Ошибка**: "Invalid App Store Connect credentials"
- **Решение**: проверьте Apple ID и app-specific password

**Ошибка**: "Missing compliance"
- **Решение**: заполните Export Compliance в App Store Connect

### TestFlight Review Rejected

**Причина**: "Missing test account"
- **Решение**: добавьте test account в Beta App Review Information

**Причина**: "Privacy policy not accessible"
- **Решение**: убедитесь что Privacy Policy URL публично доступен

---

## Best Practices

### Безопасность секретов

**НЕ делать**:
- ❌ Коммитить certificates/provisioning profiles в Git
- ❌ Хранить passwords в plaintext
- ❌ Делиться credentials в Slack/email

**Делать**:
- ✅ Использовать GitHub Secrets для CI/CD
- ✅ Использовать EAS для управления credentials
- ✅ Хранить sensitive files в secure vault (1Password, HashiCorp Vault)

### Версионирование

**Bump version перед каждым build**:
```json
{
  "expo": {
    "version": "1.0.1",
    "ios": {
      "buildNumber": "2"
    }
  }
}
```

**Или автоматически**:
```json
{
  "build": {
    "production": {
      "ios": {
        "autoIncrement": true
      }
    }
  }
}
```

### Testing перед загрузкой

1. **Локальное тестирование**: iOS simulator
2. **Device testing**: установите на физическое устройство через Xcode
3. **Internal TestFlight**: team members проверяют перед external release

---

## Варианты загрузки сборки

### Вариант 1: Владелец загружает вручную (рекомендуется для MVP)

**Плюсы**:
- Полный контроль
- Нет необходимости предоставлять доступ

**Минусы**:
- Требуется владелец для каждого build
- Не automated

**Когда использовать**: Pilot, до настройки CI/CD

### Вариант 2: Предоставить доступ CI/CD (рекомендуется для production)

**Плюсы**:
- Automated builds
- Fast iteration

**Минусы**:
- Требуется setup secrets в CI

**Когда использовать**: После pilot, для continuous delivery

### Вариант 3: Hybrid (владелец review, CI upload)

**Плюсы**:
- CI build, но владелец контролирует submission

**Как**:
- CI builds app → владелец скачивает .ipa → владелец загружает через Transporter

---

## Заключение

Эти инструкции охватывают полный процесс от создания App ID до загрузки в TestFlight. Ключевые шаги:

1. ✅ Apple Developer Account ($99/year)
2. ✅ App ID и Bundle Identifier
3. ✅ Certificates и Provisioning Profiles (через EAS или вручную)
4. ✅ EAS Build (`eas build --platform ios`)
5. ✅ App Store Connect app record
6. ✅ Upload в TestFlight (`eas submit` или Transporter)
7. ✅ Пригласить тестеров (email или public link)

**Next Steps после успешной загрузки**:
- Мониторинг feedback от testers
- Итерация на основе bug reports
- Подготовка к public launch в App Store

---

**Версия**: 1.0 (ЧЕРНОВИК)  
**Последнее обновление**: 2026-01-02  
**Автор**: Rork-Kiku Mobile Team

**Полезные ссылки**:
- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Apple TestFlight Documentation](https://developer.apple.com/testflight/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
