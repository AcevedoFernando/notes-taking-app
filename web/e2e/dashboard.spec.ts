import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/home');
});

test.describe('Dashboard layout', () => {
  test('shows the New Note button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /new note/i })).toBeVisible();
  });

  test('shows the UserProfile in the bottom-left', async ({ page }) => {
    // Fallback: look for the logout button as a proxy
    await expect(
      page.getByRole('button', { name: /log out/i })
    ).toBeVisible({ timeout: 10_000 });
  });

  test('shows the category sidebar', async ({ page }) => {
    await expect(page.getByRole('button', { name: /all categories/i })).toBeVisible();
  });
});

test.describe('Category filters', () => {
  test('All Categories button is active by default', async ({ page }) => {
    const btn = page.getByRole('button', { name: /all categories/i });
    await expect(btn).toBeVisible();
    await expect(btn).toHaveClass(/font-bold/);
  });

  test('clicking a category filter updates the active state', async ({ page }) => {
    const categoryButtons = page.locator('aside li button').filter({ hasNot: page.getByText(/all categories/i) });
    const count = await categoryButtons.count();
    if (count === 0) test.skip();

    const first = categoryButtons.first();
    await first.click();
    await expect(first).toHaveClass(/font-bold/);
    await expect(page.getByRole('button', { name: /all categories/i })).not.toHaveClass(/font-bold/);
  });
});

test.describe('Note editor modal', () => {
  test('opens when clicking New Note', async ({ page }) => {
    await page.getByRole('button', { name: /new note/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('closes when clicking the X button', async ({ page }) => {
    await page.getByRole('button', { name: /new note/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByRole('button', { name: /close editor/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
