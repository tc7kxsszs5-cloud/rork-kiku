import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Testing Configuration для KIKU
 * 
 * Тестируем критические user flows:
 * - Parent/Child onboarding
 * - Chat functionality
 * - AI moderation
 * - SOS alerts
 */

export default defineConfig({
  testDir: './__tests__/e2e',
  
  // Timeout для каждого теста
  timeout: 60 * 1000, // 60 секунд
  
  // Количество попыток при падении теста
  retries: process.env.CI ? 2 : 0,
  
  // Параллельные workers
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['list'],
  ],
  
  // Общие настройки для всех тестов
  use: {
    // Base URL для web версии
    baseURL: process.env.EXPO_PUBLIC_WEB_URL || 'http://localhost:8081',
    
    // Скриншоты только при падении
    screenshot: 'only-on-failure',
    
    // Видео только при падении
    video: 'retain-on-failure',
    
    // Трейсы для отладки
    trace: 'on-first-retry',
    
    // Таймаут для action
    actionTimeout: 10 * 1000,
  },

  // Проекты (разные устройства)
  projects: [
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        viewport: { width: 393, height: 851 },
      },
    },
    
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 13'],
        viewport: { width: 390, height: 844 },
      },
    },
    
    {
      name: 'Tablet',
      use: { 
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 },
      },
    },
  ],

  // Web server (если нужно запускать локально)
  webServer: process.env.CI ? undefined : {
    command: 'bun run start',
    url: 'http://localhost:8081',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
