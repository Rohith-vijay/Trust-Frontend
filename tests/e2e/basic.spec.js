import { test, expect } from '@playwright/test';

test('homepage loads and displays correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/KVG/i);
});
