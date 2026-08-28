import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';

const baseURL = (process.argv[2] ?? 'https://bird-id-evidence-card.sociobot.in').replace(/\/$/, '');
const evidenceDir = path.resolve(process.argv[3] ?? '.factory/evidence/polish-3/live');
const origin = new URL(baseURL).origin;
const results = { baseURL, checkedAt: new Date().toISOString(), routes: {}, checks: [] };

const pass = (name, detail = 'passed') => results.checks.push({ name, detail });
const databaseSnapshot = async (page, name) => page.evaluate(async (databaseName) => {
  const opening = indexedDB.open(databaseName);
  const database = await new Promise((resolve, reject) => {
    opening.onsuccess = () => resolve(opening.result);
    opening.onerror = () => reject(opening.error);
  });
  const snapshot = {};
  for (const storeName of Array.from(database.objectStoreNames)) {
    const request = database.transaction(storeName).objectStore(storeName).getAll();
    snapshot[storeName] = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  database.close();
  return JSON.stringify(snapshot);
}, name);

await mkdir(evidenceDir, { recursive: true });

const expectedRoutes = [
  ['/', 'Bird ID Evidence Card — record uncertain sightings', 'Record bird evidence before you log.', '/'],
  ['/demo', 'Demo — Bird ID Evidence Card', 'Your current evidence card', '/demo'],
  ['/records', 'Saved cards — Bird ID Evidence Card', 'Saved evidence cards', '/records'],
  ['/guide', 'Evidence guide — Bird ID Evidence Card', 'Check an uncertain bird in four steps', '/guide'],
  ['/privacy/', 'Privacy — Bird ID Evidence Card', 'Your evidence cards stay on this device', '/privacy/'],
  ['/terms/', 'Terms — Bird ID Evidence Card', 'Use evidence cards as notes, not verdicts', '/terms/']
];

for (const [route, title, heading] of expectedRoutes) {
  const response = await fetch(`${baseURL}${route}`, { cache: 'no-store' });
  const html = await response.text();
  assert.equal(response.status, 200, `${route} should return 200`);
  assert.equal(html.match(/<h1\b/gi)?.length ?? 0, 1, `${route} raw response should contain one h1`);
  const rawHeading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
    .replace(/<[^>]+>/g, '')
    .replaceAll('&amp;', '&')
    .replaceAll('&#39;', "'")
    .trim() ?? '';
  assert.match(rawHeading, new RegExp(heading, 'i'), `${route} should contain its route heading`);
  results.routes[route] = { status: response.status, title, heading };
}
const missingResponse = await fetch(`${baseURL}/cold-live-404-check`, { cache: 'no-store' });
const missingHTML = await missingResponse.text();
assert.equal(missingResponse.status, 404);
assert.equal(missingHTML.match(/<h1\b/gi)?.length ?? 0, 1);
assert.match(missingHTML, /That evidence card page is not here/);
results.routes['/cold-live-404-check'] = { status: 404, title: 'Page not found — Bird ID Evidence Card', heading: 'That evidence card page is not here.' };
const rootHeaders = await fetch(`${baseURL}/`, { cache: 'no-store' });
assert.match(rootHeaders.headers.get('content-security-policy') ?? '', /default-src 'self'/);
assert.equal(rootHeaders.headers.get('x-content-type-options'), 'nosniff');
assert.equal(rootHeaders.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
pass('HTTP routes, raw headings, 404, and security headers', 'six 200 routes; unknown route 404; CSP, nosniff, and referrer policy present');

const browser = await chromium.launch({ executablePath: chromium.executablePath(), args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'allow' });
  const page = await context.newPage();
  const runtimeErrors = [];
  const requests = [];
  page.on('pageerror', (error) => runtimeErrors.push(String(error)));
  page.on('console', (message) => { if (message.type() === 'error') runtimeErrors.push(message.text()); });
  page.on('request', (request) => requests.push(request.url()));

  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  for (const text of [
    'Record bird evidence before you log.',
    'For birders checking an app suggestion against what they saw and heard.',
    'Try it with sample data',
    'See a completed uncertain-sighting card.'
  ]) {
    const item = page.getByText(text, { exact: true });
    await item.waitFor({ state: 'visible' });
    const box = await item.boundingBox();
    assert.ok(box && box.y < 844 && box.y + box.height > 0, `${text} must appear in the first phone screen`);
  }
  await page.screenshot({ path: path.join(evidenceDir, 'home-mobile.png'), fullPage: false });
  pass('First phone screen', 'job, audience, sample action, and next outcome are visible at 390×844');

  await page.getByLabel('Date & time *').fill('2026-08-28T10:12');
  await page.getByLabel('Locality *').fill('LIVE REAL STORAGE SENTINEL');
  await page.getByLabel('Visual traits').fill('Live real-data isolation sentinel');
  await page.getByRole('button', { name: 'Save evidence card' }).click();
  const beforeReal = await databaseSnapshot(page, 'bird-id-evidence-card');

  await page.goto(`${baseURL}/`);
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  assert.match(page.url(), /\/\?demo=1$/);
  await page.getByText('Demo — sample data, nothing is saved').waitFor();
  await page.getByText(/Northern Fulmar/i).first().waitFor();
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.title(), 'Demo — Bird ID Evidence Card');
  await page.screenshot({ path: path.join(evidenceDir, 'demo-mobile.png'), fullPage: false });
  await page.getByLabel('Locality *').fill('Changed only inside live demo');
  await page.getByRole('button', { name: 'Save evidence card' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.getByLabel('Locality *').waitFor();
  await page.waitForFunction(() => document.querySelector('#locationName')?.value === 'Deerness coast, Orkney');
  await page.getByRole('link', { name: 'Start a blank card' }).click();
  await page.waitForURL(`${baseURL}/`);
  assert.doesNotMatch(await databaseSnapshot(page, 'demo:bird-id-evidence-card'), /demo-deerness-fulmar/);
  assert.equal(await databaseSnapshot(page, 'bird-id-evidence-card'), beforeReal);
  pass('One-click isolated demo', '?demo=1 banner/sample/reset/exit passed; demo cleared and real database stayed byte-for-byte unchanged');

  const primaryLabels = ['Edit evidence card', 'Try sample data', 'View saved cards', 'Read the evidence guide'];
  const footerLabels = ['Privacy', 'Terms', 'How it works'];
  for (const [route, title, heading, canonical] of expectedRoutes) {
    await page.goto(`${baseURL}${route}`);
    assert.equal(await page.title(), title);
    assert.equal(await page.locator('h1').count(), 1);
    assert.match(await page.locator('h1').innerText(), new RegExp(heading, 'i'));
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `${baseURL}${canonical}`);
    assert.equal(await page.locator('meta[property="og:image"]').count(), 1);
    assert.equal(await page.locator('meta[name="twitter:title"]').count(), 1);
    assert.deepEqual(await page.getByRole('navigation', { name: 'Primary' }).getByRole('link').allTextContents(), primaryLabels);
    assert.deepEqual(await page.getByRole('navigation', { name: 'Legal and project' }).getByRole('link').allTextContents(), footerLabels);
    await page.getByText(/Built by Param Factory · v1\.0\.3/).waitFor();
    const accessibility = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(accessibility.violations, [], `${route} must have zero axe violations`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, `${route} must not overflow horizontally`);
    const undersized = await page.locator('header a, footer a, button, .legal-action').evaluateAll((elements) => elements.filter((element) => {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return box.width > 0 && box.height > 0 && style.display !== 'none' && style.visibility !== 'hidden' && (box.width < 44 || box.height < 44);
    }).map((element) => element.textContent?.trim()));
    assert.deepEqual(undersized, [], `${route} must have 44px chrome targets`);
  }
  assert.deepEqual(runtimeErrors, [], '200 routes must load without console or page errors');
  await page.goto(`${baseURL}/cold-live-404-check`);
  assert.equal(await page.title(), 'Page not found — Bird ID Evidence Card');
  assert.equal(await page.locator('h1').count(), 1);
  await page.getByRole('link', { name: 'Record an uncertain sighting' }).waitFor();
  runtimeErrors.length = 0; // Chromium reports the intentionally requested 404 document as a console error.
  pass('Titles, metadata, shared chrome, accessibility, and mobile layout', 'all live routes have correct metadata, one h1, identical navigation/footer, zero axe violations, no overflow, and 44px targets');

  await page.goto(`${baseURL}/guide`);
  await page.getByRole('link', { name: 'View saved cards' }).click();
  await page.waitForFunction(() => document.activeElement?.tagName === 'H1');
  await page.goBack();
  await page.waitForFunction(() => document.activeElement?.tagName === 'H1');
  await page.goto(`${baseURL}/`);
  await page.keyboard.press('Tab');
  assert.equal(await page.getByRole('link', { name: 'Skip to evidence card' }).evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#main').evaluate((element) => element === document.activeElement), true);
  pass('Keyboard and route focus', 'skip link and link/back route focus land on the intended content');

  assert.deepEqual(runtimeErrors, []);
  assert.equal(requests.every((url) => new URL(url).origin === origin), true);
  assert.deepEqual(await page.evaluate(() => ({ cookies: document.cookie, localKeys: Object.keys(localStorage) })), { cookies: '', localKeys: [] });
  pass('Runtime and privacy', 'no console/page errors, cross-origin requests, cookies, or localStorage keys');
  await context.close();

  const offlineContext = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'allow' });
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto(`${baseURL}/demo`);
  await offlinePage.evaluate(async () => { await navigator.serviceWorker.ready; });
  await offlinePage.reload();
  await offlinePage.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await offlineContext.setOffline(true);
  await offlinePage.reload({ waitUntil: 'domcontentloaded' });
  await offlinePage.getByRole('heading', { level: 1, name: /current evidence card/i }).waitFor();
  await offlinePage.getByText(/Offline field mode/).waitFor();
  await offlinePage.goto(`${baseURL}/privacy/`, { waitUntil: 'domcontentloaded' });
  await offlinePage.getByRole('heading', { level: 1, name: /stay on this device/i }).waitFor();
  await offlineContext.setOffline(false);
  await offlineContext.close();
  pass('Live offline shell', 'demo and privacy routes reopened cold with network disabled');
} finally {
  await browser.close();
}

await writeFile(path.join(evidenceDir, 'live-audit.json'), `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
