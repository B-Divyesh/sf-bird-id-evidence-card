import { readFile } from 'node:fs/promises';

const worker = await readFile(new URL('../dist/sw.js', import.meta.url), 'utf8');
if (worker.includes('staticwebapp.config.json')) {
  throw new Error('Host-only staticwebapp.config.json must not be in the service-worker precache.');
}
if (!worker.includes('manifest.json')) {
  throw new Error('The linked PWA manifest must be in the service-worker precache.');
}
console.log('Production service-worker app shell: pass');
