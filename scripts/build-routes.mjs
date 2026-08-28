import { mkdir, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../dist/', import.meta.url);
const base = await readFile(new URL('index.html', root), 'utf8');
const site = 'https://bird-id-evidence-card.sociobot.in';

const routes = {
  demo: {
    title: 'Demo — Bird ID Evidence Card',
    description: 'Try a completed uncertain bird sighting with sample data that stays separate from your cards.'
  },
  records: {
    title: 'Saved cards — Bird ID Evidence Card',
    description: 'Open, export, import, or delete bird evidence cards stored in this browser.'
  },
  guide: {
    title: 'Evidence guide — Bird ID Evidence Card',
    description: 'Check an uncertain bird sighting by recording observations, alternatives, and reference notes.'
  }
};

for (const [path, meta] of Object.entries(routes)) {
  const canonical = `${site}/${path}`;
  const html = base
    .replaceAll('Bird ID Evidence Card — record uncertain sightings', meta.title)
    .replaceAll('Record what you saw and heard before you log an uncertain bird sighting.', meta.description)
    .replace(`<link rel="canonical" href="${site}/" />`, `<link rel="canonical" href="${canonical}" />`)
    .replaceAll('data-route-shell="home"', `data-route-shell="${path}"`);
  const directory = new URL(`${path}/`, root);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), html);
}
