export type LocationPrecision = 'private' | 'approximate' | 'precise';
export type ViewQuality = 'not-seen' | 'glimpse' | 'clear';
export type Decision = 'unresolved' | 'likely' | 'verified';

export interface Candidate {
  id: string;
  species: string;
  source: string;
  confidence: number;
  fitNotes: string;
}

export interface ReferenceLink {
  id: string;
  title: string;
  url: string;
  license: string;
  comparisonNotes: string;
}

export interface EvidenceCard {
  id: string;
  cardNumber: string;
  createdAt: string;
  updatedAt: string;
  observedAt: string;
  locationName: string;
  locationPrecision: LocationPrecision;
  latitude: string;
  longitude: string;
  habitat: string;
  conditions: string;
  viewQuality: ViewQuality;
  visualTraits: string;
  callNotes: string;
  noCallHeard: boolean;
  candidates: Candidate[];
  references: ReferenceLink[];
  decision: Decision;
  finalIdentity: string;
  reviewNotes: string;
}

export interface ReadinessItem {
  key: 'context' | 'look' | 'listen' | 'candidates' | 'decision';
  label: string;
  complete: boolean;
}

const localDateTime = (date = new Date()): string => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
};

export const makeId = (): string => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const blankCandidate = (): Candidate => ({
  id: makeId(),
  species: '',
  source: 'Field app suggestion',
  confidence: 50,
  fitNotes: ''
});

export const blankReference = (): ReferenceLink => ({
  id: makeId(),
  title: '',
  url: '',
  license: 'CC BY',
  comparisonNotes: ''
});

export const createBlankCard = (): EvidenceCard => {
  const now = new Date().toISOString();
  return {
    id: makeId(),
    cardNumber: '',
    createdAt: now,
    updatedAt: now,
    observedAt: localDateTime(),
    locationName: '',
    locationPrecision: 'private',
    latitude: '',
    longitude: '',
    habitat: '',
    conditions: '',
    viewQuality: 'glimpse',
    visualTraits: '',
    callNotes: '',
    noCallHeard: false,
    candidates: [blankCandidate()],
    references: [],
    decision: 'unresolved',
    finalIdentity: '',
    reviewNotes: ''
  };
};

export const getReadiness = (card: EvidenceCard): ReadinessItem[] => [
  { key: 'context', label: 'Date & locality', complete: Boolean(card.observedAt && card.locationName.trim()) },
  { key: 'look', label: 'Visual account', complete: card.viewQuality === 'not-seen' || Boolean(card.visualTraits.trim()) },
  { key: 'listen', label: 'Audio account', complete: card.noCallHeard || Boolean(card.callNotes.trim()) },
  { key: 'candidates', label: 'Candidate named', complete: card.candidates.some((item) => Boolean(item.species.trim())) },
  { key: 'decision', label: 'Reasoning noted', complete: Boolean(card.reviewNotes.trim()) }
];

export const isComplete = (card: EvidenceCard): boolean => getReadiness(card).every((item) => item.complete);

export const leadingCandidate = (card: EvidenceCard): Candidate | undefined =>
  card.candidates
    .filter((item) => item.species.trim())
    .toSorted((a, b) => b.confidence - a.confidence)[0];

export const cardTitle = (card: EvidenceCard): string =>
  card.finalIdentity.trim() || leadingCandidate(card)?.species.trim() || 'Unresolved bird';

export const cardNumberFor = (card: EvidenceCard, sequence: number): string => {
  const day = (card.observedAt || card.createdAt).slice(0, 10).replaceAll('-', '');
  return `BID-${day}-${String(sequence).padStart(3, '0')}`;
};

const text = (value: unknown, max = 2_000): string => typeof value === 'string' ? value.slice(0, max) : '';
const oneOf = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T => allowed.includes(value as T) ? value as T : fallback;

export const normalizeCard = (input: unknown): EvidenceCard | null => {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Partial<EvidenceCard>;
  if (!raw.id || typeof raw.id !== 'string' || !raw.createdAt || typeof raw.createdAt !== 'string') return null;
  const candidates = Array.isArray(raw.candidates) ? raw.candidates.slice(0, 12).map((item): Candidate | null => {
    if (!item || typeof item !== 'object') return null;
    const candidate = item as Partial<Candidate>;
    return {
      id: text(candidate.id, 100) || makeId(),
      species: text(candidate.species, 120),
      source: text(candidate.source, 120),
      confidence: Math.min(100, Math.max(0, Number(candidate.confidence) || 0)),
      fitNotes: text(candidate.fitNotes, 1_200)
    };
  }).filter((item): item is Candidate => item !== null) : [];
  const references = Array.isArray(raw.references) ? raw.references.slice(0, 20).map((item): ReferenceLink | null => {
    if (!item || typeof item !== 'object') return null;
    const reference = item as Partial<ReferenceLink>;
    return {
      id: text(reference.id, 100) || makeId(),
      title: text(reference.title, 160),
      url: text(reference.url, 600),
      license: text(reference.license, 80),
      comparisonNotes: text(reference.comparisonNotes, 1_000)
    };
  }).filter((item): item is ReferenceLink => item !== null) : [];
  return {
    id: raw.id,
    cardNumber: text(raw.cardNumber, 40),
    createdAt: raw.createdAt,
    updatedAt: text(raw.updatedAt, 40) || raw.createdAt,
    observedAt: text(raw.observedAt, 40),
    locationName: text(raw.locationName, 100),
    locationPrecision: oneOf(raw.locationPrecision, ['private', 'approximate', 'precise'] as const, 'private'),
    latitude: text(raw.latitude, 30),
    longitude: text(raw.longitude, 30),
    habitat: text(raw.habitat, 120),
    conditions: text(raw.conditions, 120),
    viewQuality: oneOf(raw.viewQuality, ['not-seen', 'glimpse', 'clear'] as const, 'glimpse'),
    visualTraits: text(raw.visualTraits, 1_200),
    callNotes: text(raw.callNotes, 1_000),
    noCallHeard: Boolean(raw.noCallHeard),
    candidates: candidates.length ? candidates : [blankCandidate()],
    references,
    decision: oneOf(raw.decision, ['unresolved', 'likely', 'verified'] as const, 'unresolved'),
    finalIdentity: text(raw.finalIdentity, 120),
    reviewNotes: text(raw.reviewNotes, 1_200)
  };
};
