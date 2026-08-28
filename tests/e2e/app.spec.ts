import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('creates, persists, reopens, and exports an evidence card', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Keep the evidence/i);

  await page.getByLabel('Locality *').fill('Deerness coast');
  await page.getByLabel('Visual traits').fill('Grey upperwings, pale body, stiff-winged glide close to the cliff.');
  await page.getByLabel('No call heard').check();
  await page.locator('[data-candidate-id]').first().getByLabel('Species or working name').fill('Northern Fulmar');
  await page.locator('[data-candidate-id]').first().getByLabel('Fits and contradictions').fill('Flight fits; bill detail was not visible.');
  await page.getByLabel('Reasoning and next check').fill('Compare bill structure with a field guide before logging.');

  await expect(page.getByText('Complete · 5/5')).toBeVisible();
  await page.getByRole('button', { name: 'Save evidence card' }).click();
  await expect(page.getByText(/Filed locally/)).toBeVisible();
  await expect(page.getByText(/Complete evidence card saved locally/)).toBeVisible();

  await page.reload();
  await expect(page.getByLabel('Locality *')).toHaveValue('Deerness coast');
  await page.getByRole('button', { name: /Saved cards/ }).click();
  await expect(page.getByRole('heading', { name: 'Northern Fulmar', exact: true })).toBeVisible();
  await expect(page.getByText('Complete', { exact: true })).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Markdown' }).last().click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/northern-fulmar\.md$/);
});

test('passes a serious/critical accessibility scan and keyboard nav', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to evidence card' })).toBeFocused();
  const results = await new AxeBuilder({ page: page as any }).analyze();
  const blocking = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
  expect(blocking, blocking.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test('has no axe violations in the dark field treatment', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const results = await new AxeBuilder({ page: page as any }).analyze();
  expect(results.violations, results.violations.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([]);
});

test('never reissues a same-day card number after deletion', async ({ page }) => {
  test.setTimeout(60_000);
  const observedAt = '2026-08-28T10:00';
  const saveMinimalCard = async (locality: string): Promise<void> => {
    await page.getByLabel('Date & time *').fill(observedAt);
    await page.getByLabel('Locality *').fill(locality);
    await page.getByRole('button', { name: 'Save evidence card' }).click();
    await expect(page.getByText(/Filed locally/)).toBeVisible();
  };
  const startNewCard = async (): Promise<void> => {
    await page.getByRole('button', { name: 'Start a new card' }).click();
    await page.getByRole('button', { name: 'Start new card' }).click();
  };

  await page.goto('/');
  await saveMinimalCard('First headland');
  await startNewCard();
  await saveMinimalCard('Second headland');
  await page.getByRole('button', { name: /Saved cards/ }).click();
  const firstRecord = page.locator('.record-item').filter({ hasText: 'BID-20260828-001' });
  await firstRecord.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete card' }).click();
  await expect(firstRecord).toHaveCount(0);

  await page.getByRole('button', { name: 'Workbench' }).click();
  await startNewCard();
  await saveMinimalCard('Third headland');
  await page.getByRole('button', { name: /Saved cards/ }).click();
  await expect(page.locator('.record-item').filter({ hasText: 'BID-20260828-002' })).toHaveCount(1);
  await expect(page.locator('.record-item').filter({ hasText: 'BID-20260828-003' })).toHaveCount(1);
});

test('keeps mobile navigation and legal links at 44px', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Measured at the 390px mobile breakpoint.');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const controls = [page.locator('.wordmark'), ...await page.locator('.site-footer a').all()];
  for (const control of controls) {
    const box = await control.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);
  }
});

test('rejects malformed backup without emitting an expected console error', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/');
  await page.locator('#import-file').setInputFiles('tests/fixtures/invalid-backup.json');
  await expect(page.getByText(/not a valid Bird ID Evidence Card backup/i)).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test('loads the installed workbench offline', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Keep the evidence/i);
  await expect(page.getByText(/Offline field mode/)).toBeVisible();
  await page.getByLabel('Locality *').fill('Offline headland');
  await expect(page.getByLabel('Locality *')).toHaveValue('Offline headland');
  await context.setOffline(false);
});

test('keeps precise location behind an explicit control', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/Privacy shutter on/)).toBeVisible();
  await page.locator('input[name="locationPrecision"][value="precise"]').check();
  await expect(page.getByLabel('Latitude')).toBeVisible();
  await expect(page.getByText(/Precise coordinates will be exported/)).toBeVisible();
});
