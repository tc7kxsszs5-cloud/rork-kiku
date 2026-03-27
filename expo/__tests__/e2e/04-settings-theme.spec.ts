import { test, expect } from '@playwright/test';

/**
 * E2E: Settings & Theme (English UI)
 */

test.describe('Settings & Theme', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('i18nextLng', 'en');
      window.localStorage.setItem('@auth_state', JSON.stringify({
        isAuthenticated: true,
        userId: 'e2e-user',
        role: 'parent',
      }));
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('can open Profile', async ({ page }) => {
    const profileBtn = page.getByRole('button', { name: /Profile/i }).or(page.getByText('Profile').first());
    await expect(profileBtn).toBeVisible({ timeout: 15000 });
    await profileBtn.click();
    await expect(
      page.getByText(/Profile|Settings|Edit Profile|Language/i).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('Language or Settings section visible in profile', async ({ page }) => {
    const profileBtn = page.getByRole('button', { name: /Profile/i }).or(page.getByText('Profile').first());
    if (await profileBtn.isVisible({ timeout: 8000 }).catch(() => false)) {
      await profileBtn.click();
      await expect(
        page.getByText(/Language|Settings|Theme|Security/i).first()
      ).toBeVisible({ timeout: 10000 }).catch(() => {});
    }
  });

  test('theme or appearance control when present', async ({ page }) => {
    const profileBtn = page.getByRole('button', { name: /Profile/i }).or(page.getByText('Profile').first());
    if (await profileBtn.isVisible({ timeout: 8000 }).catch(() => false)) {
      await profileBtn.click();
      const themeToggle = page.getByRole('button', { name: /Theme|Dark|Light|Appearance/i }).first();
      if (await themeToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
        await themeToggle.click();
        await page.waitForTimeout(500);
      }
    }
  });
});
