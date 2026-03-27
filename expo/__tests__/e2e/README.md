# 🎭 E2E Tests - Playwright

**Статус:** ✅ Готов к запуску  
**Покрытие:** Критические user flows

---

## 📋 Тестовые сценарии

### 1. **Onboarding Flow** (`01-onboarding.spec.ts`)
- ✅ Parent role selection
- ✅ Child role selection
- ✅ UI elements validation
- ✅ Role switching

### 2. **Chat Flow** (`02-chat-flow.spec.ts`)
- ✅ Send safe messages
- ✅ AI moderation detection
- ✅ Message history loading
- ✅ Chat interface validation

### 3. **SOS & Alerts** (`03-sos-alerts.spec.ts`)
- ✅ SOS button accessibility
- ✅ Emergency alert triggering
- ✅ Parent alert viewing
- ✅ Alert notifications display

### 4. **Settings & Theme** (`04-settings-theme.spec.ts`)
- ✅ Settings page access
- ✅ Theme switching (Sunrise/Midnight)
- ✅ Language switching (EN/RU)
- ✅ Settings sections validation

---

## 🚀 Запуск тестов

### Установка (уже сделано):
```bash
bun add -D @playwright/test
bunx playwright install
```

### Запуск всех тестов:
```bash
bun run test:e2e
```

### Запуск с UI:
```bash
bunx playwright test --ui
```

### Запуск конкретного файла:
```bash
bunx playwright test __tests__/e2e/01-onboarding.spec.ts
```

### Запуск в debug режиме:
```bash
bunx playwright test --debug
```

---

## 📊 Отчеты

После запуска тестов доступны:

### HTML отчет:
```bash
bunx playwright show-report
```

### JSON результаты:
```
playwright-report/results.json
```

---

## 🎯 Конфигурация

См. `playwright.config.ts` для:
- Timeouts
- Retry policy
- Devices (Mobile Chrome, Mobile Safari, Tablet)
- Screenshot/Video capture
- Web server setup

---

## ⚙️ Запуск перед E2E тестами

### 1. Запустить development server:
```bash
bun run start
```

### 2. В другом терминале запустить тесты:
```bash
bun run test:e2e
```

---

## 🌐 Web версия

E2E тесты работают с **web** версией приложения:
- **URL:** http://localhost:8082 (см. `playwright.config.ts`)
- **Platform:** Expo Web

### Как запускать Playwright

**Вариант 1 (рекомендуется):** одной командой — Playwright сам поднимет сервер и запустит тесты:
```bash
bun run test:web
```
Дождитесь сообщения о готовности сервера (до ~2 минут), затем тесты запустятся.

**Вариант 2:** вручную — в одном терминале запустите приложение, в другом — тесты:
```bash
# Терминал 1
bun run start:web

# Терминал 2 (после того как в браузере открывается localhost:8082)
bun run test:web
```

**Если видите `ERR_CONNECTION_REFUSED`:** веб-сервер не запущен. Запустите `bun run start:web` или используйте `bun run test:web` и дождитесь старта сервера.

**Примечание:** Некоторые native функции (геолокация, камера) могут работать по-другому в web версии.

---

## 📝 Добавление новых тестов

```typescript
import { test, expect } from '@playwright/test';

test.describe('New Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should do something', async ({ page }) => {
    // Your test here
    await expect(page.getByText('Expected Text')).toBeVisible();
  });
});
```

---

## 🚨 Troubleshooting

### ERR_CONNECTION_REFUSED на localhost:8082
Веб-сервер не запущен. Запустите `bun run start:web` в отдельном терминале или используйте `bun run test:web` (сервер поднимется автоматически, подождите 1–2 минуты).

### Тесты падают с timeout:
- Увеличьте `timeout` в `playwright.config.ts`
- Проверьте, что dev server запущен на порту 8082
- Проверьте network connectivity

### Элементы не находятся:
- Используйте `--debug` для визуальной отладки
- Проверьте селекторы (могли измениться)
- Добавьте `await page.pause()` для остановки

### Скриншоты/видео не создаются:
- Проверьте настройки `screenshot` и `video` в config
- Убедитесь, что папка `playwright-report` существует

---

**Автор:** Development Team  
**Последнее обновление:** 30 января 2026
