import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

interface Claim {
  id: string;
  claim: string;
  where: string;
  test: string;
  sandbox: string;
}

describe('claim registry', () => {
  it('maps every claim to exactly one tagged test', async () => {
    const [registryText, browserTests, unitTests] = await Promise.all([
      readFile(new URL('../../.factory/claims.json', import.meta.url), 'utf8'),
      readFile(new URL('../e2e/app.spec.ts', import.meta.url), 'utf8'),
      readFile(new URL('./model.test.ts', import.meta.url), 'utf8')
    ]);
    const claims = JSON.parse(registryText) as Claim[];
    expect(new Set(claims.map((claim) => claim.id)).size).toBe(claims.length);
    for (const claim of claims) {
      expect(claim.claim.trim()).not.toBe('');
      expect(claim.where.trim()).not.toBe('');
      expect(claim.sandbox.trim()).not.toBe('');
      expect(claim.test).toContain(`@claim:${claim.id}`);
      const tag = `@claim:${claim.id}`;
      expect(`${browserTests}\n${unitTests}`.split(tag)).toHaveLength(2);
    }
    const limits = claims.find((claim) => claim.id === 'card-entry-limits');
    expect(limits?.claim).toContain('12 candidates');
    expect(limits?.claim).toContain('20 reference links');
  });

  it('audits dialog, toast, error, offline, and import or export state copy', async () => {
    const [html, app, model, offline, audit] = await Promise.all([
      readFile(new URL('../../index.html', import.meta.url), 'utf8'),
      readFile(new URL('../../src/main.ts', import.meta.url), 'utf8'),
      readFile(new URL('../../src/model.ts', import.meta.url), 'utf8'),
      readFile(new URL('../../public/offline.html', import.meta.url), 'utf8'),
      readFile(new URL('../../.factory/copy-audit.md', import.meta.url), 'utf8')
    ]);
    const publicSources = `${html}\n${app}\n${model}\n${offline}`;
    for (const retired of [
      'Ready locally', 'Saved locally', 'Filed locally', 'saved in your archive',
      'local archive', 'matching IDs', 'fresh field console', 'Confirm action',
      'Offline field mode', 'Field-console artwork generated for this product',
      'Visual account', 'Audio account'
    ]) expect(publicSources).not.toContain(retired);

    for (const current of [
      'No connection', 'Ready on this device', 'Saved on this device',
      'Save failed — export this card', 'Start a new evidence card?',
      'stays under Saved evidence cards', 'Delete this evidence card?',
      'exported backup', 'Could not read your saved evidence cards for backup',
      'Existing copies of those cards were replaced', 'An update is ready',
      'Load update', 'That page is not available offline',
      'Artwork generated for Bird ID Evidence Card', 'Visual notes', 'Call notes',
      'A card can hold up to 12 candidates', 'A card can hold up to 20 reference links'
    ]) {
      expect(publicSources).toContain(current);
      expect(audit.toLowerCase()).toContain(current.toLowerCase());
    }
  });

  it('documents the deployable static root and keeps the catalog line short and verb-first', async () => {
    const [readme, catalog] = await Promise.all([
      readFile(new URL('../../README.md', import.meta.url), 'utf8'),
      readFile(new URL('../../.factory/catalog-description.txt', import.meta.url), 'utf8')
    ]);
    expect(readme).toContain('## Deploy');
    expect(readme).toContain('publish `dist/` as the static site root');
    expect(readme).toContain('`staticwebapp.config.json`');
    const line = catalog.trim();
    expect(line.length).toBeLessThanOrEqual(120);
    expect(line).toMatch(/^Record\b/);
  });
});
