import { test, expect } from '@playwright/test';

test('donation flow with sandboxed payment simulation', async ({ page }) => {
  // Capture page console logs
  page.on('console', msg => {
    console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
  });

  // Mock Cloudflare Turnstile globally before the page loads
  await page.addInitScript(() => {
    window.turnstile = {
      render: (container, options) => {
        console.log('Playwright Mock Turnstile render invoked.');
        // Simulate Turnstile success callback after a short delay
        setTimeout(() => {
          if (options.callback) {
            console.log('Playwright Mock Turnstile calling callback with token.');
            options.callback('mock-turnstile-token-12345');
          }
        }, 1000);
        return 'mock-widget-id-xyz';
      },
      remove: (widgetId) => {
        console.log('Playwright Mock Turnstile remove invoked for:', widgetId);
      },
      reset: (container) => {
        console.log('Playwright Mock Turnstile reset invoked.');
      }
    };
  });

  // 1. Navigate to the donation page
  await page.goto('/donation');

  // 2. Fill in the donation form details using Playwright getByLabel
  await page.getByLabel('Custom Amount (₹)').fill('1000');
  await page.getByLabel('Full Name').fill('Kvg shanmukhsai Trust');
  await page.getByLabel('Email Address').fill('test@example.com');
  await page.getByLabel('PAN Card Number').fill('HFSPR1315K');
  await page.getByLabel('Full Postal Address').fill('123 Test Street');

  // 3. Wait for Turnstile mock callback to execute
  console.log('Waiting for Turnstile verification...');
  await page.waitForTimeout(3000);

  // 4. Click the submit / Donate button
  console.log('Submitting donation form...');
  await page.click('button[type="submit"]');

  // 5. Verify the Sandbox Simulator dialog opens
  console.log('Waiting for Sandbox Simulator...');
  const dialog = page.locator('div[role="dialog"]');
  await expect(dialog).toBeVisible({ timeout: 10000 });

  // 6. Click the "Simulate Payment Success (Card)" button
  console.log('Simulating payment success...');
  const successButton = page.locator('button:has-text("Simulate Payment Success (Card)")');
  await expect(successButton).toBeVisible();
  await successButton.click();

  // 7. Verify the success receipt is displayed
  console.log('Waiting for success receipt...');
  const receiptTitle = page.locator('h5:has-text("Donation Completed Successfully")');
  await expect(receiptTitle).toBeVisible({ timeout: 15000 });

  // Verify the receipt displays the correct donor name and email
  await expect(page.locator('text=Kvg shanmukhsai Trust')).toBeVisible();
  await expect(page.locator('text=test@example.com')).toBeVisible();
  await expect(page.locator('text=₹1,000')).toBeVisible();

  console.log('Donation flow test completed successfully!');
});
