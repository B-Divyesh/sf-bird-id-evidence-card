import { describe, expect, it } from 'vitest';
import { createBlankCard, getReadiness, isComplete, normalizeCard } from '../../src/model';
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
});
