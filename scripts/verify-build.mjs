import { readFile, readdir, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const dist = new URL('../dist/', import.meta.url);
const read = (path) => readFile(new URL(path, dist), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const worker = await read('sw.js');
assert(!worker.includes('staticwebapp.config.json'), 'Host-only staticwebapp.config.json must not be in the service-worker precache.');
assert(worker.includes('manifest.json'), 'The linked PWA manifest must be in the service-worker precache.');

const routeHeadings = new Map([
  ['index.html', 'Record bird evidence before you'],
  ['demo/index.html', 'Your current evidence card'],
  ['records/index.html', 'Saved evidence cards'],
  ['guide/index.html', 'Check an uncertain bird in four steps'],
  ['privacy/index.html', 'Your evidence cards stay on this device'],
  ['terms/index.html', 'Use evidence cards as notes, not verdicts'],
  ['404.html', 'That evidence card page is not here']
]);

let sharedHeader;
let sharedFooter;
for (const [path, heading] of routeHeadings) {
  const html = await read(path);
  assert((html.match(/<h1\b/g) ?? []).length === 1, `${path} must contain exactly one h1.`);
  assert(new RegExp(`<h1[^>]*>[\\s\\S]*?${heading}`, 'i').test(html), `${path} has the wrong h1.`);
  assert(/<title>[^<]+<\/title>/.test(html), `${path} needs a title.`);
  assert(/<meta name="description"/.test(html), `${path} needs a description.`);
  assert(/<link rel="canonical"/.test(html), `${path} needs a canonical URL.`);
  assert(/<meta property="og:image"/.test(html) && /<meta name="twitter:image"/.test(html), `${path} needs social metadata.`);
  const header = html.match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0];
  const footer = html.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0];
  assert(header && footer, `${path} needs the shared product shell.`);
  sharedHeader ??= header;
  sharedFooter ??= footer;
  assert(header === sharedHeader, `${path} header drifted from the shared shell.`);
  assert(footer === sharedFooter, `${path} footer drifted from the shared shell.`);
  assert(html.includes('Built by Param Factory · v1.0.3'), `${path} has the wrong build identifier.`);
}

const config = JSON.parse(await read('staticwebapp.config.json'));
assert(config.globalHeaders?.['Content-Security-Policy'], 'A Content-Security-Policy header is required.');
assert(config.responseOverrides?.['404']?.statusCode === 404, 'Unknown routes must return the designed 404 with status 404.');

const manifest = JSON.parse(await read('manifest.webmanifest'));
assert(manifest.display === 'standalone', 'The PWA manifest must use standalone display.');
assert(String(manifest.start_url).includes('?'), 'The PWA start URL must be versioned.');
assert(manifest.icons?.some((icon) => icon.sizes === '192x192'), 'The PWA needs a 192px icon.');
assert(manifest.icons?.some((icon) => icon.sizes === '512x512'), 'The PWA needs a 512px icon.');
assert(manifest.icons?.some((icon) => icon.purpose?.includes('maskable')), 'The PWA needs a maskable icon.');

const assetNames = await readdir(new URL('assets/', dist));
const jsBytes = (await Promise.all(assetNames.filter((name) => name.endsWith('.js')).map(async (name) => gzipSync(await readFile(new URL(`assets/${name}`, dist))).byteLength))).reduce((sum, size) => sum + size, 0);
const cssBytes = (await Promise.all(assetNames.filter((name) => name.endsWith('.css')).map(async (name) => gzipSync(await readFile(new URL(`assets/${name}`, dist))).byteLength))).reduce((sum, size) => sum + size, 0);
const heroBytes = (await stat(new URL('assets/field-console-480.avif', dist))).size;
assert(jsBytes <= 150_000, `Initial JavaScript is ${jsBytes} bytes gzip; budget is 150000.`);
assert(cssBytes <= 50_000, `CSS is ${cssBytes} bytes gzip; budget is 50000.`);
assert(heroBytes <= 300_000, `Mobile hero is ${heroBytes} bytes; budget is 300000.`);

console.log(`Production shell: pass; JS ${jsBytes} B gzip; CSS ${cssBytes} B gzip; hero ${heroBytes} B.`);
