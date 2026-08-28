import { cardDay, cardSequence, nextCardNumber, type EvidenceCard } from './model';

const DB_NAME = 'bird-id-evidence-card';
const DB_VERSION = 2;
const CARD_STORE = 'cards';
const META_STORE = 'meta';

const request = <T>(value: IDBRequest<T>): Promise<T> => new Promise((resolve, reject) => {
  value.onsuccess = () => resolve(value.result);
  value.onerror = () => reject(value.error ?? new Error('Browser storage request failed'));
});

const transactionDone = (transaction: IDBTransaction): Promise<void> => new Promise((resolve, reject) => {
  transaction.oncomplete = () => resolve();
  transaction.onerror = () => reject(transaction.error ?? new Error('Browser storage transaction failed'));
  transaction.onabort = () => reject(transaction.error ?? new Error('Browser storage transaction was cancelled'));
});

let connection: Promise<IDBDatabase> | undefined;

const db = (): Promise<IDBDatabase> => {
  if (!('indexedDB' in globalThis)) return Promise.reject(new Error('IndexedDB is not available'));
  connection ??= new Promise((resolve, reject) => {
    const opening = indexedDB.open(DB_NAME, DB_VERSION);
    opening.onupgradeneeded = () => {
      const database = opening.result;
      if (!database.objectStoreNames.contains(CARD_STORE)) database.createObjectStore(CARD_STORE, { keyPath: 'id' });
      if (!database.objectStoreNames.contains(META_STORE)) database.createObjectStore(META_STORE);
    };
    opening.onsuccess = () => resolve(opening.result);
    opening.onerror = () => reject(opening.error ?? new Error('Could not open local evidence storage'));
  });
  return connection;
};

export const saveDraft = async (card: EvidenceCard): Promise<void> => {
  const database = await db();
  const transaction = database.transaction(META_STORE, 'readwrite');
  transaction.objectStore(META_STORE).put(card, 'draft');
  await transactionDone(transaction);
};

export const loadDraft = async (): Promise<EvidenceCard | undefined> => {
  const database = await db();
  return request(database.transaction(META_STORE).objectStore(META_STORE).get('draft'));
};

export const clearDraft = async (): Promise<void> => {
  const database = await db();
  const transaction = database.transaction(META_STORE, 'readwrite');
  transaction.objectStore(META_STORE).delete('draft');
  await transactionDone(transaction);
};

export const saveCard = async (card: EvidenceCard): Promise<void> => {
  const database = await db();
  const transaction = database.transaction(CARD_STORE, 'readwrite');
  transaction.objectStore(CARD_STORE).put(card);
  await transactionDone(transaction);
};

const sequenceKey = (card: Pick<EvidenceCard, 'observedAt' | 'createdAt'>): string => `card-sequence:${cardDay(card)}`;

/**
 * Gives a new card its number inside the same IndexedDB transaction that writes
 * it. A per-day high-water mark is deliberately retained after deletion.
 */
export const saveNewCard = async (card: EvidenceCard): Promise<EvidenceCard> => {
  const database = await db();
  const transaction = database.transaction([CARD_STORE, META_STORE], 'readwrite');
  const cardStore = transaction.objectStore(CARD_STORE);
  const metaStore = transaction.objectStore(META_STORE);
  const sequenceRequest = metaStore.get(sequenceKey(card));
  const cardsRequest = cardStore.getAll();
  const [allocatedThrough, storedCards] = await Promise.all([
    request<number | undefined>(sequenceRequest),
    request<EvidenceCard[]>(cardsRequest)
  ]);
  const numbered = { ...card, cardNumber: nextCardNumber(card, storedCards, Number(allocatedThrough) || 0) };
  metaStore.put(cardSequence(numbered), sequenceKey(numbered));
  cardStore.put(numbered);
  await transactionDone(transaction);
  return numbered;
};

export const getCards = async (): Promise<EvidenceCard[]> => {
  const database = await db();
  const result = await request<EvidenceCard[]>(database.transaction(CARD_STORE).objectStore(CARD_STORE).getAll());
  return result.toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt));
};

export const deleteCard = async (id: string): Promise<void> => {
  const database = await db();
  const transaction = database.transaction(CARD_STORE, 'readwrite');
  transaction.objectStore(CARD_STORE).delete(id);
  await transactionDone(transaction);
};

export const importCards = async (cards: EvidenceCard[]): Promise<void> => {
  const database = await db();
  const transaction = database.transaction([CARD_STORE, META_STORE], 'readwrite');
  const store = transaction.objectStore(CARD_STORE);
  const metaStore = transaction.objectStore(META_STORE);
  for (const card of cards) store.put(card);
  const importedHighWaterMarks = new Map<string, number>();
  for (const card of cards) {
    const key = sequenceKey(card);
    importedHighWaterMarks.set(key, Math.max(importedHighWaterMarks.get(key) ?? 0, cardSequence(card)));
  }
  const existing = await Promise.all([...importedHighWaterMarks.keys()].map(async (key) => [key, await request<number | undefined>(metaStore.get(key))] as const));
  for (const [key, importedSequence] of importedHighWaterMarks) {
    const previousSequence = Number(existing.find(([existingKey]) => existingKey === key)?.[1]) || 0;
    if (importedSequence > previousSequence) metaStore.put(importedSequence, key);
  }
  await transactionDone(transaction);
};
