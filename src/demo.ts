import type { EvidenceCard } from './model';

/** A realistic, deliberately unresolved North Sea observation; shipped, never fetched. */
export const sampleEvidenceCard = (): EvidenceCard => ({
  id: 'demo-deerness-fulmar',
  cardNumber: 'BID-20260828-001',
  createdAt: '2026-08-28T10:12:00.000Z',
  updatedAt: '2026-08-28T10:18:00.000Z',
  observedAt: '2026-08-28T10:12',
  locationName: 'Deerness coast, Orkney',
  locationPrecision: 'private',
  latitude: '', longitude: '',
  habitat: 'Sea cliff and rough water',
  conditions: 'Overcast, south-east wind',
  viewQuality: 'glimpse',
  visualTraits: 'Large pale seabird banking below the cliff. Grey upperwings and a stiff-winged glide. No black wing tips visible.',
  callNotes: 'Short harsh cackle from the cliff face. Caller was not seen.',
  noCallHeard: false,
  candidates: [
    { id: 'demo-fulmar', species: 'Northern Fulmar', source: 'Field app suggestion', confidence: 65, fitNotes: 'Fits the pale body and rigid glide. Contradiction: bill detail was not visible.' },
    { id: 'demo-gull', species: 'Northern Gannet', source: 'Personal hypothesis', confidence: 20, fitNotes: 'Could fit the flight line at distance. Contradiction: bird looked too compact.' }
  ],
  references: [{ id: 'demo-reference', title: 'Personal field notes: cliff seabirds', url: 'https://example.invalid/personal-notes', license: 'User-owned', comparisonNotes: 'Reminder to compare bill shape later; this link is stored as text only.' }],
  decision: 'unresolved',
  finalIdentity: '',
  reviewNotes: 'Check bill structure and flight profile against a field guide before logging. Keep this sighting unresolved for now.'
});
