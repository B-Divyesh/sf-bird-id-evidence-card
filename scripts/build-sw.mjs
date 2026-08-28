import { readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('../dist/', import.meta.url);

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : path;
  }));
  return files.flat();
};

const rootPath = root.pathname;
const assets = (await walk(rootPath))
  .map((path) => `/${relative(rootPath, path).replaceAll('\\', '/')}`)
  .filter((path) => path !== '/sw.js' && !path.endsWith('.map'))
  .sort();

const version = `v1-${Date.now()}`;
const worker = `const CACHE_NAME = ${JSON.stringify(`bird-evidence-${version}`)};
const APP_SHELL = ${JSON.stringify(assets)};

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    await caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL));
    const openClients = await self.clients.matchAll({ includeUncontrolled: true });
    if (self.registration.active) {
      openClients.forEach((client) => client.postMessage({ type: 'UPDATE_AVAILABLE' }));
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('bird-evidence-') && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request).catch(() => new Response(JSON.stringify({ error: 'Offline' }), { status: 503, headers: { 'Content-Type': 'application/json' } })));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
      } catch {
        const cache = await caches.open(CACHE_NAME);
        if (url.pathname.startsWith('/privacy')) return (await cache.match('/privacy/index.html')) || (await cache.match('/offline.html'));
        if (url.pathname.startsWith('/terms')) return (await cache.match('/terms/index.html')) || (await cache.match('/offline.html'));
        return (await cache.match('/index.html')) || (await cache.match('/offline.html'));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) (await caches.open(CACHE_NAME)).put(request, response.clone());
      return response;
    } catch {
      return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    }
  })());
});
`;

await writeFile(new URL('../dist/sw.js', import.meta.url), worker);
console.log(`Generated service worker with ${assets.length} precached files.`);
