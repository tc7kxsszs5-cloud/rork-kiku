import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright конфигурация для тестирования веб-версии KIKU
 * 
 * Использование:
 * - bun run test:playwright - запустить все тесты
 * - bun run test:playwright:ui - запустить с UI
 * - bun run test:playwright:debug - запустить в режиме отладки
 */
export default defineConfig({
  testDir: './__tests__/playwright',
  
  // Максимальное время выполнения одного теста
  timeout: 30 * 1000,
  
  // Ожидание между тестами
  expect: {
    timeout: 5000,
  },
  
  // Параллельное выполнение тестов
  fullyParallel: true,
  
  // Запретить запуск тестов при ошибках в сборке
  forbidOnly: !!process.env.CI,
  
  // Повторные попытки только в CI
  retries: process.env.CI ? 2 : 0,
  
  // Количество воркеров
  workers: process.env.CI ? 1 : undefined,
  
  // Репортер для CI
  reporter: process.env.CI 
    ? 'html' 
    : [
        ['html'],
        ['list'],
      ],
  
  // Общие настройки для всех проектов
  use: {
    // Базовый URL приложения (веб-версия Expo)
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:8082',
    
    // Трассировка для отладки
    trace: 'on-first-retry',
    
    // Скриншоты при ошибках
    screenshot: 'only-on-failure',
    
    // Видео при ошибках
    video: 'retain-on-failure',
  },

  // Конфигурация для разных браузеров
  // WebKit отключен, так как не поддерживается на macOS 13
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    // Мобильные устройства (только Chrome, Safari не поддерживается)
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    
    // WebKit и Mobile Safari отключены - не поддерживаются на macOS 13
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Веб-сервер для запуска приложения перед тестами
  webServer: {
    command: 'bun run start:web',
    url: 'http://localhost:8082',
    reuseExistingServer: true, // Всегда использовать существующий сервер, если он запущен
    timeout: 180 * 1000, // Увеличено до 3 минут для медленного запуска
    stdout: 'pipe', // Показывать логи для диагностики
    stderr: 'pipe',
  },
});
