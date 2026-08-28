# Adversarial first-read review 4 — Bird ID Evidence Card

## Verdict: FAIL

Reviewed 2026-08-28 against <https://bird-id-evidence-card.sociobot.in/> and repository commit `c09035ce58bcd5cf9c7fe106664972daf6198d4e`. Fresh Chromium contexts used 390 × 844 and 1440 × 900 viewports. No product code was changed.

The main product, sample workflow, registered claims, and primary routes pass. Acceptance is still blocked by two findings. The public offline fallback is broken by the site's own CSP, and previously reported plain-word terminology remains in live and state copy. This round requires zero findings, so the verdict is `FAIL`.

## First screen, before scrolling

Both fresh contexts opened `/` at scroll position 0 with no console error.

- **What it does:** records the evidence behind an uncertain bird sighting before it is logged.
- **Who it is for:** birders checking an app suggestion against what they saw and heard.
- **What to click first:** `Try it with sample data`; the adjacent text promises a completed uncertain-sighting card.

The exact text supplying those answers is `Record bird evidence before you log.`, `For birders checking an app suggestion against what they saw and heard.`, `Try it with sample data`, and `See a completed uncertain-sighting card.` All four were visible in the first 390 × 844 screen and the desktop first screen. This check passes.

## Findings, ordered by severity

### BLOCKING F-4-1 — the public offline fallback is unstyled, violates CSP, and omits the product shell

**Exact location and quote:** live `/offline.html`; h1 `Field mode is offline`; link `Open the workbench`. The route contains its complete presentation in an inline `<style>` element at `public/offline.html:6`, while the live header sets `Content-Security-Policy: ... style-src 'self'`.

**Observed result:** a cold 390 px load returned HTTP 200 and logged `Applying inline style violates the following Content Security Policy directive 'style-src 'self''`. Chromium blocked the stylesheet. The page rendered as browser-default black text on white, and `Open the workbench` measured 17 px high rather than the required 44 px. It has no meta description, canonical URL, Open Graph/Twitter fields, favicon, product header, product footer, Privacy link, Terms link, factory credit, or build id.

**Why this fails:** this is a shipped fallback for the product's defining offline behavior, not a development file. The CSP creates a console error and strips the intended field-instrument identity exactly when a visitor needs recovery guidance. It also means prior touch-target, common-chrome, CSP, and shared-shell findings were only fixed for the routes covered by the existing test list. This reopens the substance of review 2 findings 6–8 and review 3 finding F-3-3; the history rule makes the regression blocking.

**Concrete fix:** move the fallback styles to a self-hosted stylesheet allowed by the CSP. Render `/offline.html` with the same wordmark, primary navigation, footer, Privacy/Terms links, version, favicon, canonical, description, and social metadata as the other routes. Keep one route-specific h1 and a recovery link of at least 44 × 44 px. Add `/offline.html` to the shared route/metadata/chrome/touch-target/console test and verify its actual service-worker fallback path with the network disabled.

### BLOCKING F-4-2 — prior jargon and terminology findings remain half-fixed in reachable product copy

**Exact quotes and locations:** `Ready locally` on the live landing workbench; `Field-console artwork generated for this product.` in every live footer; `Confirm action` in the shared dialog at `index.html:238`; `saved in your archive`, `Could not read the local archive for export.`, `matching IDs were updated.`, and `A fresh field console is ready.` in `src/main.ts:467`, `src/main.ts:522`, `src/main.ts:539`, and `src/main.ts:554–559`.

**Why this fails:** `field console`, `archive`, `IDs`, and `locally` are implementation or design terms, while the rest of the product uses `evidence card`, `backup`, and `this device/browser`. `Confirm action` also does not identify the action when heard as a dialog heading. Review 1 findings 6 and 7 required consistent terms and standalone headings; `.factory/copy-audit.md` now says there are no flags but omits these reachable state strings. Under this round's history rule, a half-fixed earlier finding is blocking.

**Concrete fix:** use `Ready on this device`; `Artwork generated for Bird ID Evidence Card`; `An update is ready` with `Load update`; `saved under Saved evidence cards`; `Could not read your saved evidence cards for backup`; and `Imported N cards. Existing copies of those cards were replaced.` Set the dialog heading to the specific action, such as `Start a new evidence card?` or `Delete this evidence card?`. Replace `JSON backup` in the delete warning with `exported backup`. Expand the copy-audit test/source extraction to include dialog, toast, error, offline, and import/export states.

## Copy audit

Counts treat hyphenated terms as one word. No landing or README sentence exceeds 22 words, and no banned marketing adjective appears. `CSV`, `Markdown`, and `JSON` are followed by plain explanations in the README; the landing explains the two formats next to their actions.

### Landing page sentences, fragments, help, and placeholders

| # | Exact copy | Words | Result |
| --- | --- | ---: | --- |
| L1 | Record bird evidence before you log. | 6 | Pass |
| L2 | For birders checking an app suggestion against what they saw and heard. | 12 | Pass |
| L3 | See a completed uncertain-sighting card. | 5 | Pass |
| L4 | Works offline after first visit | 5 | Listed claim |
| L5 | Stays on this device | 4 | Listed claim |
| L6 | Free | 1 | Listed claim |
| L7 | Ready locally | 2 | Inconsistent storage term; F-4-2 |
| L8 | Required for a complete card | 5 | Pass |
| L9 | Name the broad place, not a nest site. | 8 | Pass |
| L10 | Coordinates hidden. | 2 | Pass |
| L11 | Coordinates are excluded. | 3 | Listed claim |
| L12 | Avoid recording nest locations for sensitive species. | 7 | Pass |
| L13 | Write only what you noticed: size, shape, flight, bill, plumage, behaviour… | 11 | Pass |
| L14 | Specific negatives help too: “no black wing tips visible.” | 9 | Pass |
| L15 | Rhythm, pitch, repetition, distance, direction—and whether the caller was visible. | 11 | Pass |
| L16 | This is still useful observed evidence. | 6 | Pass |
| L17 | Record who suggested it and why it does or does not fit. | 12 | Pass |
| L18 | Set your confidence. | 3 | Pass |
| L19 | Fits: stiff-winged glide. | 3 | Pass |
| L20 | Contradiction: call seemed sharper… | 4 | Pass |
| L21 | Link to material you have permission to use. | 8 | Pass |
| L22 | The app stores the link as text and does not fetch it. | 12 | Listed claim |
| L23 | No references linked yet. | 4 | Pass |
| L24 | This step is optional. | 4 | Pass |
| L25 | What matched or differed? | 4 | Pass |
| L26 | Leave blank while unresolved | 4 | Pass |
| L27 | What supports or contradicts the leading candidate? | 7 | Pass |
| L28 | What would resolve it? | 4 | Pass |
| L29 | CSV opens in a spreadsheet. | 5 | Explains format |
| L30 | Markdown is a shareable text card. | 6 | Explains format |
| L31 | Your visual and audio notes will appear here. | 8 | Pass |
| L32 | A complete card does not confirm the species. | 8 | Listed claim |
| L33 | It records what you observed and what still needs checking. | 10 | Listed claim |
| L34 | A private evidence card for uncertain bird sightings. | 8 | Pass |
| L35 | Field-console artwork generated for this product. | 6 | Jargon; F-4-2; claim itself is listed |

Reachable state copy was also checked. No state sentence exceeds 22 words. The flagged state strings are `Offline field mode`, `Saved locally`, `Filed locally`, `saved in your archive`, `JSON backup`, `local archive`, `matching IDs`, and `fresh field console`; all are covered by F-4-2. Error sentences otherwise state what happened and the next action.

### README sentences

| # | Exact copy | Words | Result |
| --- | --- | ---: | --- |
| R1 | Record bird evidence before you log an uncertain sighting. | 9 | Listed claim |
| R2 | For birders checking an app suggestion against what they saw and heard. | 12 | Pass |
| R3 | It records notes and does not identify birds. | 8 | Listed claim |
| R4 | Try the sample bird sighting at bird-id-evidence-card.sociobot.in/demo. | 7 | Pass |
| R5 | Keeps observed notes separate from candidate suggestions. | 7 | Listed claim |
| R6 | Records locality, visual notes, call notes, candidates, and an unresolved decision. | 11 | Listed claim |
| R7 | Export one card as CSV or Markdown, and saved cards as a JSON backup. | 14 | Listed claim; formats explained below |
| R8 | CSV opens in a spreadsheet. | 5 | Explains format |
| R9 | Markdown is shareable text. | 4 | Explains format |
| R10 | A backup moves all cards to another browser. | 8 | Listed claim |
| R11 | Works offline after the first visit. | 6 | Listed claim |
| R12 | Stays on this device. | 5 | Listed claim |
| R13 | Stores reference links as text and does not fetch them. | 10 | Listed claim |
| R14 | New cards start with locality-only exports. | 6 | Listed claim |
| R15 | Coordinates export only after you choose Precise and enter two valid values. | 12 | Listed claim |
| R16 | Review sensitive wildlife locations before sharing an export. | 8 | Pass |
| R17 | Open the local address shown after the development server starts. | 9 | Pass |
| R18 | Open `/demo` to use sample data that stays separate from your cards. | 12 | Listed claim |
| R19 | Automated product checks and their commands are listed in `.factory/claims.json`. | 10 | Developer documentation |
| R20 | Use evidence cards as notes, not verdicts. | 7 | Pass |
| R21 | See Privacy and Terms. | 4 | Pass |

README headings are `Bird ID Evidence Card` (4), `Record and export evidence cards` (5), `Run locally` (2), `Test and build` (3), `Privacy and limits` (3), and `Research, design, demo, and licence files` (7). They make sense in context. README links resolve.

Landing headings are `Record bird evidence before you log`, `Your current evidence card`, `When and where`, `What you saw`, `What you heard`, `Candidate species`, `Reference recordings`, and `Choose the identification status`. They pass. The state-dialog heading `Confirm action` fails the standalone-heading rule under F-4-2.

Actions checked: `Try it with sample data`, `Edit evidence card`, `Try sample data`, `View saved cards`, `Read the evidence guide`, `Add candidate`, `Add reference`, `Save evidence card`, `Export Markdown`, `Export CSV`, `Start a new card`, `Export backup`, `Import backup`, `Open card`, `Delete`, `Keep card`, `Delete card`, `Reset demo`, and `Start a blank card`. These name their result. The update-state `Reload` action should become `Load update` as part of F-4-2.

## Demo and sandbox verification

The demo passes.

- One click on `Try it with sample data` opens `/?demo=1`; `/demo` also opens it directly.
- The first 390 px screen already shows `COMPLETE · 5/5`, Northern Fulmar, Deerness coast, 65% tentative confidence, and all six completed evidence sections.
- The persistent banner says `Demo — sample data, nothing is saved.` and includes `Reset demo` and `Start a blank card`.
- Reset restored `Deerness coast, Orkney` after an edit.
- A real card named `LIVE REAL STORAGE SENTINEL` was saved first. Demo edit, save, reset, and exit left the `bird-id-evidence-card` database byte-for-byte unchanged. Demo content used only `demo:bird-id-evidence-card` and was cleared on exit.
- After service-worker control, `/demo` reloaded and remained editable with network access disabled. Requests during the demo were same-origin only; no cookies or localStorage keys were created.

## Claims verification

A clean clone was created at `/tmp/bird-review4-clean.ABUpUp`, followed by `npm ci`. Every exact command in `.factory/claims.json` ran independently; no pre-existing `dist/` was required.

| Claim id | Exact command result |
| --- | --- |
| `record-evidence-card` | PASS |
| `separate-observation-and-suggestion` | PASS |
| `no-automatic-identification` | PASS |
| `offline-demo` | PASS |
| `device-only` | PASS |
| `free` | PASS |
| `no-account` | PASS |
| `demo-isolation` | PASS |
| `exports` | PASS |
| `private-coordinates` | PASS |
| `no-audio-fetch` | PASS |
| `delete-card` | PASS |
| `stored-card-schema` | PASS |
| `no-tracking-or-remote-assets` | PASS |
| `generated-artwork` | PASS |

Cross-checking the live landing, demo, guide, Privacy, Terms, footer, offline fallback, and README found no unlisted claim. The offline fallback's availability sentence is within `offline-demo`; artwork, storage, price, account, coordinate, export, reference-link, and non-identification statements map to their named entries.

The complete clean-clone `npm test` also passed: 9 unit tests, production build verification, 43 browser tests across phone and desktop, and the one intended desktop skip of the phone-only viewport check. The build reported 10,624 bytes gzip JavaScript, 5,743 bytes gzip CSS, and a 14,501-byte mobile hero. `dist/index.html` was produced.

## Structure, accessibility, links, and visual identity

The primary routes pass: `/`, `/demo`, `/records`, `/guide`, `/privacy/`, and `/terms/` return 200; an unknown URL returns the designed field-console 404 with HTTP 404. Each has the expected route title, one route-specific h1 in raw and rendered HTML, description, canonical, OG/Twitter metadata, SVG favicon, apple-touch icon, shared header/footer, Privacy/Terms links, and build `v1.0.3`. The social image is 1200 × 630.

History navigation focuses the destination h1, Back restores the prior route and h1 focus, and the skip link focuses `main`. The internal-link crawl found no dead destination or missing fragment. Axe returned zero violations on the six primary routes, mobile layouts had no horizontal overflow, and tested controls were at least 44 px. The root URL verifier passed. `/offline.html` is the exception described in F-4-1.

The paper/enamel palette, calibration rail, receiver artwork, condensed labels, serif notes, and mechanical controls match `.factory/design.md` and remain recognisably specific to bird-evidence review. The site is not a generic SaaS template. Reduced-motion rules and dark color treatment are present and covered by the browser suite.

## Earlier-finding verification

| Earlier finding | Round-4 result |
| --- | --- |
| Review 1 B1 — unclear first screen | Fixed on live mobile and desktop. |
| Review 1 B2 — no isolated demo | Fixed; sample, banner, reset, exit, offline behavior, and sentinel isolation pass. |
| Review 1 B3 — missing claims | Fixed; all 15 exact commands pass and no unlisted claim remains. |
| Review 1 B4 — fake routes/404 | Fixed for the named routes; direct loads, history, focus, and true 404 pass. |
| Review 1 H5 — incomplete metadata/chrome | Fixed for app, legal, and 404 pages; the omitted offline fallback is F-4-1. |
| Review 1 M6 — jargon/inconsistent terms | **Half-fixed and reopened by F-4-2.** |
| Review 1 M7 — unclear headings/actions | Main route headings/actions are fixed; generic `Confirm action` remains under F-4-2. |
| Review 2 B1 — claim commands fail clean | Fixed; 15/15 pass independently in a clean clone. |
| Review 2 B2 — route destination off-screen | Fixed; route h1 is visible, focused, and at the top. |
| Review 2 H3 — missing claim entries | Fixed; live/README claim cross-check passes. |
| Review 2 H4 — weak demo isolation | Fixed; seeded real database remains byte-for-byte unchanged. |
| Review 2 M5 — generic deep-link metadata | Fixed for indexed product routes; offline fallback omission is F-4-1. |
| Review 2 M6 — undersized targets | Fixed on previously tested routes; **reopened for the 17 px offline recovery link by F-4-1.** |
| Review 2 M7 — inconsistent chrome/landmarks | Fixed on previously tested routes; **reopened for the shell-less offline fallback by F-4-1.** |
| Review 2 M8 — missing CSP | CSP is present; **its violation on the offline fallback reopens the effective failure under F-4-1.** |
| Review 2 M9 — unrealistic sample reference | Fixed; the demo uses a Northern Fulmar xeno-canto catalogue reference as inert text. |
| Review 3 F-3-1 — four h1 elements | Fixed; route responses and rendered views each have one route-specific h1. |
| Review 3 F-3-2 — claims exceed registry | Fixed; narrowed copy and 15 passing claims cover current statements. |
| Review 3 F-3-3 — inconsistent shell | Fixed on app/legal/404; **half-fixed overall because `/offline.html` lacks it (F-4-1).** |
| Review 3 F-3-4 — unexplained export formats | Fixed next to the actions and in README. |

## Missed leverage

No missing feature is recorded. The brief requires private evidence capture and Markdown/CSV export; the product provides those plus JSON backup/import. Sync would conflict with the local-only promise unless deliberately designed as a separate feature. Automatic AI identification would weaken the stated observation-before-suggestion boundary, so an AI gateway feature is not an obvious user expectation here. No decorative AI control or embedded provider key was found.

## What would make this perfect

Make `/offline.html` a fully styled, CSP-compliant member of the shared product shell and add it to route/offline regression coverage. Then remove the remaining state-copy jargon and use specific dialog/update wording everywhere. Re-run the complete copy extraction, all 15 claim commands, the full browser suite, and the cold live route audit. With those two findings closed and no replacement findings, the review can pass.
