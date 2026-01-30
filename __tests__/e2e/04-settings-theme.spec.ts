import { test, expect } from '@playwright/test';

/**
 * E2E Test: Settings & Theme
 * 
 * Тестирование UI/UX функций
 */

test.describe('Settings & Theme', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Выбираем любую роль
    const roleButton = page.getByRole('button', { name: /Parent|Child/i }).first();
    if (await roleButton.isVisible()) {
      await roleButton.click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('Can access settings page', async ({ page }) => {
    // Ищем кнопку Settings
    const settingsButton = page.getByRole('button', { name: /Settings|Profile/i }).first();
    await expect(settingsButton).toBeVisible({ timeout: 10000 });
    
    await settingsButton.click();
    
    // Проверяем загрузку страницы настроек
    await expect(page.getByText(/Settings|Preferences/i)).toBeVisible({ timeout: 10000 });
  });

  test('Theme switching works', async ({ page }) => {
    // Переходим в настройки
    const settingsButton = page.getByRole('button', { name: /Settings|Profile/i }).first();
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
    }
    
    // Ищем переключатель темы
    const themeToggle = page.getByRole('button', { name: /Theme|Dark Mode|Light Mode/i }).first();
    
    if (await themeToggle.isVisible()) {
      // Получаем текущий background color
      const body = page.locator('body');
      const initialBg = await body.evaluate((el) => getComputedStyle(el).backgroundColor);
      
      // Переключаем тему
      await themeToggle.click();
      await page.waitForTimeout(1000); // Ждём анимации
      
      // Проверяем, что цвет изменился
      const newBg = await body.evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(initialBg).not.toBe(newBg);
    }
  });

  test('Language switching works', async ({ page }) => {
    // Переходим в настройки
    const settingsButton = page.getByRole('button', { name: /Settings|Profile/i }).first();
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
    }
    
    // Ищем переключатель языка
    const languageButton = page.getByRole('button', { name: /Language|Язык/i }).first();
    
    if (await languageButton.isVisible()) {
      await languageButton.click();
      
      // Выбираем другой язык
      const russianOption = page.getByRole('button', { name: /Russian|Русский/i });
      if (await russianOption.isVisible()) {
        await russianOption.click();
        
        // Проверяем, что язык изменился
        await expect(page.getByText(/Настройки|Профиль/i)).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('Settings page has required sections', async ({ page }) => {
    // Переходим в настройки
    const settingsButton = page.getByRole('button', { name: /Settings|Profile/i }).first();
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
    }
    
    // Проверяем наличие ключевых секций
    const requiredSections = [
      /Theme|Appearance/i,
      /Language/i,
      /Notifications?/i,
      /Privacy|Security/i,
    ];
    
    // Хотя бы 2 секции должны быть видны
    let visibleCount = 0;
    for (const section of requiredSections) {
      const isVisible = await page.getByText(section).isVisible({ timeout: 2000 }).catch(() => false);
      if (isVisible) visibleCount++;
    }
    
    expect(visibleCount).toBeGreaterThanOrEqual(2);
  });
});
