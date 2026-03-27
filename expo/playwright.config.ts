import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E для KIKU (Expo Web)
 *
 * Запуск:
 * - bun run test:web
 * - bun run test:web:ui
 * - bun run test:web:debug
 */

const baseURL = process.env.PLAYWRIGHT_BASE_URL || process.env.EXPO_PUBLIC_WEB_URL || 'http://localhost:8082';

export default defineConfig({
  testDir: './__tests__',
  testMatch: ['**/*.spec.ts', '**/*.spec.tsx'],
  testIgnore: ['**/*.test.ts', '**/*.test.tsx', '**/node_modules/**'],

  timeout: 60 * 1000,
  expect: { timeout: 15 * 1000 },
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        locale: 'en-US',
      },
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 393, height: 851 },
        locale: 'en-US',
      },
    },
  ],

  webServer: process.env.CI
    ? undefined
    : {
        command: 'bun run start:web',
        url: baseURL,
        timeout: 120 * 1000,
        reuseExistingServer: true,
      },
});
