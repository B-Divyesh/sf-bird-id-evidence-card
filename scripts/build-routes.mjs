import { mkdir, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../dist/', import.meta.url);
const base = await readFile(new URL('index.html', root), 'utf8');
const site = 'https://bird-id-evidence-card.sociobot.in';

const routes = {
  demo: {
    title: 'Demo — Bird ID Evidence Card',
    description: 'Try a completed uncertain bird sighting with sample data that stays separate from your cards.',
    heading: 'workbench-title',
    view: 'workbench'
  },
  records: {
    title: 'Saved cards — Bird ID Evidence Card',
    description: 'Open, export, import, or delete bird evidence cards stored in this browser.',
    heading: 'records-title',
    view: 'records'
  },
  guide: {
    title: 'Evidence guide — Bird ID Evidence Card',
    description: 'Check an uncertain bird sighting by recording observations, alternatives, and reference notes.',
    heading: 'guide-title',
    view: 'guide'
  }
};

const setHeadingLevel = (html, id, level) => html.replace(
  new RegExp(`<h[12]([^>]*\\bid="${id}"[^>]*)>([\\s\\S]*?)<\\/h[12]>`),
  `<h${level}$1>$2</h${level}>`
);

const setViewHidden = (html, id, hidden) => html.replace(
  new RegExp(`<section id="${id}"([^>]*)>`),
  (_match, attributes) => `<section id="${id}"${attributes.replace(/\s+hidden(?=\s|$)/g, '')}${hidden ? ' hidden' : ''}>`
);

const buildRouteDocument = (html, path, meta) => {
  let output = html
    .replaceAll('Bird ID Evidence Card — record uncertain sightings', meta.title)
    .replaceAll('Record what you saw and heard before you log an uncertain bird sighting.', meta.description)
    .replace(`<link rel="canonical" href="${site}/" />`, `<link rel="canonical" href="${site}/${path}" />`)
    .replaceAll('data-route-shell="home"', `data-route-shell="${path}"`);

  for (const heading of ['home-title', 'workbench-title', 'records-title', 'guide-title']) {
    output = setHeadingLevel(output, heading, heading === meta.heading ? 1 : 2);
  }
  if (path === 'demo') {
    for (const heading of ['context-title', 'look-title', 'listen-title', 'candidate-title', 'reference-title', 'decision-title', 'readout-title']) {
      output = setHeadingLevel(output, heading, 2);
    }
  }
  for (const view of ['workbench', 'records', 'guide']) output = setViewHidden(output, `view-${view}`, view !== meta.view);
  return output;
};

for (const [path, meta] of Object.entries(routes)) {
  const html = buildRouteDocument(base, path, meta);
  const directory = new URL(`${path}/`, root);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), html);
}

const sharedHeader = base.match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0];
const sharedFooter = base.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0];
if (!sharedHeader || !sharedFooter) throw new Error('Could not find the shared product shell.');

for (const file of ['privacy/index.html', 'terms/index.html', '404.html', 'offline.html']) {
  const url = new URL(file, root);
  const source = await readFile(url, 'utf8');
  const html = source
    .replace(/<header[^>]*>[\s\S]*?<\/header>/, sharedHeader)
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/, sharedFooter)
    .replace('<main id="main">', '<main id="main" tabindex="-1">')
    .replace('</body>', '<script src="/legal.js"></script></body>');
  await writeFile(url, html);
}
