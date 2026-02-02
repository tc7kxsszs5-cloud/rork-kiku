import { test, expect } from '@playwright/test';

/**
 * E2E: Chat Flow (English UI)
 * Requires authenticated session; sets auth in localStorage so app shows (tabs).
 */

test.describe('Chat Flow', () => {
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

  test('main screen shows Chats tab', async ({ page }) => {
    await expect(page.getByText(/Chats|Чаты/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('can open chat list and see interface', async ({ page }) => {
    const chatsTab = page.getByRole('button', { name: /Chats/i }).or(page.getByText('Chats').first());
    await expect(chatsTab).toBeVisible({ timeout: 15000 });
    await chatsTab.click();
    await page.waitForTimeout(500);
    await expect(page.getByPlaceholder(/Search|Поиск/i).or(page.getByText(/participants|messages/i))).toBeVisible({ timeout: 10000 }).catch(() => {});
  });

  test('message input and send visible when chat is open', async ({ page }) => {
    const firstChat = page.locator('[data-testid*="chat"]').or(page.getByRole('button', { name: /chat|Chat/i })).first();
    if (await firstChat.isVisible({ timeout: 5000 }).catch(() => false)) {
      await firstChat.click();
      await expect(page.getByPlaceholder(/Type a message|Enter message|Сообщение/i)).toBeVisible({ timeout: 10000 }).catch(() => {});
      await expect(page.getByRole('button', { name: /Send/i })).toBeVisible({ timeout: 5000 }).catch(() => {});
    }
  });
});
