# Как запустить MVP — KIDS by KIKU

**Цель:** вывести приложение в работу для первых пользователей (внутренний/бета запуск или публикация в сторах).

Ниже — два сценария: **минимальный запуск** (быстро, для тестов и беты) и **полный запуск** (сторы, production).

---

## Вариант A: Минимальный запуск (внутренний/бета)

Подходит для: демо инвесторам, тестерам, закрытая бета без публикации в App Store / Google Play.

### Шаг 1. Проверка кода и сборки

```bash
# В корне проекта
cd /Users/mac/Desktop/rork-kiku

# Типы и линт
bun run typecheck
bun run lint

# Запуск приложения локально (проверка что всё стартует)
bun run start
# или для веб: bun run web
```

**Критерий:** приложение запускается, нет красных ошибок при старте.

### Шаг 2. Переменные окружения

- Создайте `.env` (или `.env.local`) из примера, если есть.
- Обязательно для AI-модерации: **`EXPO_PUBLIC_OPENAI_API_KEY`**.
- Для бэкенда (если используете): `EXPO_PUBLIC_API_URL`, на сервере — `DATABASE_URL`, `JWT_SECRET` и т.д.

Ключи не коммитить в репозиторий.

### Шаг 3. Сборка для тестировщиков (EAS)

```bash
# Установка EAS CLI (если ещё нет)
bun add -g eas-cli

# Вход в Expo
eas login

# Привязка проекта (если ещё не привязан)
eas project:init

# Сборка preview (APK для Android, симулятор для iOS — быстрее чем store)
eas build --platform android --profile preview
# или обе платформы:
eas build --platform all --profile preview
```

После сборки в Expo Dashboard появятся ссылки на скачивание APK (Android) или установку (iOS). Раздайте ссылку тестерам — это и есть ваш «запущенный MVP» для беты.

### Шаг 4. Бэкенд (если используется)

```bash
cd backend
vercel --prod
# либо ваш хостинг (Railway, Render и т.д.)
```

В настройках проекта Vercel (или другого хостинга) задайте переменные: `OPENAI_API_KEY`, `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`.

### Итог варианта A

- Приложение собирается и раздаётся через EAS (preview).
- Бэкенд задеплоен, ключи настроены.
- MVP «запущен» для внутренних/бета-пользователей.

Детальный чеклист (env, безопасность, тесты) — в **`docs/DEPLOYMENT_CHECKLIST.md`**.

---

## Вариант B: Полный запуск (сторы, production)

Для публикации в App Store и Google Play.

### 1. Всё из варианта A

Выполните шаги 1–4 выше (проверка кода, env, EAS, бэкенд).

### 2. Конфигурация приложения

**`app.json`:**
- `version` и `ios.buildNumber` / `android.versionCode` — актуальные.
- `ios.bundleIdentifier` и `android.package` — финальные (например `com.kiku.safety`).
- `extra.eas.projectId` — ID из `eas project:init`.

**`eas.json`** уже содержит профиль `production` (store). При необходимости подставьте в `submit` свои Apple ID и Google Service Account.

### 3. Production-сборка

```bash
# Сборка под сторы
eas build --platform all --profile production
```

Дождитесь окончания сборки в Expo Dashboard.

### 4. Подготовка к публикации в сторах

**Apple (App Store Connect):**
- Активный Apple Developer Account.
- В App Store Connect: создано приложение, указаны имя, описание, категория, возрастной рейтинг (например 4+ или 13+).
- Privacy Policy URL (обязательно).
- Скриншоты (например 5.5", 6.5" для iPhone).

**Google (Google Play Console):**
- Активный аккаунт разработчика.
- Создано приложение, заполнены Store listing, описание, скриншоты.
- Privacy Policy URL.
- Content rating (анкета), target audience (дети/семья при необходимости).

### 5. Отправка билдов в сторы

```bash
# После успешного production build — отправить на проверку
eas submit --platform ios --profile production --latest
eas submit --platform android --profile production --latest
```

Для Android может понадобиться файл `google-service-account.json` (путь задаётся в `eas.json` → `submit.production.android.serviceAccountKeyPath`).

### 6. Юридические документы и безопасность

- Опубликовать **Privacy Policy** и **Terms of Service** (обязательно для сторов и GDPR).
- Проверить, что в коде нет секретов, чувствительные данные — в SecureStore / env.
- По необходимости: настроить Sentry (см. `docs/DEPLOYMENT_CHECKLIST.md`).

---

## Быстрая шпаргалка команд

| Действие | Команда |
|----------|--------|
| Проверка типов | `bun run typecheck` |
| Линт | `bun run lint` |
| Юнит-тесты | `bun test` |
| Запуск приложения | `bun run start` |
| Веб | `bun run web` |
| Preview-сборка (бета) | `eas build --platform all --profile preview` |
| Production-сборка | `eas build --platform all --profile production` |
| Отправка в сторы | `eas submit --platform ios --profile production --latest` (и аналогично android) |
| Деплой бэкенда | `cd backend && vercel --prod` |

---

## Куда смотреть при проблемах

- **Полный чеклист:** `docs/DEPLOYMENT_CHECKLIST.md`
- **Стратегия и этапы:** `docs/PRODUCTION_STRATEGY.md`
- **Известные проблемы тестов:** `docs/testing/KNOWN_ISSUES.md`
- **Google Play:** `docs/deployment/GOOGLE_PLAY_SETUP.md`
- **Безопасность:** `docs/security/SECURITY_REPORT.md`

---

## Рекомендуемый порядок для первого запуска MVP

1. Выполнить **вариант A** целиком (проверка, env, preview-сборка, бэкенд).
2. Раздать ссылку на установку 5–10 тестерам, собрать обратную связь.
3. Исправить критические баги, при необходимости обновить preview-билд.
4. Когда продукт стабилен — переходить к **варианту B** (сторы, юридические документы, production build и submit).

После этого MVP считается запущенным: сначала в бете, затем — в публичных сторах.
