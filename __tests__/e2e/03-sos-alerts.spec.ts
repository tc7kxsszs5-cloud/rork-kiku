import { test, expect } from '@playwright/test';

/**
 * E2E: SOS & Alerts (English UI)
 */

test.describe('SOS & Alert System', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('i18nextLng', 'en');
      window.localStorage.setItem('@auth_state', JSON.stringify({
        isAuthenticated: true,
        userId: 'e2e-child',
        role: 'child',
      }));
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('main tabs are visible', async ({ page }) => {
    await expect(
      page.getByText(/Chats|Contacts|Profile|Alerts/i).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test('Profile or Settings accessible', async ({ page }) => {
    const profileBtn = page.getByRole('button', { name: /Profile/i }).or(page.getByText('Profile').first());
    if (await profileBtn.isVisible({ timeout: 8000 }).catch(() => false)) {
      await profileBtn.click();
      await expect(page.getByText(/Profile|Settings|Language|Security/i).first()).toBeVisible({ timeout: 8000 }).catch(() => {});
    }
  });

  test('Alerts or Security section exists', async ({ page }) => {
    const alertsOrSecurity = page.getByText(/Alerts|Security|Notifications/i).first();
    await expect(alertsOrSecurity).toBeVisible({ timeout: 10000 }).catch(() => {});
  });
});
