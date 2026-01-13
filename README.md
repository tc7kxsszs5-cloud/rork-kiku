# 🛡️ KIKU - AI-Powered Child Safety Platform

[![CI](https://github.com/tc7kxsszs5-cloud/rork-kiku/actions/workflows/ci.yml/badge.svg)](https://github.com/tc7kxsszs5-cloud/rork-kiku/actions/workflows/ci.yml)
[![EAS Build](https://github.com/tc7kxsszs5-cloud/rork-kiku/actions/workflows/eas-build.yml/badge.svg)](https://github.com/tc7kxsszs5-cloud/rork-kiku/actions/workflows/eas-build.yml)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/tc7kxsszs5-cloud?style=for-the-badge&logo=github)](https://github.com/sponsors/tc7kxsszs5-cloud)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue.svg?style=for-the-badge&logo=react)](https://reactnative.dev/)

> Инновационная платформа для защиты детей в цифровом мире, использующая искусственный интеллект для мониторинга и предотвращения онлайн-угроз.

## 🌟 Особенности

- 🤖 **AI-персонализация** - Адаптивный AI для каждого ребенка, снижение ложных срабатываний на 90%
- 🎮 **Геймификация** - Обучение безопасности через игру
- 🔮 **Предиктивная аналитика** - Предсказание рисков до их возникновения
- 💬 **AI-ассистент** - 24/7 поддержка родителей
- 🌍 **Мультиязычность** - Поддержка 15+ языков
- 🎨 **Уникальный дизайн** - Избегаем AI-клише, контекстно-специфичный дизайн

## 🚀 Быстрый старт

```bash
# Установка зависимостей
bun install

# Запуск backend
cd backend && bun run dev

# Запуск mobile app
npx expo start
```

## 📚 Документация

- [Руководство по развертыванию](DEPLOYMENT_GUIDE.md)
- [Руководство по тестированию](TESTING.md)
- [Дизайн-система](DESIGN_SYSTEM.md)
- [Инновации](INNOVATION_ROADMAP.md)
- [Стратегия глобального распространения](GLOBAL_EXPANSION_STRATEGY.md)
- [Визуальные эффекты](VISUAL_EFFECTS_GUIDE.md)
- [Вклад в проект](CONTRIBUTING.md)
- [Безопасность](SECURITY.md)

## 💰 Спонсорство

Поддержите проект KIKU и помогите защитить детей по всему миру!

### 🌍 Способы поддержки (работают в Грузии и везде):

[![PayPal](https://img.shields.io/badge/PayPal-Support-blue.svg?style=flat-square&logo=paypal)](https://paypal.me/kikustore)
[![Patreon](https://img.shields.io/badge/Patreon-Support-orange.svg?style=flat-square&logo=patreon)](https://www.patreon.com/kiku)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-yellow.svg?style=flat-square&logo=buy-me-a-coffee)](https://www.buymeacoffee.com/kiku)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-red.svg?style=flat-square&logo=ko-fi)](https://ko-fi.com/kiku)
[![Open Collective](https://img.shields.io/badge/Open%20Collective-Sponsor-red.svg?style=flat-square&logo=opencollective)](https://opencollective.com/kiku)

**Спонсорские пакеты:** [SPONSORS.md](SPONSORS.md)  
**Альтернативные способы:** [SPONSORSHIP_ALTERNATIVES.md](SPONSORSHIP_ALTERNATIVES.md)

## 🏗️ Архитектура

- **Frontend:** React Native (Expo)
- **Backend:** Hono + tRPC
- **AI:** Персонализированные модели
- **Database:** PostgreSQL (production)
- **Cache:** Redis
- **Deployment:** Vercel/Cloudflare + EAS

## 📊 Статус проекта

- ✅ MVP готов
- ✅ Инновационные функции реализованы
- ✅ Готовность к масштабированию
- 🚀 Готов к запуску в production

## 🤝 Вклад в проект

Мы приветствуем вклад в проект! Пожалуйста, прочитайте [CONTRIBUTING.md](CONTRIBUTING.md) для деталей.

## 🔄 CI & iOS TestFlight (EAS)

Проект использует GitHub Actions для автоматизации CI/CD процессов.

### Настройка CI/CD

#### Требуемые GitHub Secrets

Для работы CI/CD pipeline необходимо настроить следующие секреты в GitHub:

1. **EXPO_TOKEN** (обязательно)
   - Создайте токен в [expo.dev](https://expo.dev) → Account Settings → Access Tokens
   - Добавьте в GitHub: Settings → Secrets and variables → Actions → New repository secret

2. **Apple Credentials** (для TestFlight submission)
   
   **Вариант A: App Store Connect API Key (рекомендуется)**
   - Создайте API ключ в [App Store Connect](https://appstoreconnect.apple.com/access/api)
   - Создайте JSON файл:
   ```json
   {
     "key_id": "YOUR_KEY_ID",
     "issuer_id": "YOUR_ISSUER_ID",
     "key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
   }
   ```
   - Добавьте как секрет `APPLE_API_KEY_JSON`

   **Вариант B: Apple ID + App-Specific Password**
   - Создайте app-specific password на [appleid.apple.com](https://appleid.apple.com)
   - Добавьте секреты: `APPLE_ID` и `APPLE_SPECIFIC_PASSWORD`

### Доступные Workflows

#### 1. CI - Lint & TypeCheck
Автоматически запускается при push/PR на main и prepare/* ветки.

```bash
# Запустить локально
bun run ci:all
```

#### 2. EAS Build & Submit (iOS)
Сборка iOS приложения и отправка в TestFlight.

**Автоматический запуск:**
- Push в ветки `main` или `release/**`

**Ручной запуск:**
1. Перейдите в GitHub Actions
2. Выберите "EAS Build & Submit (iOS)"
3. Нажмите "Run workflow"
4. Выберите нужную ветку

### Локальное тестирование

```bash
# Установка зависимостей
bun install

# Проверка кода
bun run ci:lint       # ESLint
bun run ci:tsc        # TypeScript проверка
bun run ci:all        # Все проверки

# Запуск приложения
bun run start         # Expo dev server

# EAS Build (требует авторизации)
eas login
eas build --platform ios --profile production
eas submit --platform ios
```

### Build Profiles

Проект использует следующие профили сборки (настроены в `eas.json`):

- **production** - Archive build для App Store/TestFlight
- **preview** - Simulator build для тестирования
- **development** - Development client с hot reload

### Troubleshooting

**Ошибка: "Bun not found"**
```bash
curl -fsSL https://bun.sh/install | bash
export PATH="$HOME/.bun/bin:$PATH"
```

**Ошибка: "EXPO_TOKEN not set"**
- Убедитесь, что секрет `EXPO_TOKEN` добавлен в GitHub
- Для локального использования: `export EXPO_TOKEN=your_token`

**Ошибка при iOS build**
- Проверьте правильность Apple credentials
- Убедитесь, что Bundle ID настроен в app.json
- Проверьте наличие Apple Developer аккаунта

Подробнее см. [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) и [EAS_BUILD_COMMANDS.md](EAS_BUILD_COMMANDS.md).

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE) для деталей.

## 📞 Контакты

- **Email:** g_mikheil@icloud.com
- **GitHub:** [github.com/tc7kxsszs5-cloud/rork-kiku](https://github.com/tc7kxsszs5-cloud/rork-kiku)
- **Спонсорство:** [SPONSORS.md](SPONSORS.md)

---

**Сделано с ❤️ для защиты детей в цифровом мире**
