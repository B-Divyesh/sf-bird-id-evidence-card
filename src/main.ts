import './styles.css';
import {
  blankCandidate,
  blankReference,
  cardTitle,
  createBlankCard,
  getReadiness,
  isComplete,
  leadingCandidate,
  normalizeCard,
  type Candidate,
  type Decision,
  type EvidenceCard,
  type LocationPrecision,
  type ReferenceLink,
  type ViewQuality
} from './model';
import { csvHeader, suggestedFilename, summaryText, toCsv, toCsvRow, toMarkdown } from './exports';
import { clearAllStorage, clearDraft, deleteCard, getCards, importCards, loadDraft, saveCard, saveDraft, saveNewCard, useDemoStorage } from './storage';
import { sampleEvidenceCard } from './demo';

const byId = <T extends HTMLElement>(id: string): T => {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing required element: ${id}`);
  return element as T;
};

const form = byId<HTMLFormElement>('evidence-form');
const candidateList = byId('candidate-list');
const referenceList = byId('reference-list');
const saveStatus = byId('save-status');
const saveLamp = byId('save-lamp');
const formError = byId('form-error');
const coordinatesFields = byId('coordinates-fields');
const locationAdvice = byId('location-advice');
const toast = byId('toast');
const toastMessage = byId('toast-message');
const toastAction = byId<HTMLButtonElement>('toast-action');
const confirmDialog = byId<HTMLDialogElement>('confirm-dialog');
const dialogTitle = byId('dialog-title');
const dialogMessage = byId('dialog-message');

document.querySelector<HTMLAnchorElement>('.skip-link')?.addEventListener('click', (event) => {
  event.preventDefault();
  byId('main').focus();
  byId('main').scrollIntoView();
});

let current = createBlankCard();
let cards: EvidenceCard[] = [];
let autosaveTimer: number | undefined;
let toastTimer: number | undefined;
let storageHealthy = true;
const cancelAutosave = (): void => {
  if (autosaveTimer !== undefined) window.clearTimeout(autosaveTimer);
  autosaveTimer = undefined;
};
const isDemo = (): boolean => location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
type ViewName = 'workbench' | 'records' | 'guide';
const pathToView = (): ViewName => location.pathname === '/records' ? 'records' : location.pathname === '/guide' ? 'guide' : 'workbench';
const viewPath: Record<ViewName, string> = { workbench: '/', records: '/records', guide: '/guide' };
const routeTitle: Record<ViewName, string> = {
  workbench: 'Bird ID Evidence Card — record uncertain sightings',
  records: 'Saved cards — Bird ID Evidence Card',
  guide: 'Evidence guide — Bird ID Evidence Card'
};
const routeMetadata: Record<ViewName, { description: string; path: string }> = {
  workbench: { description: 'Record what you saw and heard before you log an uncertain bird sighting.', path: '/' },
  records: { description: 'Open, export, import, or delete bird evidence cards stored in this browser.', path: '/records' },
  guide: { description: 'Check an uncertain bird sighting by recording observations, alternatives, and reference notes.', path: '/guide' }
};
const setMetadata = (view: ViewName): void => {
  const demo = isDemo();
  const title = demo ? 'Demo — Bird ID Evidence Card' : routeTitle[view];
  const details = demo
    ? { description: 'Try a completed uncertain bird sighting with sample data that stays separate from your cards.', path: '/demo' }
    : routeMetadata[view];
  document.title = title;
  const canonical = `https://bird-id-evidence-card.sociobot.in${details.path}`;
  const write = (selector: string, value: string): void => {
    const element = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
    if (!element) return;
    if (element instanceof HTMLLinkElement) element.href = value;
    else element.content = value;
  };
  write('meta[name="description"]', details.description);
  write('link[rel="canonical"]', canonical);
  write('meta[property="og:title"]', title);
  write('meta[property="og:description"]', details.description);
  write('meta[name="twitter:title"]', title);
  write('meta[name="twitter:description"]', details.description);
};

const setHeadingLevel = (id: string, level: 1 | 2 | 3): HTMLElement => {
  const heading = byId(id);
  if (heading.tagName === `H${level}`) return heading;
  const replacement = document.createElement(`h${level}`);
  for (const attribute of Array.from(heading.attributes)) replacement.setAttribute(attribute.name, attribute.value);
  replacement.innerHTML = heading.innerHTML;
  heading.replaceWith(replacement);
  return replacement;
};

const setRouteHeading = (view: ViewName): HTMLElement => {
  const selectedId = view === 'workbench' && !isDemo() ? 'home-title' : `${view}-title`;
  for (const id of ['home-title', 'workbench-title', 'records-title', 'guide-title']) setHeadingLevel(id, 2);
  for (const id of ['context-title', 'look-title', 'listen-title', 'candidate-title', 'reference-title', 'decision-title', 'readout-title']) {
    setHeadingLevel(id, isDemo() ? 2 : 3);
  }
  return setHeadingLevel(selectedId, 1);
};

const escapeHtml = (value: string): string => value.replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character] ?? character));

const inputValue = (id: string): string => byId<HTMLInputElement | HTMLTextAreaElement>(id).value.trim();
const checkedValue = (name: string): string => (form.elements.namedItem(name) as RadioNodeList | null)?.value ?? '';

const confidenceWord = (value: number): string => value < 35 ? 'Low' : value < 70 ? 'Tentative' : 'Strong';

const readCardFromForm = (): EvidenceCard => {
  const candidates: Candidate[] = Array.from(candidateList.querySelectorAll<HTMLElement>('[data-candidate-id]')).map((item) => ({
    id: item.dataset.candidateId ?? crypto.randomUUID(),
    species: item.querySelector<HTMLInputElement>('[data-field="species"]')?.value.trim() ?? '',
    source: item.querySelector<HTMLSelectElement>('[data-field="source"]')?.value ?? '',
    confidence: Number(item.querySelector<HTMLInputElement>('[data-field="confidence"]')?.value ?? 0),
    fitNotes: item.querySelector<HTMLTextAreaElement>('[data-field="fitNotes"]')?.value.trim() ?? ''
  }));
  const references: ReferenceLink[] = Array.from(referenceList.querySelectorAll<HTMLElement>('[data-reference-id]')).map((item) => ({
    id: item.dataset.referenceId ?? crypto.randomUUID(),
    title: item.querySelector<HTMLInputElement>('[data-field="title"]')?.value.trim() ?? '',
    url: item.querySelector<HTMLInputElement>('[data-field="url"]')?.value.trim() ?? '',
    license: item.querySelector<HTMLSelectElement>('[data-field="license"]')?.value ?? '',
    comparisonNotes: item.querySelector<HTMLTextAreaElement>('[data-field="comparisonNotes"]')?.value.trim() ?? ''
  }));
  return {
    ...current,
    updatedAt: new Date().toISOString(),
    observedAt: inputValue('observedAt'),
    locationName: inputValue('locationName'),
    locationPrecision: checkedValue('locationPrecision') as LocationPrecision,
    latitude: inputValue('latitude'),
    longitude: inputValue('longitude'),
    habitat: inputValue('habitat'),
    conditions: inputValue('conditions'),
    viewQuality: checkedValue('viewQuality') as ViewQuality,
    visualTraits: inputValue('visualTraits'),
    callNotes: inputValue('callNotes'),
    noCallHeard: byId<HTMLInputElement>('noCallHeard').checked,
    candidates,
    references,
    decision: checkedValue('decision') as Decision,
    finalIdentity: inputValue('finalIdentity'),
    reviewNotes: inputValue('reviewNotes')
  };
};

const setValue = (id: string, value: string): void => { byId<HTMLInputElement | HTMLTextAreaElement>(id).value = value; };
const setRadio = (name: string, value: string): void => {
  form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`).forEach((input) => { input.checked = input.value === value; });
};

const sourceOptions = ['Field app suggestion', 'Audio app suggestion', 'Field guide', 'Another birder', 'Personal hypothesis'];
const licenseOptions = ['CC0 / public domain', 'CC BY', 'CC BY-SA', 'User-owned', 'Other open licence', 'Licence not confirmed'];

const renderCandidates = (): void => {
  candidateList.innerHTML = current.candidates.map((candidate, index) => `
    <div class="repeat-item" data-candidate-id="${escapeHtml(candidate.id)}">
      <div class="repeat-item-head"><strong>Candidate ${index + 1}</strong>${current.candidates.length > 1 ? `<button class="icon-button remove-candidate" type="button" aria-label="Remove candidate ${index + 1}">×</button>` : ''}</div>
      <div class="candidate-fields">
        <label>Species or working name<input data-field="species" type="text" maxlength="120" value="${escapeHtml(candidate.species)}" placeholder="e.g. Northern Fulmar" /></label>
        <label>Suggested by<select data-field="source">${sourceOptions.map((option) => `<option${candidate.source === option ? ' selected' : ''}>${option}</option>`).join('')}</select></label>
        <div class="wide range-row">
          <label>Your confidence<input data-field="confidence" type="range" min="0" max="100" step="5" value="${candidate.confidence}" aria-describedby="confidence-${escapeHtml(candidate.id)}" /></label>
          <output id="confidence-${escapeHtml(candidate.id)}" class="confidence-readout">${candidate.confidence}%<small>${confidenceWord(candidate.confidence)}</small></output>
        </div>
        <label class="wide">Fits and contradictions<textarea data-field="fitNotes" rows="3" maxlength="1200" placeholder="Fits: stiff-winged glide. Contradiction: call seemed sharper…">${escapeHtml(candidate.fitNotes)}</textarea></label>
      </div>
    </div>`).join('');
};

const renderReferences = (): void => {
  if (!current.references.length) {
    referenceList.classList.add('empty-repeat');
    referenceList.innerHTML = '<p class="repeat-empty">No references linked yet. This step is optional.</p>';
    return;
  }
  referenceList.classList.remove('empty-repeat');
  referenceList.innerHTML = current.references.map((reference, index) => `
    <div class="repeat-item" data-reference-id="${escapeHtml(reference.id)}">
      <div class="repeat-item-head"><strong>Reference ${index + 1}</strong><button class="icon-button remove-reference" type="button" aria-label="Remove reference ${index + 1}">×</button></div>
      <div class="candidate-fields">
        <label>Recording title<input data-field="title" type="text" maxlength="160" value="${escapeHtml(reference.title)}" placeholder="Species — call type" /></label>
        <label>Licence<select data-field="license">${licenseOptions.map((option) => `<option${reference.license === option ? ' selected' : ''}>${option}</option>`).join('')}</select></label>
        <label class="wide">Source URL<input data-field="url" type="url" maxlength="600" value="${escapeHtml(reference.url)}" placeholder="https://…" inputmode="url" /></label>
        <label class="wide">Comparison notes<textarea data-field="comparisonNotes" rows="3" maxlength="1000" placeholder="What matched or differed?">${escapeHtml(reference.comparisonNotes)}</textarea></label>
      </div>
    </div>`).join('');
};

const populateForm = (): void => {
  setValue('observedAt', current.observedAt);
  setValue('locationName', current.locationName);
  setRadio('locationPrecision', current.locationPrecision);
  setValue('latitude', current.latitude);
  setValue('longitude', current.longitude);
  setValue('habitat', current.habitat);
  setValue('conditions', current.conditions);
  setRadio('viewQuality', current.viewQuality);
  setValue('visualTraits', current.visualTraits);
  setValue('callNotes', current.callNotes);
  byId<HTMLInputElement>('noCallHeard').checked = current.noCallHeard;
  setRadio('decision', current.decision);
  setValue('finalIdentity', current.finalIdentity);
  setValue('reviewNotes', current.reviewNotes);
  renderCandidates();
  renderReferences();
  updateDependentControls();
  renderPreview();
};

const formatObserved = (value: string): string => {
  if (!value) return 'Add a date';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Check the date' : date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const renderPreview = (): void => {
  const readiness = getReadiness(current);
  const completeCount = readiness.filter((item) => item.complete).length;
  const candidate = leadingCandidate(current);
  byId('readiness-badge').textContent = `${isComplete(current) ? 'Complete' : 'Draft'} · ${completeCount}/5`;
  byId('preview-number').textContent = current.cardNumber || 'UNFILED';
  byId('readout-title').textContent = cardTitle(current);
  byId('preview-date').textContent = formatObserved(current.observedAt);
  byId('preview-location').textContent = current.locationName || 'Private locality';
  byId('preview-candidate').textContent = candidate?.species || 'None yet';
  byId('preview-confidence').textContent = candidate ? `${candidate.confidence}% · ${confidenceWord(candidate.confidence)}` : '—';
  byId<HTMLElement>('meter-fill').style.width = `${candidate?.confidence ?? 0}%`;
  const visual = current.viewQuality === 'not-seen' ? 'Not seen.' : current.visualTraits;
  const audio = current.noCallHeard ? 'No call heard.' : current.callNotes;
  byId('preview-evidence').textContent = [visual, audio].filter(Boolean).join(' ') || 'Your visual and audio notes will appear here.';
  byId('preview-status').textContent = current.decision.toUpperCase();
  byId('preview-privacy').textContent = current.locationPrecision === 'precise' ? '⌖ PRECISE' : current.locationPrecision === 'approximate' ? '◌ APPROX. 10 KM' : '⌾ LOCALITY ONLY';
  byId('readiness-list').innerHTML = readiness.map((item) => `<span class="readiness-item${item.complete ? ' is-complete' : ''}">${item.label}</span>`).join('');
  const railState: Record<string, boolean> = Object.fromEntries(readiness.map((item) => [item.key, item.complete]));
  railState.references = current.references.length > 0 && current.references.every((item) => Boolean(item.url));
  document.querySelectorAll<HTMLElement>('[data-progress]').forEach((item) => item.classList.toggle('is-complete', Boolean(railState[item.dataset.progress ?? ''])));
};

const updateDependentControls = (): void => {
  const precise = current.locationPrecision === 'precise';
  coordinatesFields.hidden = !precise;
  locationAdvice.classList.toggle('is-warning', precise);
  locationAdvice.innerHTML = precise
    ? '<strong>Precise coordinates will be exported.</strong> Do not expose nesting or sensitive-species locations.'
    : current.locationPrecision === 'approximate'
      ? '<strong>Approximate location selected.</strong> Exports state ~10 km precision and exclude coordinates.'
      : '<strong>Coordinates hidden.</strong> Coordinates are excluded. Avoid recording nest locations for sensitive species.';
  const callNotes = byId<HTMLTextAreaElement>('callNotes');
  callNotes.disabled = current.noCallHeard;
  callNotes.setAttribute('aria-disabled', String(current.noCallHeard));
};

const setSaveState = (message: string, state: 'saved' | 'saving' | 'error' = 'saved'): void => {
  saveStatus.textContent = message;
  saveLamp.classList.toggle('is-saving', state === 'saving');
  saveLamp.classList.toggle('is-error', state === 'error');
};

const autosave = (): void => {
  window.clearTimeout(autosaveTimer);
  setSaveState('Saving draft…', 'saving');
  autosaveTimer = window.setTimeout(async () => {
    try {
      await saveDraft(current);
      storageHealthy = true;
      setSaveState(`Saved on this device · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    } catch (error) {
      storageHealthy = false;
      setSaveState('Save failed — export this card', 'error');
      showError('This browser could not save your changes. Your current work remains on screen; export it before leaving.');
      console.error(error);
    }
  }, 350);
};

const syncCurrent = (): void => {
  current = readCardFromForm();
  updateDependentControls();
  renderPreview();
  autosave();
};

const showError = (message: string): void => {
  formError.textContent = message;
  formError.hidden = false;
};

const clearError = (): void => { formError.hidden = true; formError.textContent = ''; };

const showToast = (message: string, action = false): void => {
  window.clearTimeout(toastTimer);
  toastMessage.textContent = message;
  toastAction.hidden = !action;
  toast.hidden = false;
  if (!action) toastTimer = window.setTimeout(() => { toast.hidden = true; }, 4_500);
};

const download = (content: string, filename: string, type: string): void => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
};

const confirmAction = (title: string, message: string, actionLabel: string): Promise<boolean> => new Promise((resolve) => {
  dialogTitle.textContent = title;
  dialogMessage.textContent = message;
  const confirmButton = confirmDialog.querySelector<HTMLButtonElement>('[value="confirm"]');
  if (confirmButton) confirmButton.textContent = actionLabel;
  const onClose = (): void => {
    confirmDialog.removeEventListener('close', onClose);
    resolve(confirmDialog.returnValue === 'confirm');
  };
  confirmDialog.addEventListener('close', onClose);
  confirmDialog.showModal();
});

const isMeaningfulDraft = (card: EvidenceCard): boolean => Boolean(
  card.locationName || card.visualTraits || card.callNotes || card.reviewNotes || card.finalIdentity ||
  card.candidates.some((item) => item.species) || card.references.length || card.cardNumber
);

const switchView = (name: string, push = true, moveFocus = true): void => {
  const viewName = (['workbench', 'records', 'guide'].includes(name) ? name : 'workbench') as ViewName;
  document.querySelectorAll<HTMLElement>('.app-view').forEach((item) => { item.hidden = item.id !== `view-${viewName}`; });
  document.querySelectorAll<HTMLAnchorElement>('.nav-button').forEach((item) => {
    const active = isDemo()
      ? item.hasAttribute('data-demo-link')
      : !item.hasAttribute('data-demo-link') && new URL(item.href).pathname === viewPath[viewName];
    item.classList.toggle('is-active', active);
    if (active) item.setAttribute('aria-current', 'page'); else item.removeAttribute('aria-current');
  });
  if (viewName === 'records') void renderRecords();
  if (push && !isDemo()) history.pushState({ view: viewName }, '', viewPath[viewName as keyof typeof viewPath]);
  document.body.classList.remove('route-workbench', 'route-records', 'route-guide');
  document.body.classList.add(`route-${viewName}`);
  document.body.dataset.routeShell = isDemo() ? 'demo' : viewName === 'workbench' ? 'home' : viewName;
  setMetadata(viewName);
  const heading = setRouteHeading(viewName);
  if (moveFocus) {
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    window.setTimeout(() => heading?.focus(), 0);
  }
  byId('route-announcer').textContent = moveFocus ? (heading?.textContent?.trim() ?? 'Bird ID Evidence Card') : '';
};

const renderRecords = async (): Promise<void> => {
  try {
    cards = await getCards();
    storageHealthy = true;
  } catch (error) {
    storageHealthy = false;
    console.error(error);
  }
  byId('records-empty').hidden = cards.length > 0;
  const list = byId('records-list');
  list.hidden = cards.length === 0;
  list.innerHTML = cards.map((card) => {
    const ready = getReadiness(card);
    const complete = ready.every((item) => item.complete);
    return `<article class="record-item" data-record-id="${escapeHtml(card.id)}">
      <div class="record-item-top"><div><p class="eyebrow">${escapeHtml(card.cardNumber || 'Unfiled')}</p><h2>${escapeHtml(cardTitle(card))}</h2></div><span class="status-tag">${complete ? 'Complete' : `${ready.filter((item) => item.complete).length}/5 draft`}</span></div>
      <p class="record-meta">${escapeHtml(formatObserved(card.observedAt))} · ${escapeHtml(card.locationName || 'Locality not recorded')} · ${card.decision}</p>
      <p class="record-summary">${escapeHtml(summaryText(card))}</p>
      <div class="record-actions"><button type="button" data-action="edit">Open card</button><button type="button" data-action="markdown">Export Markdown</button><button type="button" data-action="csv">Export CSV</button><button class="delete-record" type="button" data-action="delete">Delete</button></div>
    </article>`;
  }).join('');
};

form.addEventListener('input', (event) => {
  const target = event.target as HTMLInputElement;
  if (target.type === 'range') {
    const output = target.closest('.range-row')?.querySelector('output');
    if (output) output.innerHTML = `${target.value}%<small>${confidenceWord(Number(target.value))}</small>`;
  }
  clearError();
  syncCurrent();
});
form.addEventListener('change', () => { clearError(); syncCurrent(); });

byId('add-candidate').addEventListener('click', () => {
  current = readCardFromForm();
  if (current.candidates.length >= 12) return showToast('A card can hold up to 12 candidates.');
  current.candidates.push(blankCandidate());
  renderCandidates(); renderPreview(); autosave();
  candidateList.querySelectorAll<HTMLInputElement>('[data-field="species"]')[current.candidates.length - 1]?.focus();
});

candidateList.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('.remove-candidate');
  if (!button) return;
  current = readCardFromForm();
  const item = button.closest<HTMLElement>('[data-candidate-id]');
  current.candidates = current.candidates.filter((candidate) => candidate.id !== item?.dataset.candidateId);
  if (!current.candidates.length) current.candidates.push(blankCandidate());
  renderCandidates(); renderPreview(); autosave();
});

byId('add-reference').addEventListener('click', () => {
  current = readCardFromForm();
  if (current.references.length >= 20) return showToast('A card can hold up to 20 reference links.');
  current.references.push(blankReference());
  renderReferences(); renderPreview(); autosave();
  referenceList.querySelectorAll<HTMLInputElement>('[data-field="title"]')[current.references.length - 1]?.focus();
});

referenceList.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('.remove-reference');
  if (!button) return;
  current = readCardFromForm();
  const item = button.closest<HTMLElement>('[data-reference-id]');
  current.references = current.references.filter((reference) => reference.id !== item?.dataset.referenceId);
  renderReferences(); renderPreview(); autosave();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearError();
  current = readCardFromForm();
  if (!form.reportValidity()) {
    showError('Add the required date and locality, and check any reference URLs before saving.');
    form.querySelector<HTMLElement>(':invalid')?.focus();
    return;
  }
  if (current.locationPrecision === 'precise' && (!current.latitude || !current.longitude)) {
    showError('Precise export is selected. Add both coordinates or choose a safer location detail.');
    byId('latitude').focus();
    return;
  }
  try {
    current.updatedAt = new Date().toISOString();
    if (current.cardNumber) await saveCard(current);
    else current = await saveNewCard(current);
    await saveDraft(current);
    cards = await getCards();
    renderPreview();
    setSaveState(`Saved on this device · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    showToast(isComplete(current) ? 'Complete evidence card saved on this device.' : 'Draft card saved. The readiness list shows what is still missing.');
    if (current.decision === 'verified' && current.references.length === 0) showToast('Saved as verified. Consider adding an independent reference or reasoning note.');
  } catch (error) {
    storageHealthy = false;
    console.error(error);
    showError('The card could not be saved in this browser. Export Markdown now to keep a copy.');
  }
});

byId('export-md').addEventListener('click', () => { current = readCardFromForm(); download(toMarkdown(current), suggestedFilename(current, 'md'), 'text/markdown;charset=utf-8'); });
byId('export-csv').addEventListener('click', () => { current = readCardFromForm(); download(toCsv(current), suggestedFilename(current, 'csv'), 'text/csv;charset=utf-8'); });

byId('new-card').addEventListener('click', async () => {
  current = readCardFromForm();
  const newCardMessage = current.cardNumber
    ? `“${cardTitle(current)}” stays under Saved evidence cards.`
    : `“${cardTitle(current)}” has not been saved and will be cleared.`;
  if (isMeaningfulDraft(current) && !await confirmAction('Start a new evidence card?', newCardMessage, 'Start new card')) return;
  current = createBlankCard();
  await clearDraft().catch((error) => console.error(error));
  populateForm();
  autosave();
  byId('observedAt').focus();
  showToast('New evidence card ready.');
});

document.addEventListener('click', (event) => {
  const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
  if (!link || link.target || link.origin !== location.origin || link.hasAttribute('data-demo-link')) return;
  const target = new URL(link.href);
  if (target.hash && target.pathname === location.pathname && target.search === location.search) return;
  const route = target.pathname;
  if (!['/', '/records', '/guide'].includes(route)) return;
  event.preventDefault();
  switchView(route === '/records' ? 'records' : route === '/guide' ? 'guide' : 'workbench');
});

byId('records-list').addEventListener('click', async (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-action]');
  const item = button?.closest<HTMLElement>('[data-record-id]');
  const card = cards.find((record) => record.id === item?.dataset.recordId);
  if (!button || !card) return;
  const action = button.dataset.action;
  if (action === 'edit') {
    current = structuredClone(card);
    await saveDraft(current).catch((error) => console.error(error));
    populateForm(); switchView('workbench'); byId('locationName').focus();
  } else if (action === 'markdown') download(toMarkdown(card), suggestedFilename(card, 'md'), 'text/markdown;charset=utf-8');
  else if (action === 'csv') download(toCsv(card), suggestedFilename(card, 'csv'), 'text/csv;charset=utf-8');
  else if (action === 'delete') {
    if (!await confirmAction('Delete this evidence card?', `${card.cardNumber || 'This card'}, “${cardTitle(card)}”, will be removed from this browser. Restore it only from an exported backup.`, 'Delete card')) return;
    try {
      await deleteCard(card.id);
      if (current.id === card.id) {
        current = createBlankCard();
        await clearDraft();
        populateForm();
      }
      await renderRecords();
      showToast('Evidence card deleted from this device.');
    } catch (error) {
      console.error(error); showToast('The card could not be deleted. Try again.');
    }
  }
});

byId('export-json').addEventListener('click', async () => {
  try {
    cards = await getCards();
    const backup = { product: 'bird-id-evidence-card', version: 1, exportedAt: new Date().toISOString(), cards };
    download(JSON.stringify(backup, null, 2), `bird-evidence-backup-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
    showToast(`${cards.length} card${cards.length === 1 ? '' : 's'} exported in the backup.`);
  } catch (error) { console.error(error); showToast('Could not read your saved evidence cards for backup.'); }
});

byId('import-json').addEventListener('click', () => byId<HTMLInputElement>('import-file').click());
byId<HTMLInputElement>('import-file').addEventListener('change', async (event) => {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  try {
    const parsed: unknown = JSON.parse(await file.text());
    const rawCards = Array.isArray(parsed) ? parsed : (parsed && typeof parsed === 'object' && Array.isArray((parsed as { cards?: unknown }).cards) ? (parsed as { cards: unknown[] }).cards : null);
    if (!rawCards) throw new Error('No cards array');
    const normalized = rawCards.map(normalizeCard).filter((card): card is EvidenceCard => card !== null);
    if (!normalized.length) throw new Error('No valid evidence cards');
    await importCards(normalized);
    await renderRecords();
    showToast(`Imported ${normalized.length} card${normalized.length === 1 ? '' : 's'}. Existing copies of those cards were replaced.`);
  } catch {
    showToast('That file is not a valid Bird ID Evidence Card backup. No data was changed.');
  }
});

const updateOnlineState = (): void => { byId('offline-banner').hidden = navigator.onLine; };
window.addEventListener('online', () => { updateOnlineState(); showToast('Back online. Your cards remained available.'); });
window.addEventListener('offline', updateOnlineState);

const registerServiceWorker = async (): Promise<void> => {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) return;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'UPDATE_AVAILABLE') showToast('An update is ready.', true);
    });
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) showToast('An update is ready.', true);
      });
    });
  } catch (error) { console.warn('Offline installation is unavailable:', error); }
};

toastAction.addEventListener('click', () => window.location.reload());

byId('reset-demo').addEventListener('click', async () => {
  if (!isDemo()) return;
  cancelAutosave();
  await clearAllStorage();
  current = sampleEvidenceCard();
  await saveCard(current);
  await saveDraft(current);
  cards = [current];
  populateForm();
  showToast('Sample evidence card reset.');
});

byId('start-real').addEventListener('click', async (event) => {
  if (!isDemo()) return;
  event.preventDefault();
  cancelAutosave();
  await clearAllStorage();
  location.assign('/');
});

window.addEventListener('popstate', () => switchView(pathToView(), false));

const initialize = async (): Promise<void> => {
  const demo = isDemo();
  useDemoStorage(demo);
  document.body.classList.toggle('demo-mode', demo);
  byId('demo-banner').hidden = !demo;
  updateOnlineState();
  try {
    const [draft, savedCards] = await Promise.all([loadDraft(), getCards()]);
    const normalizedDraft = normalizeCard(draft);
    if (normalizedDraft) current = normalizedDraft;
    else if (demo) {
      current = sampleEvidenceCard();
      await saveCard(current);
      await saveDraft(current);
      cards = [current];
    }
    cards = savedCards.map(normalizeCard).filter((card): card is EvidenceCard => card !== null);
    setSaveState(draft ? 'Draft restored from this device' : 'Ready on this device');
  } catch (error) {
    storageHealthy = false;
    console.error(error);
    setSaveState('Storage unavailable — export your work', 'error');
  }
  populateForm();
  switchView(pathToView(), false, false);
  void registerServiceWorker();
};

void initialize();

export { csvHeader, storageHealthy, toCsvRow };
