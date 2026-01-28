# Playwright E2E Тесты

Этот каталог содержит end-to-end тесты для веб-версии KIKU, написанные с использованием Playwright.

## Установка

Playwright уже установлен в проекте. Если нужно установить браузеры:

```bash
bunx playwright install
```

Или с системными зависимостями:

```bash
bunx playwright install --with-deps
```

## Запуск тестов

### Базовый запуск
```bash
bun run test:playwright
```

### С UI интерфейсом (рекомендуется для разработки)
```bash
bun run test:playwright:ui
```

### В режиме отладки
```bash
bun run test:playwright:debug
```

### С видимым браузером
```bash
bun run test:playwright:headed
```

### Просмотр отчета
```bash
bun run test:playwright:report
```

## Структура тестов

Тесты организованы по функциональным областям:

- `example.spec.ts` - примеры базовых тестов
- `auth.spec.ts` - тесты аутентификации (создайте при необходимости)
- `chat.spec.ts` - тесты чата (создайте при необходимости)
- `settings.spec.ts` - тесты настроек (создайте при необходимости)

## Конфигурация

Конфигурация находится в `playwright.config.ts` в корне проекта.

### Настройка базового URL

По умолчанию используется `http://localhost:8082`. Чтобы изменить:

```bash
PLAYWRIGHT_BASE_URL=http://localhost:3000 bun run test:playwright
```

### Выбор браузеров

В конфигурации настроены:
- Chromium (Desktop Chrome)
- Firefox
- WebKit (Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

Чтобы запустить только для одного браузера:

```bash
bunx playwright test --project=chromium
```

## Написание тестов

### Базовый пример

```typescript
import { test, expect } from '@playwright/test';

test('мой тест', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/KIKU/i);
});
```

### Работа с элементами

```typescript
// Поиск по тексту
const button = page.getByRole('button', { name: 'Войти' });

// Поиск по data-testid (рекомендуется)
const element = page.getByTestId('my-component');

// Поиск по селектору
const input = page.locator('input[type="email"]');

// Клик
await button.click();

// Ввод текста
await input.fill('test@example.com');

// Проверка
await expect(button).toBeVisible();
await expect(input).toHaveValue('test@example.com');
```

### Ожидания

```typescript
// Ждать загрузки страницы
await page.waitForLoadState('networkidle');

// Ждать появления элемента
await page.waitForSelector('[data-testid="my-element"]');

// Ждать навигации
await page.waitForURL('**/dashboard');
```

### Скриншоты и видео

Playwright автоматически делает скриншоты и записывает видео при ошибках (настроено в конфигурации).

Для ручного скриншота:

```typescript
await page.screenshot({ path: 'screenshot.png' });
```

## CI/CD

Тесты автоматически запускаются в CI (если настроено). В CI режиме:
- Используется HTML репортер
- Включены повторные попытки (2 раза)
- Записываются трассировки

## Отладка

1. **UI режим** - лучший способ для отладки:
   ```bash
   bun run test:playwright:ui
   ```

2. **Debug режим** - пошаговое выполнение:
   ```bash
   bun run test:playwright:debug
   ```

3. **Headed режим** - видеть браузер:
   ```bash
   bun run test:playwright:headed
   ```

4. **Трассировка** - просмотр детального лога:
   ```bash
   bunx playwright show-trace trace.zip
   ```

## Лучшие практики

1. Используйте `data-testid` для стабильных селекторов
2. Используйте `page.getByRole()` для доступности
3. Избегайте жестких таймаутов, используйте `waitFor*`
4. Группируйте связанные тесты в `test.describe()`
5. Используйте `test.beforeEach()` для общей настройки
6. Делайте тесты независимыми друг от друга

## Полезные ссылки

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
