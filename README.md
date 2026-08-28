# Bird ID Evidence Card

An offline-first evidence notebook for birders who have a tentative app result but want to compare it with what they actually saw and heard before logging. It creates a portable reasoning trail without performing identification itself.

Live: <https://bird-id-evidence-card.sociobot.in>

## What it does

- Records date, privacy-controlled locality, habitat, conditions, visual traits, and call notes.
- Keeps candidate species and their source separate from observed facts.
- Gives each candidate a user-owned confidence score plus fits/contradictions.
- Stores links to user-selected open or owned reference recordings without fetching or copying audio.
- Preserves an unresolved, likely, or independently verified review state.
- Autosaves drafts and saved cards in browser IndexedDB.
- Exports one card as Markdown or CSV, and the archive as an importable JSON backup.
- Installs as a PWA and continues to load, edit, and save offline.

Location detail defaults to **Private / locality only**. Coordinates are only included after selecting Precise and entering both values. Do not store or share sensitive nest locations.

## Intended users and limits

This is for birders reviewing uncertain sightings or sound suggestions. It is not species-ID AI, a call library, a citizen-science database, or a verifier. It has no integration or affiliation with BirdNET, Merlin, or eBird. Users must follow source licences and the submission rules of any service they later use.

## Run locally

Requires Node.js 22+ and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Browser data is local to that origin.

## Test and build

```sh
npm test
npm run build
```

`npm test` runs unit tests, creates the production build, then runs Playwright on mobile and desktop Chromium, including axe and offline service-worker checks. The exact deployment command is `npm run build`; it creates `dist/` with `dist/index.html` at its root.

Useful individual commands:

```sh
npm run test:unit
npm run test:e2e
npx tsc --noEmit
npm run preview
```

## Data and privacy

There are no accounts, analytics, ads, third-party scripts, remote fonts, or application APIs. Drafts and cards remain in IndexedDB until the user deletes them or clears site storage. JSON export is the migration/backup path. See [`/privacy`](https://bird-id-evidence-card.sociobot.in/privacy/) and [`/terms`](https://bird-id-evidence-card.sociobot.in/terms/).

## Project notes

- Product research contract: [`.factory/brief.json`](.factory/brief.json)
- Visual system and image provenance: [`.factory/design.md`](.factory/design.md)
- Build verification and known gaps: [`.factory/handoff.md`](.factory/handoff.md)
- Licence: [MIT](LICENSE)
