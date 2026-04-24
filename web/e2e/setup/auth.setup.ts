import { test as setup, expect } from '@playwright/test';
import path from 'path';

const AUTH_FILE = path.join(__dirname, '../.auth/user.json');

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
const TEST_EMAIL = process.env.TEST_EMAIL ?? '';
const TEST_PASSWORD = process.env.TEST_PASSWORD ?? '';

setup('authenticate', async ({ page }) => {
  if (!TEST_EMAIL || !TEST_PASSWORD) {
    throw new Error('Set TEST_EMAIL and TEST_PASSWORD env vars before running E2E tests.');
  }

  const res = await page.request.post(`${API_URL}/auth/token/`, {
    data: { email: TEST_EMAIL, password: TEST_PASSWORD },
  });

  expect(res.ok(), `Login failed: ${await res.text()}`).toBeTruthy();

  const { access, refresh } = await res.json();

  await page.context().addCookies([
    {
      name: 'access_token',
      value: access,
      domain: 'localhost',
      path: '/',
      sameSite: 'Strict',
    },
    {
      name: 'refresh_token',
      value: refresh,
      domain: 'localhost',
      path: '/',
      sameSite: 'Strict',
    },
  ]);

  // Verify the cookies unlock /home
  await page.goto('/home');
  await expect(page).not.toHaveURL(/auth\/login/);

  await page.context().storageState({ path: AUTH_FILE });
});
