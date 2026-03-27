import { test, expect } from '@playwright/test';

/**
 * E2E: Onboarding Flow (English UI)
 * App language is set to English via localStorage before each test.
 */

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('i18nextLng', 'en');
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('role selection screen shows English title and roles', async ({ page }) => {
    await expect(page.getByText(/Choose your role/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Parent').first()).toBeVisible();
    await expect(page.getByText('Child').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue/i })).toBeVisible();
  });

  test('Parent: select role and continue goes to register-parent', async ({ page }) => {
    await expect(page.getByText(/Choose your role/i)).toBeVisible({ timeout: 15000 });
    await page.getByTestId('role-selection-parent-card').click();
    await page.getByRole('button', { name: /Continue/i }).click();
    await expect(page).toHaveURL(/register-parent/, { timeout: 10000 });
  });

  test('Child: select role and continue goes to register-child', async ({ page }) => {
    await expect(page.getByText(/Choose your role/i)).toBeVisible({ timeout: 15000 });
    await page.getByTestId('role-selection-child-card').click();
    await page.getByRole('button', { name: /Continue/i }).click();
    await expect(page).toHaveURL(/register-child/, { timeout: 10000 });
  });

  test('role selection has descriptions (monitor, safe, etc.)', async ({ page }) => {
    await expect(page.getByText(/Choose your role/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/monitor|control|safe|protection/i)).toBeVisible();
  });
});
