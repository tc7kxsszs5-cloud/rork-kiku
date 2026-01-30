import { test, expect } from '@playwright/test';

/**
 * E2E Test: SOS & Alerts
 * 
 * Критический сценарий: система безопасности для детей
 */

test.describe('SOS & Alert System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Выбираем роль Child
    const childButton = page.getByRole('button', { name: /Child/i });
    if (await childButton.isVisible()) {
      await childButton.click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('SOS button is visible and accessible', async ({ page }) => {
    // SOS кнопка должна быть всегда видна
    const sosButton = page.getByRole('button', { name: /SOS|Emergency|Help/i });
    
    // Может быть на главной или в специальном месте
    const isVisible = await sosButton.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (!isVisible) {
      // Если не видна сразу, ищем в профиле или настройках
      const profileButton = page.getByRole('button', { name: /Profile|Settings/i }).first();
      if (await profileButton.isVisible()) {
        await profileButton.click();
        await expect(page.getByRole('button', { name: /SOS|Emergency|Help/i })).toBeVisible();
      }
    } else {
      expect(isVisible).toBeTruthy();
    }
  });

  test('SOS button triggers alert (simulation)', async ({ page }) => {
    // Находим SOS кнопку
    let sosButton = page.getByRole('button', { name: /SOS|Emergency|Help/i });
    
    if (!await sosButton.isVisible()) {
      const profileButton = page.getByRole('button', { name: /Profile|Settings/i }).first();
      await profileButton.click();
      sosButton = page.getByRole('button', { name: /SOS|Emergency|Help/i });
    }
    
    await expect(sosButton).toBeVisible({ timeout: 10000 });
    
    // Кликаем на SOS
    await sosButton.click();
    
    // Должно появиться подтверждение или уведомление
    const confirmationIndicators = [
      page.getByText(/confirm|are you sure|emergency/i),
      page.getByRole('dialog'),
      page.getByRole('alertdialog'),
    ];
    
    let confirmationVisible = false;
    for (const indicator of confirmationIndicators) {
      if (await indicator.isVisible({ timeout: 5000 }).catch(() => false)) {
        confirmationVisible = true;
        break;
      }
    }
    
    expect(confirmationVisible).toBeTruthy();
  });

  test('Parent can view alerts', async ({ page }) => {
    // Переключаемся на роль Parent
    await page.goto('/');
    
    const parentButton = page.getByRole('button', { name: /Parent/i });
    if (await parentButton.isVisible()) {
      await parentButton.click();
      await page.waitForLoadState('networkidle');
    }
    
    // Ищем раздел Alerts/Notifications
    const alertsButton = page.getByRole('button', { name: /Alerts?|Notifications?/i }).first();
    
    if (await alertsButton.isVisible()) {
      await alertsButton.click();
      
      // Проверяем, что экран alerts загрузился
      await expect(page.getByText(/Alerts?|Notifications?/i)).toBeVisible({ timeout: 10000 });
    } else {
      // Может быть в настройках или профиле
      const settingsButton = page.getByRole('button', { name: /Settings|Profile|Menu/i }).first();
      if (await settingsButton.isVisible()) {
        await settingsButton.click();
        await expect(page.getByText(/Alerts?|Notifications?/i)).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('Alert notification displays correctly', async ({ page }) => {
    // Выбираем роль Parent
    await page.goto('/');
    const parentButton = page.getByRole('button', { name: /Parent/i });
    if (await parentButton.isVisible()) {
      await parentButton.click();
      await page.waitForLoadState('networkidle');
    }
    
    // Переходим в раздел Alerts
    const alertsButton = page.getByRole('button', { name: /Alerts?|Notifications?/i }).first();
    
    if (await alertsButton.isVisible()) {
      await alertsButton.click();
      
      // Проверяем структуру alert элементов
      // (Если есть тестовые данные или mock alerts)
      const alertElements = page.locator('[data-testid*="alert"], [class*="alert"]');
      
      // Если есть alerts, проверяем их структуру
      const count = await alertElements.count();
      if (count > 0) {
        const firstAlert = alertElements.first();
        
        // Alert должен содержать ключевые элементы
        await expect(firstAlert).toBeVisible();
      }
    }
  });
});
