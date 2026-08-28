# Adversarial first-read review 2

## Verdict: FAIL

The first screen and demo are clear and useful, but acceptance is blocked by two defects: all seven registered claim commands fail from a clean clone, and the app's `/guide` and `/records` route changes leave a phone user looking at the unchanged landing hero. `PASS` requires zero blocking findings.

Reviewed on 28 August 2026 against live production and clean commit `e9a4f330e4dc55457be6c3ae8a7cba0b51fff41b`. Word counts treat a hyphenated term as one word and an em dash as a separator.

## First screen, before scrolling

Fresh 390 × 844 and 1440 × 900 Chromium contexts both loaded `/` at scroll position 0 with no console error.

- What it does: records the evidence behind an uncertain bird sighting before the birder logs it.
- Who it is for: birders comparing an app suggestion with what they saw and heard.
- What to click first: `Try it with sample data`; the adjacent text says the result is a completed uncertain-sighting card.

The exact copy that supplied those answers was `Record bird evidence before you log.`, `For birders checking an app suggestion against what they saw and heard.`, and `Try it with sample data` / `See a completed uncertain-sighting card.` All are visible without scrolling in both viewports. This check passes.

## Findings, ordered by severity

### BLOCKING 1 — every registered claim command fails from a clean clone

**Quote:** every command ends with `Error: Timed out waiting 30000ms from config.webServer.`

| Claim | Exact command result |
| --- | --- |
| `offline-demo` | FAIL, exit 1 |
| `device-only` | FAIL, exit 1 |
| `free` | FAIL, exit 1 |
| `demo-isolation` | FAIL, exit 1 |
| `exports` | FAIL, exit 1 |
| `private-coordinates` | FAIL, exit 1 |
| `no-audio-fetch` | FAIL, exit 1 |

**Why this misleads:** `.factory/claims.json` tells a verifier that each command independently proves its promise from a clean state. Playwright starts `npm run preview`, but a clean clone has no `dist/`, so the server never becomes ready. None of the listed commands reaches its assertion.

**Concrete fix:** make the Playwright `webServer.command` build before previewing, for example `npm run build && npm run preview -- --host 127.0.0.1`, or add the build step to every registered command. Then run every exact command in a new clone. As diagnostic evidence only, after manually running `npm run build`, one combined `--grep '@claim:'` run passed all 14 mobile/desktop cases; that does not make the registered clean-clone commands pass.

### BLOCKING 2 — route navigation changes the URL but leaves the destination off-screen

**Quote:** selecting `Read the evidence guide` at the top of the 390px page changed the URL to `/guide`, left `scrollY` at `0`, and focused the off-screen heading `A two-minute evidence check`. `guideInViewport` was false. The visible screen still began with `Record bird evidence before you log.`

**Why this loses a first-time visitor:** the visible page appears not to respond. Direct `/guide` and `/records` loads also retain the landing headline as the only visible `<h1>`, while their actual page titles are `<h2>` elements below the full hero. `/demo` hides that only `<h1>` entirely, which axe reports as `page-has-heading-one`. This fails the route contract and makes navigation materially broken on a phone.

**Concrete fix:** make each route render its own first-screen `<h1>` and route content. Remove or hide the landing masthead on `/guide` and `/records`; promote `A two-minute evidence check`, `Saved evidence cards`, and `Your current evidence card` on `/demo` to the route `<h1>`. On push/back navigation, focus that `<h1>` and move it into view while preserving the appropriate saved scroll position.

### HIGH 3 — claim-like copy is absent from the claims registry

These are separate unlisted-claim findings. Existing entries cover offline use, device-only behavior, price, demo isolation, exports, coordinate exclusion, and reference fetching; they do not name or test the promises below.

| Quote and location | Why it can mislead | Concrete fix |
| --- | --- | --- |
| `Record bird evidence before you log an uncertain sighting.` — README; shorter version on landing | The core recording job has no registered end-to-end claim. | Add `record-evidence-card` and test entering, previewing, saving, reloading, and reopening a card. |
| `Keeps observed notes separate from candidate suggestions.` — README | This separation is central to the product's safety position but is unverified. | Add a claim whose test checks distinct persisted/exported observation and suggestion fields. |
| `Helps you record a locality, visual account, call notes, candidates, and an unresolved decision.` — README | A visitor can rely on all five capabilities, but no entry asserts the complete workflow. | Cover these fields in `record-evidence-card`, including the unresolved state. |
| `It records an evidence card; it does not identify birds.` — README; also expanded on Guide and Terms | The non-identification boundary is important but is not registered. | Add a `no-automatic-identification` claim and a test that the sample flow never generates or verifies an identity; keep one consistent sentence. |
| `This limits suggestion bias.` — Guide | This is a causal outcome the sandbox cannot prove. | Remove the causal sentence. Keep the instruction: `Record your own notes before opening another guide.` |
| `It has no account or app server.` — Privacy | `device-only` checks request origins, not the absence of an account or application endpoint. | Add a scoped `no-account` claim/test, or rewrite to the directly observable `You do not need an account.` |
| `Your draft and saved evidence cards contain only what you enter.` — Privacy | The app also creates IDs, card numbers, timestamps, and default state, so `only` is inaccurate. | Rewrite: `Cards store your entries, a card number, local timestamps, and review status in this browser.` Register and inspect the stored schema. |
| `It does not load analytics, ads, remote fonts, or the recording links you add.` — Privacy | The existing same-origin assertion would still permit same-origin analytics and does not inspect scripts/fonts. | Add a `no-tracking-or-remote-assets` entry that checks requests and loaded resources, or narrow the sentence to the tested behavior. |
| `This independent tool does not imply affiliation.` / `This independent tool is not affiliated with them.` — Guide and Terms | Two versions make a factual relationship claim without a registry entry. | Keep one legal sentence and add a repository-level assertion that no integration or branded asset is shipped; otherwise remove the product claim. |
| `Requires Node.js 22+ and npm.` and `The build command creates dist/ with dist/index.html at its root.` — README | These developer-facing statements are testable but unlisted; the failed clean-clone commands show why setup claims matter. | Add an `engines.node` constraint and a `build-output` claim using `npm run build && npm run test:build`. |

### HIGH 4 — the registered demo-isolation test does not prove that real data is untouched

**Quote:** its sandbox says `verify real database remains empty`, while the test only asserts that `bird-id-evidence-card` does not exist in a fresh demo-only context.

**Why this can mislead:** absence before use is weaker than isolation. A regression that writes to both databases could evade the intended check depending on when the assertion runs.

**Concrete fix:** seed a sentinel card in `bird-id-evidence-card`, enter `/demo`, edit/save/reset/leave the demo, and assert the real database remains byte-for-byte unchanged. The manual review did this successfully; turn that exercise into the claim test.

### MEDIUM 5 — route metadata describes the landing page, not the current route

**Quote:** `/demo`, `/records`, and `/guide` all emit canonical `https://bird-id-evidence-card.sociobot.in/`, OG title `Bird ID Evidence Card — record uncertain sightings`, and the landing description. The OG image is a 768 × 768 JPEG rather than the required 1200 × 630 image.

**Why this misleads:** copied or indexed deep links identify themselves as the landing page. The demo and archive do not have route-specific descriptions or social metadata.

**Concrete fix:** update canonical, description, OG, and Twitter fields on every SPA route, or serve route-specific shells. Add a product-art 1200 × 630 social image. Give the 404 OG/Twitter metadata and an apple-touch icon too.

### MEDIUM 6 — several touch targets are below 44px

**Quote:** at 390px, `Reset demo` and `Start for real` are 32px high. The Privacy footer's `Terms` and Terms footer's `Privacy` links are 15px high. The 404's `Try sample data` is 19px high and its `Terms` link is 15px high.

**Why this loses a phone visitor:** these controls are harder to tap accurately, especially the controls that exit or recover the demo.

**Concrete fix:** give every visible link/button a minimum 44 × 44px interactive box, including demo-banner and legal/404 footer links. Retest at 390px.

### MEDIUM 7 — page chrome and landmarks are inconsistent

**Quote:** app footer links are `Privacy`, `Terms`, `How it works`; Privacy footer contains only `Terms`; Terms footer contains only `Privacy`; the 404 footer contains only `Terms`. App and legal headers also expose different destination sets. Axe reports `landmark-complementary-is-top-level` on `/guide` for its nested complementary landmark.

**Why this loses a visitor:** legal and recovery pages remove expected navigation, so the same product has no stable header/footer skeleton. The guide landmark is also announced in an unexpected structure.

**Concrete fix:** share one header/footer component or identical markup across all routes, always include both Privacy and Terms in the footer, and make the guide aside a top-level sibling landmark or remove its landmark semantics.

### MEDIUM 8 — security headers omit the required content policy

**Quote:** the live response includes HSTS, `Referrer-Policy`, and `X-Content-Type-Options`, but no `Content-Security-Policy`.

**Why this matters:** the site-structure contract requires a CSP matching actual loads. The current static app has a small, same-origin surface that can support a strict policy.

**Concrete fix:** add an explicit CSP to `staticwebapp.config.json`, test it against every route and the service worker, and confirm zero CSP console violations.

### MINOR 9 — the sample reference is not the recording the interface says it is

**Quote:** section `Reference recordings`; sample title `Personal field notes: cliff seabirds`; URL `https://example.invalid/personal-notes`.

**Why this weakens the demo:** the rest of the Deerness sample is realistic, but this row cannot demonstrate the licensed-reference-recording part of the job and changes the meaning of `reference` mid-flow.

**Concrete fix:** ship a plausible, openly licensed recording citation and stable source URL as text, with licence and comparison notes. Keep the no-fetch behavior.

## Copy audit

No landing or README sentence exceeds 22 words. Neither contains a banned marketing adjective. Average sentence length is below 14 words. Flags below map to concrete copy findings; `—` means no plain-words issue found.

### Landing page sentences

This covers all sentence or sentence-fragment copy visible in the initial `/` workbench, including input help, placeholders, preview copy, and footer provenance.

| # | Exact copy | Words | Flag |
| --- | --- | ---: | --- |
| L1 | Record bird evidence before you log. | 6 | Unlisted claim; see finding 3 |
| L2 | For birders checking an app suggestion against what they saw and heard. | 12 | — |
| L3 | See a completed uncertain-sighting card. | 5 | — |
| L4 | Works offline after first visit | 5 | Listed claim |
| L5 | Stays on this device | 4 | Listed claim |
| L6 | Free | 1 | Listed claim |
| L7 | Name the broad place, not a nest site. | 8 | — |
| L8 | Privacy shutter on. | 3 | Jargon/metaphor; rewrite `Coordinates hidden.` |
| L9 | Coordinates are excluded. | 3 | Listed claim |
| L10 | Avoid recording nest locations for sensitive species. | 7 | — |
| L11 | Write only what you noticed: size, shape, flight, bill, plumage, behaviour… | 11 | — |
| L12 | Specific negatives help too: “no black wing tips visible.” | 9 | — |
| L13 | Rhythm, pitch, repetition, distance, direction—and whether the caller was visible. | 11 | — |
| L14 | This is still useful observed evidence. | 6 | — |
| L15 | Record who suggested it and why it does or does not fit. | 12 | — |
| L16 | Confidence is yours—not the app’s score. | 7 | — |
| L17 | Fits: stiff-winged glide. | 3 | — |
| L18 | Contradiction: call seemed sharper… | 4 | — |
| L19 | Link to material you have permission to use. | 8 | — |
| L20 | This app stores the link and your notes; it never copies or hosts the audio. | 15 | Listed in part; keep one registry sentence for store/fetch/host behavior |
| L21 | No references linked yet. | 4 | — |
| L22 | This step is optional. | 4 | — |
| L23 | What matched or differed? | 4 | — |
| L24 | What supports or contradicts the leading candidate? | 7 | — |
| L25 | What would resolve it? | 4 | — |
| L26 | Your visual and audio notes will appear here. | 8 | — |
| L27 | A complete card is not a certain ID. | 8 | `ID` shorthand; rewrite `A complete card does not confirm the species.` |
| L28 | It means your uncertainty has a useful trail. | 8 | Abstract; rewrite `It records what you observed and what still needs checking.` |
| L29 | A private evidence card for uncertain bird sightings. | 8 | — |
| L30 | Field-console artwork generated for this product. | 6 | — |

### Landing headings and actions

Repeated labels such as `Observed fact` are listed once. Field labels and select options are not sentences, but were checked for terminology.

| Copy | Words | Type | Flag / rewrite |
| --- | ---: | --- | --- |
| A private evidence card | 4 | Eyebrow | — |
| Record bird evidence before you log. | 6 | h1 | — |
| Your current evidence card | 4 | h2 | — |
| When and where | 3 | h3 | — |
| What you saw | 3 | h3 | — |
| What you heard | 3 | h3 | — |
| Candidate species | 2 | h3 | — |
| Reference recordings | 2 | h3 | Inconsistent with the sample's field-notes reference; see finding 9 |
| Decision | 1 | h3 | Vague out of context; rewrite `Choose the identification status` |
| Unresolved bird | 2 | Preview h3 | — |
| Live card readout | 3 | Standalone label | Instrument jargon; rewrite `Evidence card preview` |
| Field record | 2 | Standalone label | Inconsistent with `evidence card`; rewrite `Evidence card` |
| Edit evidence card | 3 | Link | Result-naming verb |
| View saved cards | 3 | Link | Result-naming verb |
| Read the evidence guide | 4 | Link | Result-naming verb |
| Try it with sample data | 6 | Primary link | Result-naming verb |
| Add candidate | 2 | Button | Result-naming verb |
| Add reference | 2 | Button | Result-naming verb |
| Save evidence card | 3 | Button | Result-naming verb |
| Export Markdown | 2 | Button | Result-naming verb; output needs explanation for nontechnical users |
| Export CSV | 2 | Button | Result-naming verb; output needs explanation for nontechnical users |
| Start a new card | 4 | Button | Result-naming verb |

The demo-only action `Start for real` is vague. Rewrite it as `Start a blank card`. In the delete dialog, rewrite `Cancel` as the result `Keep card`.

### README sentences

| # | Exact copy | Words | Flag |
| --- | --- | ---: | --- |
| R1 | Record bird evidence before you log an uncertain sighting. | 9 | Unlisted claim; see finding 3 |
| R2 | For birders checking an app suggestion against what they saw and heard. | 12 | — |
| R3 | It records an evidence card; it does not identify birds. | 10 | Unlisted claim; see finding 3 |
| R4 | Try the shipped sample at bird-id-evidence-card.sociobot.in/demo. | 6 | `shipped sample` is developer jargon; rewrite `Try the sample bird sighting at bird-id-evidence-card.sociobot.in/demo.` |
| R5 | Keeps observed notes separate from candidate suggestions. | 7 | Unlisted claim; see finding 3 |
| R6 | Helps you record a locality, visual account, call notes, candidates, and an unresolved decision. | 14 | Unlisted claim; see finding 3 |
| R7 | Exports demo evidence cards as CSV, Markdown, and JSON. | 9 | Misstates JSON, which is an archive backup; rewrite `Export one card as CSV or Markdown, and saved cards as a JSON backup.` |
| R8 | Works offline after the first visit. | 6 | Listed claim |
| R9 | Keeps cards on this device. | 5 | Listed claim; align wording with `Stays on this device` |
| R10 | Locality-only exports exclude coordinates. | 4 | Listed claim |
| R11 | Reference links are stored as text and are not fetched. | 10 | Listed claim |
| R12 | Requires Node.js 22+ and npm. | 5 | Unlisted setup claim; see finding 3 |
| R13 | Open the local URL printed by Vite. | 7 | `Vite` is unexplained; rewrite `Open the local address shown after the development server starts.` |
| R14 | Use /demo for the isolated sample. | 6 | `isolated` and `sample` differ from demo-banner terms; rewrite `Open /demo to use sample data that stays separate from your cards.` |
| R15 | The build command creates dist/ with dist/index.html at its root. | 10 | Unlisted build claim; see finding 3 |
| R16 | Claim commands are listed in .factory/claims.json. | 6 | Factory jargon; rewrite `Automated product checks and their commands are listed in .factory/claims.json.` |
| R17 | Use evidence cards as notes, not verdicts. | 7 | — |
| R18 | Review sensitive wildlife locations before sharing any export. | 8 | — |
| R19 | See Privacy and Terms. | 4 | — |

README headings and word counts: `Bird ID Evidence Card` (4), `What it does` (3), `Run locally` (2), `Test and build` (3), `Privacy and limits` (3), and `Project notes` (2). Rewrite the context-poor `Project notes` as `Research, design, demo, and licence files`. The README has no buttons.

## Demo and sandbox evidence

Core demo behavior passes.

- One click from the landing CTA opens `/demo` at scroll position 0.
- The first phone screen shows the live, completed evidence-card preview for a Northern Fulmar candidate at Deerness coast, with all six progress sections complete.
- The persistent banner says `Demo — sample data, nothing is saved.` and offers Reset and a real-workspace exit.
- Changing the demo locality and selecting Reset restores `Deerness coast, Orkney`.
- A real card named `REAL STORAGE SENTINEL` was created first. Demo edit/reset/exit left it unchanged in `bird-id-evidence-card`; demo data remained confined to `demo:bird-id-evidence-card`.
- In a separate fresh context, the service worker controlled `/demo`; offline reload showed the sample, accepted an edit, and displayed the offline banner. All observed requests were same-origin, with no failed requests or console errors.

The demo's behavior is stronger than its current automated isolation assertion; finding 4 requires preserving that manual result as a regression test.

## Structure and accessibility checks

Passes:

- `/`, `/demo`, `/records`, `/guide`, `/privacy/`, and `/terms/` return 200. An unknown route returns the designed field-console 404 with status 404 and working recovery links.
- Root has `lang="en"`, one visible `<h1>`, one `<main>`, a descriptive title, meta description, canonical, SVG favicon, apple-touch icon, OG/Twitter tags, visible focus treatment, and no console errors.
- The complete internal-link crawl found no dead links or missing fragment targets.
- Browser Back restored `/` after `/guide`; focus changed, though to the wrong heading level and off-screen as described in finding 2.
- Axe found zero serious or critical violations on all reviewed routes. Root, Privacy, Terms, and 404 had no axe violations at all.
- The generated mid-century field-instrument art, paper/enamel palette, typography, calibration marks, and mechanical controls are recognisably product-specific rather than a generic SaaS template.
- First-load JavaScript is 9.90 kB gzip in a fresh production build, below the 150 kB structure limit.

Failures are findings 2 and 5–8. Additionally, the 404 lacks OG/Twitter metadata, and the demo has no visible `<h1>`.

## Verification record

- Clean clone: `/tmp/bird-review-2.V8RrGl`, created with `git clone --no-local /work/repo ...` before review files were added.
- Exact claim commands: seven failures, each caused by the 30-second Playwright web-server timeout.
- Diagnostic after explicit build: `npm run build && npm run test:e2e -- --grep '@claim:'` — 14 passed.
- Repository gate `npm test` — 6 unit tests passed, the production build and service-worker shell check passed, and Playwright finished with 21 passed / 1 intentional skip.
- Live `scripts/verify-url.sh` — pass.
- Live axe scan — zero serious/critical violations; moderate findings on Demo and Guide are reported above.
- Live link crawl — all internal HTTP targets returned 200 except the intentional unknown route, which returned 404; no missing hash target.
- Live offline/network interception — controlled offline reload/edit passed; zero cross-origin requests, request failures, or console errors.
- Live response headers — HSTS, referrer policy, and `nosniff` present; CSP absent.

## Acceptance result

`PASS` requires zero blocking findings and at most three minor findings. This review records seven blocking claim-command failures plus one blocking routing finding. The result is **FAIL**.
