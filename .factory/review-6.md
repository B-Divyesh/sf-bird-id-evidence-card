# Adversarial first-read review 6 — Bird ID Evidence Card

**Verdict: PASS**

Reviewed 2026-08-28 against live <https://bird-id-evidence-card.sociobot.in> and clean clone commit `11218c9c8082baeac712d7f0061f08327e239884`. This was a non-mutating review. No blocking, major, or minor findings remain.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1280 × 900 showed the same first screen before scrolling. In my words: this records a birder's observations so they can check an app suggestion before logging a bird; it is for birders with an uncertain sighting; click **Try it with sample data** first. The action's adjacent outcome, `See a completed uncertain-sighting card.`, removes ambiguity.

The exact supporting text is `Record bird evidence before you log.`, `For birders checking an app suggestion against what they saw and heard.`, and the three facts `Works offline after first visit`, `Stays on this device`, and `Free`. All were visible at 390 px without scrolling. The phone layout is a field-instrument design, rather than a generic SaaS hero: ruled paper, dial-like wordmark, ink/pine/vermilion palette, serif notes, and original field-desk art match `.factory/design.md`.

## Copy audit

Word counts treat hyphenated forms as one word. The complete current landing, reachable app-state, legal, and README audit is recorded in `.factory/copy-audit.md`; this table reproduces every sentence on the landing route and README. No sentence exceeds 22 words, no banned marketing adjective appears, no visitor-facing jargon is unexplained, terminology remains `evidence card`, and all headings/actions pass their respective checks.

### Landing route sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Record bird evidence before you log. | 6 | Pass |
| For birders checking an app suggestion against what they saw and heard. | 12 | Pass |
| See a completed uncertain-sighting card. | 5 | Pass |
| Works offline after first visit | 5 | Listed claim |
| Stays on this device | 4 | Listed claim |
| Free | 1 | Listed claim |
| Name the broad place, not a nest site. | 8 | Pass |
| Coordinates hidden. | 2 | Pass |
| Coordinates are excluded. | 3 | Listed claim |
| Avoid recording nest locations for sensitive species. | 7 | Pass |
| Write only what you noticed: size, shape, flight, bill, plumage, behaviour… | 11 | Pass |
| Specific negatives help too: “no black wing tips visible.” | 9 | Pass |
| Rhythm, pitch, repetition, distance, direction—and whether the caller was visible. | 11 | Pass |
| This is still useful observed evidence. | 6 | Pass |
| Record who suggested it and why it does or does not fit. | 12 | Pass |
| Set your confidence. | 3 | Pass |
| Link to material you have permission to use. | 8 | Pass |
| The app stores the link as text and does not fetch it. | 12 | Listed claim |
| No references linked yet. | 4 | Pass |
| This step is optional. | 4 | Pass |
| What matched or differed? | 4 | Pass |
| What supports or contradicts the leading candidate? | 7 | Pass |
| What would resolve it? | 4 | Pass |
| Your visual and audio notes will appear here. | 8 | Pass |
| A complete card does not confirm the species. | 8 | Listed claim |
| It records what you observed and what still needs checking. | 10 | Listed claim |
| CSV opens in a spreadsheet. | 5 | Explains format |
| Markdown is a shareable text card. | 6 | Explains format |
| A backup saves all cards for moving to another browser. | 10 | Listed claim |
| Save your current draft when you want to find it here. | 11 | Pass |
| Record shape, movement, habitat, and sound before checking the suggestion. | 10 | Pass |
| Add alternatives, then note what fits and what contradicts each one. | 11 | Pass |
| Keep the status unresolved until your own evidence supports a change. | 10 | Pass |
| It records your notes. | 4 | Listed claim |
| It does not identify birds or download recordings. | 8 | Listed claims |
| Record shape, movement, habitat, and sound before opening another guide. | 10 | Pass |
| Add at least two candidates when possible. | 7 | Pass |
| Note one fit and one contradiction for each. | 8 | Pass |
| Link to openly licensed recordings or material you own. | 9 | Pass |
| Confirm the caller was likely the bird you saw. | 9 | Pass |
| “Unresolved” is a useful result. | 5 | Pass |
| Only use “verified” when independent evidence supports the identification. | 9 | Pass |
| It records notes and does not identify birds or download recordings. | 11 | Listed claims |
| Cards are stored in this browser. | 6 | Listed claim |
| Export a backup before clearing browser storage or changing phones. | 10 | Pass |
| A private evidence card for uncertain bird sightings. | 8 | Pass |
| Artwork generated for Bird ID Evidence Card. | 7 | Listed claim |

Demo/state sentences also pass: `Demo — sample data, nothing is saved.` (7), `No connection — your work still saves on this device.` (9), `A card can hold up to 12 candidates.` (8), and `A card can hold up to 20 reference links.` (9) are registered. Error, dialog, and update messages state a recovery action. Standalone headings include `Your current evidence card`, `How it works`, `What this tool does not do`, and `Your data, on your device`. Result-naming actions include `Try it with sample data`, `Save evidence card`, `Export Markdown`, `Export CSV`, `Export backup`, `Import backup`, `Reset demo`, and `Start a blank card`.

### README sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Record bird evidence before you log an uncertain sighting. | 9 | Listed claim |
| For birders checking an app suggestion against what they saw and heard. | 12 | Pass |
| It records notes and does not identify birds. | 8 | Listed claim |
| Try the sample bird sighting at bird-id-evidence-card.sociobot.in/demo. | 7 | Pass |
| Keeps observed notes separate from candidate suggestions. | 7 | Listed claim |
| Records locality, visual notes, call notes, candidates, and an unresolved decision. | 11 | Listed claim |
| Export one card as CSV or Markdown, and saved cards as a JSON backup. | 14 | Listed claim |
| CSV opens in a spreadsheet. | 5 | Explains format |
| Markdown is shareable text. | 4 | Explains format |
| A backup moves all cards to another browser. | 8 | Listed claim |
| Works offline after the first visit. | 6 | Listed claim |
| Stays on this device. | 5 | Listed claim |
| Stores reference links as text and does not fetch them. | 10 | Listed claim |
| New cards start with locality-only exports. | 6 | Listed claim |
| Coordinates export only after you choose Precise and enter two valid values. | 12 | Listed claim |
| Review sensitive wildlife locations before sharing an export. | 8 | Pass |
| Open the local address shown after the development server starts. | 9 | Developer instruction |
| Open `/demo` to use sample data that stays separate from your cards. | 12 | Listed claim |
| Automated product checks and their commands are listed in `.factory/claims.json`. | 10 | Developer documentation |
| Run `npm run build`, then publish `dist/` as the static site root. | 12 | Deployment instruction |
| The build includes route documents, the service worker, `staticwebapp.config.json`, and the designed 404 page. | 14 | Verified build fact |
| Factory infrastructure deploys that output. | 5 | Deployment instruction |
| This repository does not change DNS, hosting, or billing. | 9 | Deployment boundary |
| Use evidence cards as notes, not verdicts. | 7 | Pass |

No button needs a rewrite and no copy flag became a finding.

## Demo and sandbox verification

The hero path and direct `/demo` both loaded a completed Deerness coast, Orkney observation: date/time, visual notes, call notes, two candidate alternatives, a reference, an unresolved status, and `COMPLETE · 5/5`. It is realistic product use, not placeholder content. The persistent banner read exactly `Demo — sample data, nothing is saved.` and exposed `Reset demo` and `Start a blank card`.

The sandbox uses the documented `demo:bird-id-evidence-card` IndexedDB database rather than `bird-id-evidence-card`. The registered isolation check seeded real data, edited/saved/reset/exited demo, then byte-compared the real database; it passed. The offline test set the browser context offline after first load, reloaded `/demo`, edited it, and saved it; it passed. A live request capture during the demo contained no non-origin request. Reset restored the shipped sample.

## Claims from a clean clone

Created `/tmp/bird-review6-clean` from this checkout, ran `npm ci`, then ran every exact command in `.factory/claims.json` independently. All 16 passed: `record-evidence-card`, `separate-observation-and-suggestion`, `no-automatic-identification`, `offline-demo`, `device-only`, `free`, `no-account`, `demo-isolation`, `exports`, `private-coordinates`, `no-audio-fetch`, `delete-card`, `stored-card-schema`, `no-tracking-or-remote-assets`, `card-entry-limits`, and `generated-artwork`.

Re-read the live landing, demo, guide, privacy, terms, state messages, and README after the test run. Every visitor-reliant sentence maps to the registry; no unlisted claim was found. In particular, the 12-candidate and 20-reference limits are registered and observable, closing F-5-1 rather than merely omitting the language.

## Structure, accessibility, and history

- Live `/`, `/demo`, `/records`, `/guide`, `/privacy/`, `/terms/`, `/offline.html`, and `/404.html` each rendered a single h1, a route-specific title, description, canonical, OG/Twitter image metadata, and SVG favicon. Application and legal/fallback routes share the wordmark, navigation, Privacy/Terms footer links, Param Factory credit, and `v1.0.5` build identifier.
- An unknown live path returned HTTP 404 with `That evidence card page is not here.` and a recovery route. The internal-link crawl checked nine distinct same-origin targets; every linked target returned 200. `scripts/verify-url.sh https://bird-id-evidence-card.sociobot.in` passed.
- Direct links opened the selected route. From `/`, navigation to `View saved cards` moved focus to `h1#records-title` and announced `Saved evidence cards`; browser Back, after the route-focus timer, restored `/` and focus to `h1#home-title`. The skip link focuses `main`.
- The clean full suite passed: 11 unit tests, production build, production-shell verification, and all browser shards. The build reported 10,654 B gzip JavaScript, 6,033 B gzip CSS, and 14,501 B mobile hero image. Console/CSP, keyboard, mobile, dark theme, reduced-motion, and axe checks are included in the passing browser suite.

Every prior review finding was confirmed in current live behavior and source rather than relying on its polish note: R1 B1–B4/H5/M6/M7, R2 B1/B2/H3/H4/M5–M8/min9, F-3-1–F-3-4, F-4-1/F-4-2, and F-5-1–F-5-4 are fixed. There is no regression to reopen under the history rule.

## Missed leverage

No missing AI feature is a finding. The brief asks for a local, evidence-first record rather than an identification engine; the product explicitly avoids automatic ID, remains useful offline, and already provides the implied import/export path. Adding a Sociobot-powered species guess would conflict with the stated purpose and privacy model. No provider key, decorative AI feature, or remote AI request was found.

## What would make this perfect

Nothing is currently required. Retain the claim registry, fresh-demo isolation checks, and cold-phone first-screen assertion as release gates so this result does not regress.
