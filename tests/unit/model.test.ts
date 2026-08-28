import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { createBlankCard, getReadiness, isComplete, nextCardNumber, normalizeCard } from '../../src/model';
import { toCsv, toMarkdown } from '../../src/exports';

describe('evidence card model', () => {
  it('starts private and incomplete', () => {
    const card = createBlankCard();
    expect(card.locationPrecision).toBe('private');
    expect(isComplete(card)).toBe(false);
    expect(getReadiness(card).filter((item) => item.complete)).toHaveLength(0);
  });

  it('recognises a complete reasoning trail without claiming certainty', () => {
    const card = createBlankCard();
    card.locationName = 'Broad coastal locality';
    card.visualTraits = 'Stiff-winged glide and pale body.';
    card.noCallHeard = true;
    card.candidates[0]!.species = 'Northern Fulmar';
    card.reviewNotes = 'Compare bill shape in a licensed field guide.';
    expect(isComplete(card)).toBe(true);
    expect(card.decision).toBe('unresolved');
  });

  it('excludes coordinates from private CSV and Markdown exports', () => {
    const card = createBlankCard();
    card.locationName = 'Protected colony';
    card.latitude = '58.938';
    card.longitude = '-2.744';
    card.locationPrecision = 'private';
    expect(toCsv(card)).not.toContain('58.938');
    expect(toMarkdown(card)).not.toContain('-2.744');
    expect(toMarkdown(card)).toContain('coordinates excluded');
  });

  it('includes deliberately selected precise coordinates', () => {
    const card = createBlankCard();
    card.latitude = '58.938';
    card.longitude = '-2.744';
    card.locationPrecision = 'precise';
    expect(toCsv(card)).toContain('58.938');
    expect(toMarkdown(card)).toContain('58.938, -2.744');
  });

  it('rejects malformed imports and clamps candidate confidence', () => {
    expect(normalizeCard({ nonsense: true })).toBeNull();
    const card = createBlankCard();
    card.candidates[0]!.confidence = 300;
    const normalized = normalizeCard(card);
    expect(normalized?.candidates[0]?.confidence).toBe(100);
  });

  it('allocates beyond a retained daily high-water mark after deletion', () => {
    const first = createBlankCard();
    first.observedAt = '2026-08-28T09:00';
    first.cardNumber = 'BID-20260828-001';
    const second = { ...first, id: 'second', cardNumber: 'BID-20260828-002' };
    expect(nextCardNumber(first, [second], 2)).toBe('BID-20260828-003');
  });
});

it('@claim:generated-artwork records factory-image provenance for the shipped artwork', async () => {
  const [design, source] = await Promise.all([
    readFile(new URL('../../.factory/design.md', import.meta.url), 'utf8'),
    readFile(new URL('../../assets/src/field-console.json', import.meta.url), 'utf8')
  ]);
  expect(design).toContain('factory-image');
  expect(design).toContain('field-console');
  expect(source).toContain('factory-image');
});
