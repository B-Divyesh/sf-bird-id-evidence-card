# Bird ID Evidence Card

Record bird evidence before you log an uncertain sighting.

For birders checking an app suggestion against what they saw and heard. It records notes and does not identify birds.

Try the sample bird sighting at [bird-id-evidence-card.sociobot.in/demo](https://bird-id-evidence-card.sociobot.in/demo).

## Record and export evidence cards

- Keeps observed notes separate from candidate suggestions.
- Records locality, visual notes, call notes, candidates, and an unresolved decision.
- Export one card as CSV or Markdown, and saved cards as a JSON backup.
- Works offline after the first visit.
- Stays on this device.
- Stores reference links as text and does not fetch them.

Locality-only exports exclude coordinates. Review sensitive wildlife locations before sharing an export.

## Run locally

```sh
npm ci
npm run dev
```

Open the local address shown after the development server starts. Open `/demo` to use sample data that stays separate from your cards.

## Test and build

```sh
npm test
npm run build
```

Automated product checks and their commands are listed in [`.factory/claims.json`](.factory/claims.json).

## Privacy and limits

Use evidence cards as notes, not verdicts. See [Privacy](https://bird-id-evidence-card.sociobot.in/privacy/) and [Terms](https://bird-id-evidence-card.sociobot.in/terms/).

## Research, design, demo, and licence files

- Product research: [`.factory/brief.json`](.factory/brief.json)
- Visual system and provenance: [`.factory/design.md`](.factory/design.md)
- Demo details: [`.factory/demo.md`](.factory/demo.md)
- Licence: [MIT](LICENSE)
