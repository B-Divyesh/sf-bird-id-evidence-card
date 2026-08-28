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
  await page.goto('/?demo=1');
  await page.getByLabel('Visual traits').fill('Pale seabird banking below the cliff with a stiff-winged glide.');
  await page.getByRole('button', { name: 'Save evidence card' }).click();
  await expect(page.getByText(/Complete evidence card saved on this device|Saved on this device/i).first()).toBeVisible();
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
  await expect(page.getByText(/No connection/)).toBeVisible();
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
  await expect(page.getByText(/Saved on this device/i).first()).toBeVisible();
  await expect(page.getByText(/payment|subscribe|purchase/i)).toHaveCount(0);
});

test('@claim:no-account completes the sample flow without account setup', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Save evidence card' }).click();
  await expect(page.getByText(/Saved on this device/i).first()).toBeVisible();
  await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);
  await expect(page.getByText(/sign in|create an account|log in/i)).toHaveCount(0);
  expect(requests.some((url) => /auth|login|account/i.test(new URL(url).pathname))).toBeFalsy();
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
  expect(await databaseSnapshot(page, 'demo:bird-id-evidence-card')).not.toContain('demo-deerness-fulmar');
  expect(await databaseSnapshot(page, 'bird-id-evidence-card')).toBe(before);
});

test('@claim:exports downloads and imports complete CSV, Markdown, and JSON files', async ({ page, browser }) => {
  await page.goto('/demo');
  const csvWait = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).first().click();
  const csv = await csvWait;
  expect(csv.suggestedFilename()).toMatch(/\.csv$/);
  const csvText = await downloadText(csv);
  expect(csvText).toContain('card_number');
  expect(csvText).toContain('Deerness coast, Orkney');
  expect(csvText.trim().split('\n')).toHaveLength(2);
  const markdownWait = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Markdown' }).first().click();
  const markdown = await markdownWait;
  expect(markdown.suggestedFilename()).toMatch(/\.md$/);
  const markdownText = await downloadText(markdown);
  expect(markdownText).toContain('## Observed evidence');
  expect(markdownText).toContain('Northern Fulmar');
  expect(markdownText).toContain('unresolved');
  await page.getByRole('link', { name: /View saved cards/ }).click();
  const jsonWait = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup' }).click();
  const json = await jsonWait;
  expect(json.suggestedFilename()).toMatch(/\.json$/);
  const backup = JSON.parse(await downloadText(json));
  expect(backup.product).toBe('bird-id-evidence-card');
  expect(backup.cards).toHaveLength(1);
  expect(backup.cards[0].locationName).toBe('Deerness coast, Orkney');

  const backupPath = await json.path();
  if (!backupPath) throw new Error('Backup download path unavailable');
  const freshContext = await browser.newContext();
  const freshPage = await freshContext.newPage();
  await freshPage.goto('http://127.0.0.1:4173/records');
  await freshPage.locator('#import-file').setInputFiles(backupPath);
  await expect(freshPage.getByText('Deerness coast, Orkney')).toBeVisible();
  await expect(freshPage.getByText('Imported 1 card. Existing copies of those cards were replaced.')).toBeVisible();
  await freshContext.close();
});

test('@claim:private-coordinates defaults to locality-only and requires two valid coordinates', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('radio', { name: /Private/ })).toBeChecked();
  await page.getByRole('radio', { name: /Precise/ }).check();
  await page.getByLabel('Latitude').fill('58.938');
  await page.getByLabel('Longitude').fill('-2.744');
  await page.getByRole('radio', { name: /Private/ }).check();
  const downloadWait = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).first().click();
  const download = await downloadWait;
  const content = await downloadText(download);
  expect(content).toContain('"private"');
  expect(content).toContain('"private","",""');
  expect(content).not.toContain('58.938');
  const privateMarkdownWait = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Markdown' }).first().click();
  expect(await downloadText(await privateMarkdownWait)).not.toContain('58.938');

  await page.getByRole('radio', { name: /Precise/ }).check();
  await page.getByLabel('Longitude').fill('');
  const incompleteWait = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).first().click();
  expect(await downloadText(await incompleteWait)).not.toContain('58.938');

  await page.getByLabel('Longitude').fill('-2.744');
  const preciseWait = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).first().click();
  const precise = await downloadText(await preciseWait);
  expect(precise).toContain('58.938');
  expect(precise).toContain('-2.744');
  const preciseMarkdownWait = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Markdown' }).first().click();
  expect(await downloadText(await preciseMarkdownWait)).toContain('58.938, -2.744');
});

test('@claim:no-audio-fetch stores the reference as text without requesting it', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await expect(page.locator('input[value="https://xeno-canto.org/species/Fulmarus-glacialis"]')).toBeVisible();
  const snapshot = await databaseSnapshot(page, 'demo:bird-id-evidence-card');
  expect(snapshot).toContain('https://xeno-canto.org/species/Fulmarus-glacialis');
  expect(snapshot).toContain('Open recording catalogue reference.');
  expect(requests.some((url) => url.includes('xeno-canto.org'))).toBeFalsy();
});

test('@claim:delete-card removes the chosen card from browser storage', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'View saved cards' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Delete card' }).click();
  await expect(page.getByRole('heading', { name: 'No saved cards yet' })).toBeVisible();
  expect(await databaseSnapshot(page, 'demo:bird-id-evidence-card')).not.toContain('demo-deerness-fulmar');
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
  expect(await page.evaluate(() => ({ cookies: document.cookie, localKeys: Object.keys(localStorage) }))).toEqual({ cookies: '', localKeys: [] });
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
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText(/Demo — sample data, nothing is saved/)).toBeVisible();
  await expect(page.getByText(sampleTitle).first()).toBeVisible();
});

test('routes use meaningful titles and navigation restores focus', async ({ page }) => {
  await page.goto('/guide');
  await expect(page).toHaveTitle(/Evidence guide/);
  await page.getByRole('link', { name: /View saved cards/ }).click();
  await page.goBack();
  const guideHeading = page.getByRole('heading', { level: 1, name: /check an uncertain bird in four steps/i });
  await expect(guideHeading).toBeFocused();
  await expect(guideHeading).toBeInViewport();
  await page.getByRole('link', { name: /View saved cards/ }).click();
  await expect(page).toHaveURL(/\/records$/);
  await expect(page.getByRole('heading', { level: 1, name: /saved evidence cards/i })).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/\/guide$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/records$/);
  await expect(page.getByRole('heading', { level: 1, name: /saved evidence cards/i })).toBeFocused();
});

test('route responses and rendered pages contain one route-specific h1', async ({ page, request }) => {
  const routes = [
    ['/', 'Record bird evidence before you'],
    ['/demo', 'Your current evidence card'],
    ['/records', 'Saved evidence cards'],
    ['/guide', 'Check an uncertain bird in four steps']
  ] as const;
  for (const [path, heading] of routes) {
    const response = await request.get(path);
    expect(response.ok()).toBeTruthy();
    const html = await response.text();
    expect(html.match(/<h1\b/g)?.length ?? 0).toBe(1);
    expect(html.match(new RegExp(`<h1[^>]*>[\\s\\S]*${heading}`, 'i'))).toBeTruthy();
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1, name: new RegExp(heading, 'i') })).toBeVisible();
    await expect(page.locator('.nav-button[aria-current="page"]')).toHaveCount(1);
  }
});

test('accessibility and keyboard baseline pass in both color treatments', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to evidence card' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  const light = await new AxeBuilder({ page: page as any }).analyze();
  expect(light.violations).toEqual([]);
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.reload();
  const dark = await new AxeBuilder({ page: page as any }).analyze();
  expect(dark.violations).toEqual([]);
});

test('all routes have no axe violations, horizontal overflow, or undersized chrome targets', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByLabel('Date & time *').fill('2026-08-28T10:12');
  await page.getByLabel('Locality *').fill('Accessibility route check');
  await page.getByRole('button', { name: 'Save evidence card' }).click();
  const paths = ['/', '/demo', '/records', '/guide', '/privacy/', '/terms/', '/404.html', '/offline.html'];
  for (const path of paths) {
    await page.goto(path);
    const results = await new AxeBuilder({ page: page as any }).analyze();
    expect(results.violations, `${path} accessibility violations`).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${path} horizontal overflow`).toBeTruthy();
    if (testInfo.project.name === 'mobile-chromium') {
      const undersized = await page.locator('header a, footer a, button, .legal-action').evaluateAll((elements) => elements
        .filter((element) => {
          const style = getComputedStyle(element);
          const box = element.getBoundingClientRect();
          return box.width > 0 && box.height > 0 && style.display !== 'none' && style.visibility !== 'hidden' && (box.width < 44 || box.height < 44);
        })
        .map((element) => ({ text: element.textContent?.trim(), box: element.getBoundingClientRect().toJSON() })));
      expect(undersized, `${path} undersized controls`).toEqual([]);
    }
  }
});

test('all public pages share navigation, footer links, build id, and complete metadata', async ({ page }) => {
  const paths = [
    ['/', 'Bird ID Evidence Card — record uncertain sightings', '/'],
    ['/demo', 'Demo — Bird ID Evidence Card', '/demo'],
    ['/records', 'Saved cards — Bird ID Evidence Card', '/records'],
    ['/guide', 'Evidence guide — Bird ID Evidence Card', '/guide'],
    ['/privacy/', 'Privacy — Bird ID Evidence Card', '/privacy/'],
    ['/terms/', 'Terms — Bird ID Evidence Card', '/terms/'],
    ['/404.html', 'Page not found — Bird ID Evidence Card', '/404'],
    ['/offline.html', 'Offline — Bird ID Evidence Card', '/offline.html']
  ] as const;
  const expectedPrimary = ['Edit evidence card', 'Try sample data', 'View saved cards', 'Read the evidence guide'];
  const expectedFooter = ['Privacy', 'Terms', 'How it works'];
  for (const [path, title, canonicalPath] of paths) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://bird-id-evidence-card.sociobot.in${canonicalPath}`);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveCount(1);
    expect((await page.locator('meta[name="description"]').getAttribute('content'))?.length).toBeLessThanOrEqual(155);
    const primary = page.getByRole('navigation', { name: 'Primary' });
    await expect(primary).toBeVisible();
    expect(await primary.getByRole('link').allTextContents()).toEqual(expectedPrimary);
    expect(await page.getByRole('navigation', { name: 'Legal and project' }).getByRole('link').allTextContents()).toEqual(expectedFooter);
    await expect(page.getByText(/Built by Param Factory · v1\.0\.4/)).toBeVisible();
  }
});

test('state messages use evidence-card terms and action-specific dialog headings', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('#save-status')).toHaveText(/Draft restored from this device|Ready on this device/);
  await page.getByRole('button', { name: 'Start a new card' }).click();
  const newDialog = page.getByRole('dialog');
  await expect(newDialog.getByRole('heading', { name: 'Start a new evidence card?' })).toBeVisible();
  await expect(newDialog).toContainText('stays under Saved evidence cards');
  await newDialog.getByRole('button', { name: 'Keep card' }).click();

  await page.getByRole('link', { name: 'View saved cards' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  const deleteDialog = page.getByRole('dialog');
  await expect(deleteDialog.getByRole('heading', { name: 'Delete this evidence card?' })).toBeVisible();
  await expect(deleteDialog).toContainText('exported backup');
  await deleteDialog.getByRole('button', { name: 'Keep card' }).click();

  await page.evaluate(() => navigator.serviceWorker.dispatchEvent(new MessageEvent('message', { data: { type: 'UPDATE_AVAILABLE' } })));
  await expect(page.getByText('An update is ready.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Load update' })).toBeVisible();
});

test('invalid input and import errors explain recovery without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/demo');
  await page.getByLabel('Locality *').fill('');
  await page.getByRole('button', { name: 'Save evidence card' }).click();
  await expect(page.getByRole('alert')).toContainText('Add the required date and locality');
  await expect(page.getByLabel('Locality *')).toBeFocused();
  await page.getByLabel('Locality *').fill('Deerness coast, Orkney');
  await page.getByLabel('Source URL').fill('not a URL');
  await page.getByRole('button', { name: 'Save evidence card' }).click();
  await expect(page.getByRole('alert')).toContainText('check any reference URLs');
  await expect(page.getByLabel('Source URL')).toBeFocused();
  await page.getByRole('link', { name: 'View saved cards' }).click();
  await page.locator('#import-file').setInputFiles('tests/fixtures/invalid-backup.json');
  await expect(page.getByText('That file is not a valid Bird ID Evidence Card backup. No data was changed.')).toBeVisible();
  expect(errors).toEqual([]);
});

test('the installed app shell opens demo and legal routes offline', async ({ page, context }) => {
  await page.goto('/');
  const manifest = await page.evaluate(async () => fetch((document.querySelector('link[rel="manifest"]') as HTMLLinkElement).href).then((response) => response.json()));
  expect(manifest.display).toBe('standalone');
  expect(manifest.icons.some((icon: { purpose?: string }) => icon.purpose?.includes('maskable'))).toBeTruthy();
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await context.setOffline(true);
  for (const [path, heading] of [
    ['/demo', /Your current evidence card/i],
    ['/privacy/', /Your evidence cards stay on this device/i],
    ['/terms/', /Use evidence cards as notes, not verdicts/i]
  ] as const) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  }
  const fallbackResponse = await page.goto('/offline.html', { waitUntil: 'domcontentloaded' });
  expect(fallbackResponse?.fromServiceWorker()).toBeTruthy();
  await expect(page).toHaveTitle('Offline — Bird ID Evidence Card');
  await expect(page.getByRole('heading', { level: 1, name: 'That page is not available offline.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Edit an evidence card' })).toHaveCSS('min-height', '44px');
  await context.setOffline(false);
});
