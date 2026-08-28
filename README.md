# Bird ID Evidence Card

Record bird evidence before you log an uncertain sighting.

For birders checking an app suggestion against what they saw and heard. It records an evidence card; it does not identify birds.

Try the shipped sample at [bird-id-evidence-card.sociobot.in/demo](https://bird-id-evidence-card.sociobot.in/demo).

## What it does

- Keeps observed notes separate from candidate suggestions.
- Helps you record a locality, visual account, call notes, candidates, and an unresolved decision.
- Exports demo evidence cards as CSV, Markdown, and JSON.
- Works offline after the first visit.
- Keeps cards on this device.

Locality-only exports exclude coordinates. Reference links are stored as text and are not fetched.

## Run locally

Requires Node.js 22+ and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Use `/demo` for the isolated sample.

## Test and build

```sh
npm test
npm run build
```

The build command creates `dist/` with `dist/index.html` at its root. Claim commands are listed in [`.factory/claims.json`](.factory/claims.json).

## Privacy and limits

Use evidence cards as notes, not verdicts. Review sensitive wildlife locations before sharing any export. See [Privacy](https://bird-id-evidence-card.sociobot.in/privacy/) and [Terms](https://bird-id-evidence-card.sociobot.in/terms/).

## Project notes

- Product research: [`.factory/brief.json`](.factory/brief.json)
- Visual system and provenance: [`.factory/design.md`](.factory/design.md)
- Demo details: [`.factory/demo.md`](.factory/demo.md)
- Licence: [MIT](LICENSE)
