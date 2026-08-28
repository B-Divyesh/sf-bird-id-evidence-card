import { expect, test, type Download, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const sampleTitle = /Northern Fulmar/i;
const downloadText = async (download: Download): Promise<string> => {
  const stream = await download.createReadStream();
  if (!stream) throw new Error('Download stream unavailable');
  let text = '';
  for await (const chunk of stream) text += chunk.toString();
  return text;
};
const databaseSnapshot = async (page: Page, name: string): Promise<string> => page.evaluate(async (databaseName) => {
  const open = indexedDB.open(databaseName);
  const database = await new Promise<IDBDatabase>((resolve, reject) => { open.onsuccess = () => resolve(open.result); open.onerror = () => reject(open.error); });
  const snapshot: Record<string, unknown[]> = {};
  for (const storeName of Array.from(database.objectStoreNames)) {
    const transaction = database.transaction(storeName);
    const request = transaction.objectStore(storeName).getAll();
    snapshot[storeName] = await new Promise<unknown[]>((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
  }
  database.close();
  return JSON.stringify(snapshot);
}, name);

test('@claim:record-evidence-card saves and reopens a completed evidence card', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Visual traits').fill('Pale seabird banking below the cliff with a stiff-winged glide.');
  await page.getByRole('button', { name: 'Save evidence card' }).click();
  await expect(page.getByText(/Complete evidence card saved locally|Filed locally/i).first()).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Visual traits')).toHaveValue(/Pale seabird banking/);
  await page.getByRole('link', { name: /View saved cards/ }).click();
  await page.getByRole('button', { name: 'Open card' }).click();
  await expect(page.getByLabel('Locality *')).toHaveValue('Deerness coast, Orkney');
  await expect(page.getByRole('radio', { name: /Unresolved/ })).toBeChecked();
});

test('@claim:separate-observation-and-suggestion keeps fields distinct', async ({ page }) => {
  await page.goto('/demo');
  const snapshot = await databaseSnapshot(page, 'demo:bird-id-evidence-card');
  expect(snapshot).toContain('Large pale seabird banking below the cliff');
  expect(snapshot).toContain('Northern Fulmar');
  expect(snapshot).toContain('Field app suggestion');
  const csvWait = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).first().click();
  const csv = await downloadText(await csvWait);
  expect(csv).toContain('visual_traits');
  expect(csv).toContain('candidate_species');
});

test('@claim:no-automatic-identification keeps identification status user-selected', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Visual traits').fill('A changed observation without a species conclusion.');
  await expect(page.getByRole('radio', { name: /Unresolved/ })).toBeChecked();
  await expect(page.getByRole('radio', { name: /Verified/ })).not.toBeChecked();
  await expect(page.locator('#preview-status')).toHaveText('UNRESOLVED');
});

test('@claim:offline-demo works offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1, name: /current evidence card/i })).toBeVisible();
  await expect(page.getByText(/Offline field mode/)).toBeVisible();
  await page.getByLabel('Locality *').fill('Offline Deerness coast');
  await expect(page.getByLabel('Locality *')).toHaveValue('Offline Deerness coast');
  await context.setOffline(false);
});

test('@claim:device-only sends only same-origin requests during demo', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await expect(page.getByText(sampleTitle).first()).toBeVisible();
  await page.getByLabel('Visual traits').fill('Updated sample observation.');
  await page.getByRole('button', { name: 'Save evidence card' }).click();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
});

test('@claim:free opens and uses the sample without an account or payment prompt', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText(sampleTitle).first()).toBeVisible();
  await page.getByRole('button', { name: 'Save evidence card' }).click();
  await expect(page.getByText(/Filed locally|saved locally/i).first()).toBeVisible();
  await expect(page.getByText(/sign in|payment|subscribe/i)).toHaveCount(0);
});

test('@claim:demo-isolation keeps a seeded real database unchanged', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Date & time *').fill('2026-08-28T10:12');
  await page.getByLabel('Locality *').fill('REAL STORAGE SENTINEL');
  await page.getByLabel('Visual traits').fill('Sentinel observation');
  await page.getByRole('button', { name: 'Save evidence card' }).click();
  const before = await databaseSnapshot(page, 'bird-id-evidence-card');
  await page.goto('/demo');
  await expect(page.getByText(/Demo — sample data, nothing is saved/)).toBeVisible();
  await expect(page.getByText(sampleTitle).first()).toBeVisible();
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map((item) => item.name));
  expect(databases).toContain('demo:bird-id-evidence-card');
  await page.getByLabel('Locality *').fill('Changed demo locality');
  await page.getByRole('button', { name: 'Save evidence card' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Locality *')).toHaveValue('Deerness coast, Orkney');
  await page.getByRole('link', { name: 'Start a blank card' }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(await databaseSnapshot(page, 'bird-id-evidence-card')).toBe(before);
});

test('@claim:exports downloads CSV, Markdown, and JSON from the sample', async ({ page }) => {
  await page.goto('/demo');
  const csvWait = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).first().click();
  const csv = await csvWait;
  expect(csv.suggestedFilename()).toMatch(/\.csv$/);
  expect(await downloadText(csv)).toContain('card_number');
  const markdownWait = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Markdown' }).first().click();
  expect((await markdownWait).suggestedFilename()).toMatch(/\.md$/);
  await page.getByRole('link', { name: /View saved cards/ }).click();
  const jsonWait = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup' }).click();
  expect((await jsonWait).suggestedFilename()).toMatch(/\.json$/);
});

test('@claim:private-coordinates omits coordinates from locality-only CSV', async ({ page }) => {
  await page.goto('/demo');
  const downloadWait = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).first().click();
  const download = await downloadWait;
  const content = await downloadText(download);
  expect(content).toContain('"private"');
  expect(content).toContain('"private","",""');
});

test('@claim:no-audio-fetch does not request the sample reference URL', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await expect(page.locator('input[value="https://xeno-canto.org/species/Fulmarus-glacialis"]')).toBeVisible();
  expect(requests.some((url) => url.includes('xeno-canto.org'))).toBeFalsy();
});

test('@claim:stored-card-schema stores entries, number, timestamps, and status', async ({ page }) => {
  await page.goto('/demo');
  const snapshot = await databaseSnapshot(page, 'demo:bird-id-evidence-card');
  expect(snapshot).toContain('BID-20260828-001');
  expect(snapshot).toContain('createdAt');
  expect(snapshot).toContain('updatedAt');
  expect(snapshot).toContain('unresolved');
  expect(snapshot).toContain('Deerness coast, Orkney');
});

test('@claim:no-tracking-or-remote-assets loads no tracking or remote resources', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByLabel('Locality *').fill('Tracked nowhere');
  await page.getByRole('button', { name: 'Save evidence card' }).click();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
  expect(requests.some((url) => /analytics|collect|pixel|doubleclick|xeno-canto/i.test(url))).toBeFalsy();
  const resources = await page.evaluate(() => performance.getEntriesByType('resource').map((entry) => entry.name));
  expect(resources.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
});

test('first phone screen states the job, audience, action, and outcome', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Phone viewport check.');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  for (const text of [
    'Record bird evidence before you log.',
    'For birders checking an app suggestion against what they saw and heard.',
    'Try it with sample data',
    'See a completed uncertain-sighting card.'
  ]) await expect(page.getByText(text, { exact: true })).toBeInViewport();
});

test('routes use meaningful titles and navigation restores focus', async ({ page }) => {
  await page.goto('/guide');
  await expect(page).toHaveTitle(/Evidence guide/);
  await page.getByRole('link', { name: /View saved cards/ }).click();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1, name: /check an uncertain bird in four steps/i })).toBeFocused();
  await page.getByRole('link', { name: /View saved cards/ }).click();
  await expect(page).toHaveURL(/\/records$/);
  await expect(page.getByRole('heading', { level: 1, name: /saved evidence cards/i })).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/\/guide$/);
});

test('accessibility and keyboard baseline pass in both color treatments', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to evidence card' })).toBeFocused();
  const light = await new AxeBuilder({ page: page as any }).analyze();
  expect(light.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.reload();
  const dark = await new AxeBuilder({ page: page as any }).analyze();
  expect(dark.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('legal documents have common chrome and metadata', async ({ page }) => {
  for (const path of ['/privacy/', '/terms/']) {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    await expect(page.getByText(/Built by Param Factory/)).toBeVisible();
  }
});
