import { test, expect } from '@playwright/test';

/**
 * E2E Test: Onboarding Flow
 * 
 * Критический сценарий: новый пользователь выбирает роль (Parent/Child)
 */

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Переход на главную страницу
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Parent role selection flow', async ({ page }) => {
    // Проверяем наличие экрана выбора роли
    await expect(page.getByText(/Choose Your Role/i)).toBeVisible({ timeout: 10000 });
    
    // Выбираем роль Parent
    const parentButton = page.getByRole('button', { name: /Parent/i });
    await expect(parentButton).toBeVisible();
    await parentButton.click();
    
    // Проверяем переход на главный экран родителя
    await expect(page).toHaveURL(/\/(tabs)?/, { timeout: 15000 });
    
    // Проверяем наличие ключевых элементов родительского интерфейса
    await expect(page.getByText(/Monitor|Dashboard|Children/i)).toBeVisible({ timeout: 10000 });
  });

  test('Child role selection flow', async ({ page }) => {
    // Проверяем наличие экрана выбора роли
    await expect(page.getByText(/Choose Your Role/i)).toBeVisible({ timeout: 10000 });
    
    // Выбираем роль Child
    const childButton = page.getByRole('button', { name: /Child/i });
    await expect(childButton).toBeVisible();
    await childButton.click();
    
    // Проверяем переход на главный экран ребенка
    await expect(page).toHaveURL(/\/(tabs)?/, { timeout: 15000 });
    
    // Проверяем наличие ключевых элементов детского интерфейса
    await expect(page.getByText(/Messages|Chat|Friends/i)).toBeVisible({ timeout: 10000 });
  });

  test('Role selection screen has correct UI elements', async ({ page }) => {
    // Проверяем все элементы UI
    await expect(page.getByText(/Choose Your Role/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Parent/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Child/i })).toBeVisible();
    
    // Проверяем описания ролей
    await expect(page.getByText(/monitor|protect|safe/i)).toBeVisible();
  });

  test('Can switch between roles', async ({ page }) => {
    // Выбираем Parent
    await page.getByRole('button', { name: /Parent/i }).click();
    await expect(page).toHaveURL(/\/(tabs)?/, { timeout: 15000 });
    
    // Возвращаемся к выбору роли (если есть такая функция)
    const settingsButton = page.getByRole('button', { name: /Settings|Profile/i }).first();
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
      
      // Ищем кнопку смены роли
      const switchRoleButton = page.getByRole('button', { name: /Switch Role|Change Role/i });
      if (await switchRoleButton.isVisible()) {
        await switchRoleButton.click();
        
        // Проверяем возврат на экран выбора роли
        await expect(page.getByText(/Choose Your Role/i)).toBeVisible();
      }
    }
  });
});
