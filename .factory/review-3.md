# Adversarial first-read review 3 — Bird ID Evidence Card

## Verdict: FAIL

Reviewed 2026-08-28 against the live site and clean repository commit `4e7bca4`. The core job, sample workflow, all registered claim commands, offline behaviour, and visual identity now verify. Acceptance still fails because the static route documents contain four `<h1>` elements, the product shell is not actually consistent across app and legal routes, and several public privacy/audio promises are not listed or fully proved as claims.

## First screen, before scrolling

Fresh Chromium contexts at 390 × 844 and 1440 × 900 loaded `/` with no console or page errors.

- What it does: records the observed evidence behind an uncertain bird sighting before logging it.
- For whom: birders comparing an app suggestion with what they saw and heard.
- First action: `Try it with sample data`; the adjacent result is `See a completed uncertain-sighting card.`

The exact visible copy is `Record bird evidence before you log.`, `For birders checking an app suggestion against what they saw and heard.`, and the action/outcome above. This check passes.

## Findings, ordered by severity

### BLOCKING F-3-1 — every app route ships four `<h1>` elements, not one

**Location/evidence:** raw live responses for `/`, `/demo`, `/records`, and `/guide` each contain these four headings: `Record bird evidence before you log.`, `Your current evidence card`, `Saved evidence cards`, and `Check an uncertain bird in four steps`. The same four `<h1>` elements are in [index.html](../index.html#L49), [index.html](../index.html#L65), [index.html](../index.html#L196), and [index.html](../index.html#L209). Runtime CSS hides inactive views, but does not change the route document.

**Why this fails:** the required structure is one `<h1>` per page and that heading must be the route headline. A static reader, crawler, or JavaScript-failed first render receives four page-level headings, including three for destinations the visitor did not open. CSS hiding is not a route document.

**Concrete fix:** build route-specific documents/components so each response contains exactly its current route `<h1>`; use lower-level headings only for subordinate content. Add a route-response test that fetches `/`, `/demo`, `/records`, and `/guide` and asserts `document.querySelectorAll('h1').length === 1` and the expected heading text.

### BLOCKING F-3-2 — public claims still exceed the registry and tests (reopens review 1 blocking 3 / review 2 high 3)

**Location/quotes:** the following live statements have no matching claim entry with an observable test. Some existing entries prove a narrower neighbour, not the quoted promise.

- Landing reference help: `This app stores the link and your notes; it never copies or hosts the audio.` The `no-audio-fetch` claim only says links are stored as text and not fetched; its test only observes that no request reaches xeno-canto.
- Privacy: `You do not need an account.` The registry has `free`, not a no-account claim, even though its current test happens to look for no sign-in prompt.
- Privacy: `New cards use locality-only exports. Coordinates stay out of an export unless you choose Precise and enter both values.` `private-coordinates` only checks a private sample CSV. It does not prove the default or the precise/both-values condition.
- Privacy controls: `Delete cards from Saved cards.` and `Clear site storage in your browser to remove local data.` Neither capability is a claim entry or an independently tagged outcome test.
- Privacy reference wording: `The app does not fetch, cache, or reproduce linked audio.` The registry/test prove no fetch, not cache or reproduction.

**Why this fails:** these privacy and data-handling statements are promises a birder can rely on before entering sensitive locality information. The prior repair added tests, but retained stronger copy than those tests and registry entries prove.

**Concrete fix:** either narrow the copy to the existing proved claim — for example, `The app stores the link as text and does not fetch it.` — or add one explicit claim and sandbox test for each retained promise. Add tests for no-account flow, default locality-only export, precise export only with both coordinates, deletion, clearing local data, and the audio storage boundary. Update each claim's `where` field to cover Privacy as well as the landing page.

### BLOCKING F-3-3 — app and legal chrome remain inconsistent (reopens review 2 medium 7)

**Location/evidence:** the live app header has `Edit evidence card`, `View saved cards`, and `Read the evidence guide`. The live Privacy, Terms, and 404 headers have `Edit evidence card`, `Try sample data`, `Evidence guide`, and `Privacy`. The app footer says `Built by Param Factory · v1.0.1`; legal and 404 footers say `Built by Param Factory · v1.0.2`.

**Why this fails:** a visitor who moves to Privacy or Terms is given a different site navigation and a contradictory build identifier. This is a half-fix of the earlier common-chrome finding, not a consistent product shell.

**Concrete fix:** render one shared header/footer definition across app, demo, legal, and 404 routes. Keep the same wordmark, route destinations, labels, Privacy/Terms links, and one build value. Add a browser test that compares the ordered primary-nav and footer-link labels plus build identifier on all public routes.

### MINOR F-3-4 — export copy leaves technical file formats unexplained

**Location/quote:** README: `Export one card as CSV or Markdown, and saved cards as a JSON backup.` The matching app actions are `Export CSV`, `Export Markdown`, and `Export backup`.

**Why this can slow a first-time visitor:** CSV, Markdown, and JSON are file-format jargon. The buttons correctly name the result, but neither the README nor the UI says which is useful for a spreadsheet, sharing text, or moving cards.

**Concrete fix:** keep the result-naming buttons, then add concise help: `CSV opens in a spreadsheet. Markdown is a shareable text card. Export backup saves all cards for moving to another browser.`

## Copy audit

Word counts treat hyphenated words as one word. No landing or README sentence exceeds 22 words and no banned marketing adjective appears. `C` refers to F-3-2; `J` refers to F-3-4. All unmarked copy passes this audit.

### Landing page sentences and sentence-like help

| # | Exact copy | Words | Flag |
| --- | --- | ---: | --- |
| L1 | Record bird evidence before you log. | 6 | — |
| L2 | For birders checking an app suggestion against what they saw and heard. | 12 | — |
| L3 | See a completed uncertain-sighting card. | 5 | — |
| L4 | Works offline after first visit | 5 | Listed claim |
| L5 | Stays on this device | 4 | Listed claim |
| L6 | Free | 1 | Listed claim |
| L7 | Name the broad place, not a nest site. | 8 | — |
| L8 | Coordinates hidden. | 2 | Covered by privacy-positioning copy |
| L9 | Coordinates are excluded. | 3 | Listed claim |
| L10 | Avoid recording nest locations for sensitive species. | 7 | — |
| L11 | Write only what you noticed: size, shape, flight, bill, plumage, behaviour… | 11 | — |
| L12 | Specific negatives help too: “no black wing tips visible.” | 9 | — |
| L13 | Rhythm, pitch, repetition, distance, direction—and whether the caller was visible. | 11 | — |
| L14 | This is still useful observed evidence. | 6 | — |
| L15 | Record who suggested it and why it does or does not fit. | 12 | — |
| L16 | Set your confidence. | 3 | — |
| L17 | Fits: stiff-winged glide. | 3 | — |
| L18 | Contradiction: call seemed sharper… | 4 | — |
| L19 | Link to material you have permission to use. | 8 | — |
| L20 | This app stores the link and your notes; it never copies or hosts the audio. | 15 | C |
| L21 | No references linked yet. | 4 | — |
| L22 | This step is optional. | 4 | — |
| L23 | What matched or differed? | 4 | — |
| L24 | What supports or contradicts the leading candidate? | 7 | — |
| L25 | What would resolve it? | 4 | — |
| L26 | Your visual and audio notes will appear here. | 8 | — |
| L27 | A complete card does not confirm the species. | 8 | Covered by `no-automatic-identification` |
| L28 | It records what you observed and what still needs checking. | 10 | Covered by `record-evidence-card` |
| L29 | A private evidence card for uncertain bird sightings. | 8 | — |
| L30 | Field-console artwork generated for this product. | 6 | Listed claim |

### Landing headings and actions

All headings make sense out of context: `Record bird evidence before you log.`, `Your current evidence card`, `When and where`, `What you saw`, `What you heard`, `Candidate species`, `Reference recordings`, `Choose the identification status`, and `Evidence card preview`. The exception is structural, not wording: four are `<h1>` elements (F-3-1).

All buttons/actions use result-naming verbs: `Try it with sample data`, `Add candidate`, `Add reference`, `Save evidence card`, `Export Markdown`, `Export CSV`, `Start a new card`, `Reset demo`, `Start a blank card`, `Export backup`, `Import backup`, `Open card`, `Delete`, and `Keep card`. The three export-format labels need the explanatory helper in F-3-4, but are not mislabelled buttons.

### README sentences and headings

| # | Exact copy | Words | Flag |
| --- | --- | ---: | --- |
| R1 | Record bird evidence before you log an uncertain sighting. | 9 | Listed claim |
| R2 | For birders checking an app suggestion against what they saw and heard. | 12 | — |
| R3 | It records notes and does not identify birds. | 9 | Listed claim |
| R4 | Try the sample bird sighting at bird-id-evidence-card.sociobot.in/demo. | 6 | — |
| R5 | Keeps observed notes separate from candidate suggestions. | 7 | Listed claim |
| R6 | Records locality, visual notes, call notes, candidates, and an unresolved decision. | 10 | Covered by `record-evidence-card` |
| R7 | Export one card as CSV or Markdown, and saved cards as a JSON backup. | 12 | J |
| R8 | Works offline after the first visit. | 6 | Listed claim |
| R9 | Stays on this device. | 5 | Listed claim |
| R10 | Stores reference links as text and does not fetch them. | 10 | Listed claim |
| R11 | Locality-only exports exclude coordinates. | 4 | Listed claim |
| R12 | Review sensitive wildlife locations before sharing an export. | 8 | — |
| R13 | Open the local address shown after the development server starts. | 9 | — |
| R14 | Open `/demo` to use sample data that stays separate from your cards. | 11 | Listed claim |
| R15 | Automated product checks and their commands are listed in `.factory/claims.json`. | 10 | Developer documentation, not visitor copy |
| R16 | Use evidence cards as notes, not verdicts. | 7 | — |
| R17 | See Privacy and Terms. | 4 | — |

README headings are descriptive: `What it does`, `Record and export evidence cards`, `Run locally`, `Test and build`, `Privacy and limits`, and `Research, design, demo, and licence files`. No README heading or button wording is a separate copy finding.

## Demo and sandbox verification

This part passes.

- One click on `Try it with sample data` opened `/demo`.
- The first phone screen showed a completed-looking Northern Fulmar evidence card for `Deerness coast, Orkney`, visual/call notes, two candidates, 65% tentative confidence, locality-only status, and unresolved decision.
- The persistent banner read `Demo — sample data, nothing is saved.` Reset restored `Deerness coast, Orkney` after the asynchronous update completed.
- In a fresh live context, a real database sentinel remained byte-for-byte unchanged after demo edit, save, reset, and `Start a blank card`.
- After service-worker control, an offline `/demo` reload kept the sample visible, displayed `Offline field mode`, and allowed editing. Demo-flow requests were same-origin only; no console errors occurred.

## Claim verification from a clean clone

Clean clone: `/tmp/bird-review-3.3ClPNY` created with `git clone --no-local /work/repo`, followed by `npm ci`. Every exact command in `.factory/claims.json` passed independently without a pre-existing `dist/` directory:

| Claim | Result |
| --- | --- |
| `record-evidence-card` | PASS |
| `separate-observation-and-suggestion` | PASS |
| `no-automatic-identification` | PASS |
| `offline-demo` | PASS |
| `device-only` | PASS |
| `free` | PASS |
| `demo-isolation` | PASS |
| `exports` | PASS |
| `private-coordinates` | PASS |
| `no-audio-fetch` | PASS |
| `stored-card-schema` | PASS |
| `no-tracking-or-remote-assets` | PASS |
| `generated-artwork` | PASS |

The focused route, accessibility, and legal-metadata suite also passed 6/6 in mobile and desktop Chromium. `scripts/verify-url.sh https://bird-id-evidence-card.sociobot.in/` passed. Claim command output is retained at `/tmp/bird-review-3-claims.log` in this review container.

## Structure, history, and leverage checks

- Titles, descriptions, canonical URLs, Open Graph/Twitter fields, SVG favicon/apple touch icon, sitemap, CSP, designed 404, route deep links, Back focus, link crawl, and same-origin resource behaviour verify. Internal destinations returned 200; the intentional unknown route returned the designed 404.
- The field-instrument artwork, paper/enamel palette, calibration language, and evidence-card readout are recognisably product-specific. This is not a generic SaaS template.
- Review 1 findings 1, 2, 4, 5, 6, and 7 verify as fixed. Review 1 finding 3 is reopened as F-3-2.
- Review 2 findings 1, 2, 4, 5, 6, 8, and 9 verify as fixed. Review 2 finding 3 is reopened as F-3-2; review 2 finding 7 is reopened as F-3-3.
- The brief calls for a private evidence form and exports, which are present. An AI identification/suggestion feature would weaken its explicit observation-before-suggestion boundary, so no AI omission is a finding. No provider key or decorative AI feature was found.

## What would make this perfect

Serve one semantic route document per route, use one shared product shell and build identifier everywhere, then make every privacy/audio/data-control promise either exactly testable from the demo sandbox or more narrowly worded. Add one plain-language export-format explanation. With those changes and the tests specified above, the product would be clear, tryable, and honest with no remaining review findings.
