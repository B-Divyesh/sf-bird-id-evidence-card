import { cardTitle, getReadiness, leadingCandidate, type EvidenceCard } from './model';

const safeLine = (value: string): string => value.replace(/[\r\n]+/g, ' ').trim();
const displayDate = (value: string): string => value ? new Date(value).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : 'Not recorded';
const hasValidCoordinates = (card: EvidenceCard): boolean => {
  if (card.locationPrecision !== 'precise' || card.latitude.trim() === '' || card.longitude.trim() === '') return false;
  const latitude = Number(card.latitude);
  const longitude = Number(card.longitude);
  return Number.isFinite(latitude) && Number.isFinite(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
};
const privacyDescription = (card: EvidenceCard): string => card.locationPrecision === 'precise'
  ? `Precise${hasValidCoordinates(card) ? ` (${card.latitude}, ${card.longitude})` : ' (coordinates not included)'}`
  : card.locationPrecision === 'approximate' ? 'Approximate (~10 km)' : 'Private (locality only; coordinates excluded)';

export const toMarkdown = (card: EvidenceCard): string => {
  const candidateLines = card.candidates.filter((item) => item.species.trim()).map((item) =>
    `- **${safeLine(item.species)}** — ${item.confidence}% confidence; source: ${safeLine(item.source) || 'not recorded'}${item.fitNotes ? `\n  - Fit / contradiction: ${safeLine(item.fitNotes)}` : ''}`
  );
  const referenceLines = card.references.filter((item) => item.url.trim()).map((item) =>
    `- [${safeLine(item.title) || 'Reference recording'}](${item.url}) — ${safeLine(item.license) || 'licence not recorded'}${item.comparisonNotes ? `; ${safeLine(item.comparisonNotes)}` : ''}`
  );
  const readiness = getReadiness(card);
  return `# Bird ID evidence card: ${safeLine(cardTitle(card))}

> This is a user-authored evidence record, not an automated identification or verification.

| Field | Record |
| --- | --- |
| Card | ${card.cardNumber || 'Unfiled draft'} |
| Observed | ${displayDate(card.observedAt)} |
| Locality | ${safeLine(card.locationName) || 'Not recorded'} |
| Location detail | ${privacyDescription(card)} |
| Habitat | ${safeLine(card.habitat) || 'Not recorded'} |
| Conditions | ${safeLine(card.conditions) || 'Not recorded'} |
| Review status | ${card.decision} |

## Observed evidence

### Visual (${card.viewQuality.replace('-', ' ')})

${card.visualTraits.trim() || '_No visual traits recorded._'}

### Audio

${card.noCallHeard ? '_No call heard._' : card.callNotes.trim() || '_No audio account recorded._'}

## Candidate suggestions

${candidateLines.join('\n') || '_No candidates recorded._'}

## User-selected reference links

${referenceLines.join('\n') || '_No references linked._'}

## Decision trail

- Current identification: ${safeLine(card.finalIdentity) || 'Unresolved'}
- Reasoning / next check: ${card.reviewNotes.trim() || 'Not recorded'}
- Evidence completeness: ${readiness.filter((item) => item.complete).length}/${readiness.length}

---
Created with Bird ID Evidence Card. Exported on ${new Date().toISOString()}.
`;
};

const csvCell = (value: unknown): string => `"${String(value ?? '').replaceAll('"', '""').replace(/[\r\n]+/g, ' ')}"`;

export const csvHeader = [
  'card_number', 'observed_at', 'locality', 'location_precision', 'latitude', 'longitude', 'habitat', 'conditions',
  'view_quality', 'visual_traits', 'call_notes', 'no_call_heard', 'candidate_species', 'candidate_sources',
  'candidate_confidence', 'reference_links', 'decision', 'current_identification', 'review_notes', 'complete', 'updated_at'
];

export const toCsvRow = (card: EvidenceCard): string => {
  const candidates = card.candidates.filter((item) => item.species.trim());
  const precise = hasValidCoordinates(card);
  const values: unknown[] = [
    card.cardNumber, card.observedAt, card.locationName, card.locationPrecision, precise ? card.latitude : '', precise ? card.longitude : '',
    card.habitat, card.conditions, card.viewQuality, card.visualTraits, card.callNotes, card.noCallHeard,
    candidates.map((item) => item.species).join(' | '), candidates.map((item) => item.source).join(' | '),
    candidates.map((item) => item.confidence).join(' | '), card.references.map((item) => item.url).filter(Boolean).join(' | '),
    card.decision, card.finalIdentity, card.reviewNotes, getReadiness(card).every((item) => item.complete), card.updatedAt
  ];
  return values.map(csvCell).join(',');
};

export const toCsv = (card: EvidenceCard): string => `${csvHeader.map(csvCell).join(',')}\n${toCsvRow(card)}\n`;

export const suggestedFilename = (card: EvidenceCard, extension: string): string => {
  const title = safeLine(cardTitle(card)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 45) || 'unresolved-bird';
  return `${card.cardNumber || 'draft'}-${title}.${extension}`.toLowerCase();
};

export const summaryText = (card: EvidenceCard): string => {
  const candidate = leadingCandidate(card);
  const evidence = card.visualTraits.trim() || (card.noCallHeard ? 'No call heard.' : card.callNotes.trim());
  return `${candidate ? `${candidate.species} at ${candidate.confidence}%. ` : ''}${evidence || 'Evidence notes not complete yet.'}`;
};
