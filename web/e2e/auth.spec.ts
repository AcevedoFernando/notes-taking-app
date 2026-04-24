import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_EMAIL ?? '';
const TEST_PASSWORD = process.env.TEST_PASSWORD ?? '';

test.describe('Auth redirects', () => {
  test('root / redirects to /auth/login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('/home redirects to /auth/login when unauthenticated', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/home');
    await expect(page).toHaveURL(/auth\/login/);
  });
});

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
  });

  test('shows the login form', async ({ page }) => {
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('shows error toast on invalid credentials', async ({ page }) => {
    await page.getByPlaceholder('Email').fill('wrong@example.com');
    await page.getByPlaceholder('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('[data-sonner-toast][data-type="error"]')).toBeVisible({ timeout: 5_000 });
  });

  test('valid credentials redirect to /home', async ({ page }) => {
    test.skip(!TEST_EMAIL || !TEST_PASSWORD, 'TEST_EMAIL / TEST_PASSWORD not set');

    await page.getByPlaceholder('Email').fill(TEST_EMAIL);
    await page.getByPlaceholder('Password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/\/home/, { timeout: 10_000 });
  });

  test('navigates to sign-up page via link', async ({ page }) => {
    await page.getByRole('link', { name: "Oops! I've never been here before" }).click();
    await expect(page).toHaveURL(/sign-up/);
  });
});

test.describe('Sign-up page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/sign-up');
  });

  test('shows the sign-up form', async ({ page }) => {
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
  });

  test('navigates to login page via link', async ({ page }) => {
    await page.getByRole('link', { name: "We're already friends!" }).click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
