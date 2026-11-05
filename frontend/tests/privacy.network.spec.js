import { expect, test } from '@playwright/test';

const marker = 'SYNTHETIC-PLAYWRIGHT-PRIVACY-MARKER-123!';

test('typing a synthetic password creates no password-bearing network request', async ({ page }) => {
  const captured = [];
  page.on('request', (request) => {
    captured.push({ url: request.url(), headers: request.headers(), body: request.postData() || '' });
  });

  await page.goto('/');
  await page.getByLabel('Enter a synthetic password').fill(marker);
  await expect(page.getByText('Your secret never becomes telemetry.')).toBeVisible();

  const serialized = JSON.stringify(captured);
  expect(serialized).not.toContain(marker);
  const persisted = await page.evaluate(() => JSON.stringify({
    localStorage: Object.fromEntries(Object.entries(localStorage)),
    sessionStorage: Object.fromEntries(Object.entries(sessionStorage)),
    cookies: document.cookie,
  }));
  expect(persisted).not.toContain(marker);
});

test('the analyzer remains usable after the network is disabled', async ({ page, context }) => {
  await page.goto('/');
  await context.setOffline(true);
  await page.getByLabel('Enter a synthetic password').fill(marker);
  await expect(page.getByText('Your secret never becomes telemetry.')).toBeVisible();
  await expect(page.getByText('Bundled education')).toBeVisible();
});
