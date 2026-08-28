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
  });
});
