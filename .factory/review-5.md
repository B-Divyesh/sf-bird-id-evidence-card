# Adversarial first-read review 5 — Bird ID Evidence Card

## Verdict: FAIL

Reviewed 2026-08-28 against <https://bird-id-evidence-card.sociobot.in/> and repository commit `b7d75440d7928d37891a54d0f6a82c4dcbfd43b0`. Fresh Chromium contexts used 390 × 844 and 1440 × 900 viewports. No product code was changed.

The first screen, demo, privacy boundary, offline behavior, routing, metadata, accessibility checks, and every registered claim test pass. The review still fails because two reachable quantitative promises have no claim entries or tagged tests, two core readiness labels use inconsistent language, the landing route omits two required sections, and the README does not say how to deploy the built site. This round permits no findings or untested claim.

## First screen, before scrolling

Both cold contexts loaded `/` at scroll position 0 without a console or page error.

- **What it does:** records the evidence behind an uncertain bird sighting before the visitor logs it.
- **Who it is for:** birders checking an app suggestion against what they saw and heard.
- **What to click first:** `Try it with sample data`; the adjacent text says `See a completed uncertain-sighting card.`

The exact supporting copy is `Record bird evidence before you log.` and `For birders checking an app suggestion against what they saw and heard.` The action, its result, and the three facts `Works offline after first visit`, `Stays on this device`, and `Free` all fit in the first 390 × 844 viewport. This check passes.

Evidence: [cold mobile screenshot](artifacts/review-5/cold-mobile.png), [cold desktop screenshot](artifacts/review-5/cold-desktop.png), and their adjacent JSON snapshots.

## Findings, ordered by severity

### BLOCKING F-5-1 — two quantitative live claims are absent from the claims registry

**Exact quotes and locations:** `A card can hold up to 12 candidates.` at `src/main.ts:400`, shown after the visitor tries to add a thirteenth candidate; `A card can hold up to 20 reference links.` at `src/main.ts:418`, shown after the visitor tries to add a twenty-first reference.

**Observed result:** the live demo stopped at exactly 12 candidate editors and 20 reference editors and showed the quoted messages. Neither sentence appears in `.factory/claims.json`, and no `@claim:` test asserts either quantitative limit. All 15 listed claims pass, but these two live claims remain untested. This reopens the claim-completeness substance of review 1 blocking 3, review 2 high 3, and review 3 F-3-2.

**Why this can mislead:** a visitor can rely on these limits when planning a comparison. The claims contract requires every quantitative promise to be registered and asserted with its stated number; working once in a manual check is not regression proof.

**Concrete fix:** add a `card-entry-limits` claim such as `One card stores up to 12 candidates and 20 reference links`, with one demo-sandbox test that adds entries to each limit, attempts one more, verifies the messages, saves/reloads, and confirms exactly 12 and 20 persisted. Alternatively, remove the quantitative sentences and expose a disabled control with non-claiming recovery copy.

### BLOCKING F-5-2 — the core readiness list still changes terms for the visitor's notes

**Exact quote and location:** the live evidence-card preview uses `Visual account` and `Audio account`; the editor and README call the same material `Visual traits`, `Call or song notes`, `visual notes`, and `call notes`. The source is `src/model.ts:101-102`.

**Why this loses a first-time visitor:** `account` can mean a login and is not the term used by the controls the visitor must complete. The readiness list is supposed to tell the visitor what is missing, but it forces a terminology translation. This leaves the broad consistency work from review 1 medium 6 and review 4 F-4-2 only partially closed, so the history rule makes it blocking again.

**Concrete fix:** use `Visual notes` and `Call notes` in the readiness list, matching the README and nearby inputs. Add these generated readiness labels to the copy-audit test so the audit covers model-derived UI strings as well as HTML and state messages.

### MEDIUM F-5-3 — the landing route does not contain the required explanation and limits sections

**Exact location:** `/` moves from the first screen directly into `Your current evidence card`, then ends with the footer. `How it works` is only a link to `/guide`; `What this tool does not do` and `Your data, on your device` exist only on that separate route.

**Why this loses a first-time visitor:** the site-structure contract requires the landing sequence to include the live product, a three-step explanation, and a plain statement of limits/privacy before the footer. A visitor reviewing the landing page must either understand the full form unaided or discover a separate guide link.

**Concrete fix:** after the live product/preview on `/`, add a concise three-step `How it works` section and a `What this tool does not do` / privacy section. Reuse the current guide facts, keep each sentence within 22 words, and retain the separate guide route for detail.

### MINOR F-5-4 — README does not document deployment

**Exact location:** `README.md` has `Run locally` and `Test and build`, but no deployment section or statement that `dist/` is the deployable static root.

**Why this matters:** the repository contract requires the README to explain how to deploy. A maintainer can produce a build but is not told what artifact to publish or which SPA/404 configuration must accompany it.

**Concrete fix:** add `## Deploy` with a short instruction to run `npm run build` and publish `dist/` as the static site root. State that `staticwebapp.config.json`, the service worker, route documents, and 404 are included in `dist/`, and that factory infrastructure handles the actual deployment.

## Copy audit

Counts treat hyphenated terms as one word. No landing or README sentence exceeds 22 words, and no banned marketing adjective appears. `CSV` and `Markdown` are explained beside their actions. Flags below are the inconsistent readiness terms and the two unlisted quantitative claims already recorded as findings.

### Landing page sentences and sentence-like text

| # | Exact copy | Words | Result |
| --- | --- | ---: | --- |
| L1 | Record bird evidence before you log. | 6 | Pass |
| L2 | For birders checking an app suggestion against what they saw and heard. | 12 | Pass |
| L3 | See a completed uncertain-sighting card. | 5 | Pass |
| L4 | Works offline after first visit | 5 | Listed claim |
| L5 | Stays on this device | 4 | Listed claim |
| L6 | Free | 1 | Listed claim |
| L7 | Ready on this device | 4 | Pass |
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
| L29 | CSV opens in a spreadsheet. | 5 | Pass; explains format |
| L30 | Markdown is a shareable text card. | 6 | Pass; explains format |
| L31 | Your visual and audio notes will appear here. | 8 | Pass |
| L32 | A complete card does not confirm the species. | 8 | Listed claim |
| L33 | It records what you observed and what still needs checking. | 10 | Listed claim |
| L34 | A private evidence card for uncertain bird sightings. | 8 | Pass |
| L35 | Artwork generated for Bird ID Evidence Card. | 7 | Listed claim |

### Reachable landing/app state sentences

| Exact copy | Words | Result |
| --- | ---: | --- |
| No connection — your work still saves on this device. | 9 | Listed offline/storage behavior |
| Demo — sample data, nothing is saved. | 7 | Listed claim |
| Saving draft… | 2 | Pass |
| Saved on this device | 4 | Listed storage behavior |
| Save failed — export this card | 6 | Pass; names recovery |
| This browser could not save your changes. | 7 | Pass |
| Your current work remains on screen; export it before leaving. | 10 | Pass |
| A card can hold up to 12 candidates. | 8 | **Unlisted quantitative claim; F-5-1** |
| A card can hold up to 20 reference links. | 9 | **Unlisted quantitative claim; F-5-1** |
| Add the required date and locality, and check any reference URLs before saving. | 13 | Pass |
| Precise export is selected. | 4 | Pass |
| Add both coordinates or choose a safer location detail. | 9 | Pass |
| Complete evidence card saved on this device. | 7 | Listed recording/storage behavior |
| Draft card saved. | 3 | Listed recording/storage behavior |
| The readiness list shows what is still missing. | 8 | Pass |
| Saved as verified. | 3 | Pass |
| Consider adding an independent reference or reasoning note. | 8 | Pass |
| The card could not be saved in this browser. | 9 | Pass |
| Export Markdown now to keep a copy. | 7 | Pass; names recovery |
| Start a new evidence card? | 5 | Pass |
| [Card title] stays under Saved evidence cards. | 6 plus title | Pass |
| [Card title] has not been saved and will be cleared. | 9 plus title | Pass |
| New evidence card ready. | 4 | Pass |
| Delete this evidence card? | 4 | Pass |
| [Card number and title] will be removed from this browser. | 7 plus values | Pass |
| Restore it only from an exported backup. | 7 | Pass |
| Evidence card deleted from this device. | 7 | Listed delete/storage behavior |
| The card could not be deleted. | 6 | Pass |
| Try again. | 2 | Pass |
| [Count] card(s) exported in the backup. | 6 | Listed export behavior |
| Could not read your saved evidence cards for backup. | 9 | Pass |
| Imported [count] card(s). | 3 | Listed export/import behavior |
| Existing copies of those cards were replaced. | 7 | Listed export/import behavior |
| That file is not a valid Bird ID Evidence Card backup. | 11 | Pass |
| No data was changed. | 5 | Pass |
| Back online. | 2 | Pass |
| Your cards remained available. | 4 | Listed offline behavior |
| An update is ready. | 4 | Pass |
| Sample evidence card reset. | 4 | Listed demo behavior |

The readiness labels `Visual account` and `Audio account` are not sentences, but they fail terminology consistency under F-5-2. Other headings make sense in isolation: `Record bird evidence before you log`, `Your current evidence card`, `When and where`, `What you saw`, `What you heard`, `Candidate species`, `Reference recordings`, `Choose the identification status`, `Evidence card preview`, `Saved evidence cards`, and `Check an uncertain bird in four steps`.

All checked actions use a result-naming verb: `Edit evidence card`, `Try sample data`, `View saved cards`, `Read the evidence guide`, `Try it with sample data`, `Add candidate`, `Add reference`, `Save evidence card`, `Export Markdown`, `Export CSV`, `Start a new card`, `Reset demo`, `Start a blank card`, `Export backup`, `Import backup`, `Open card`, `Delete`, `Keep card`, `Delete card`, and `Load update`.

### README sentences

| # | Exact copy | Words | Result |
| --- | --- | ---: | --- |
| R1 | Record bird evidence before you log an uncertain sighting. | 9 | Listed claim |
| R2 | For birders checking an app suggestion against what they saw and heard. | 12 | Pass |
| R3 | It records notes and does not identify birds. | 8 | Listed claim |
| R4 | Try the sample bird sighting at bird-id-evidence-card.sociobot.in/demo. | 7 | Pass |
| R5 | Keeps observed notes separate from candidate suggestions. | 7 | Listed claim |
| R6 | Records locality, visual notes, call notes, candidates, and an unresolved decision. | 11 | Listed claim |
| R7 | Export one card as CSV or Markdown, and saved cards as a JSON backup. | 14 | Listed claim; formats explained next |
| R8 | CSV opens in a spreadsheet. | 5 | Pass; explains format |
| R9 | Markdown is shareable text. | 4 | Pass; explains format |
| R10 | A backup moves all cards to another browser. | 8 | Listed claim |
| R11 | Works offline after the first visit. | 6 | Listed claim |
| R12 | Stays on this device. | 5 | Listed claim |
| R13 | Stores reference links as text and does not fetch them. | 10 | Listed claim |
| R14 | New cards start with locality-only exports. | 6 | Listed claim |
| R15 | Coordinates export only after you choose Precise and enter two valid values. | 12 | Listed claim |
| R16 | Review sensitive wildlife locations before sharing an export. | 8 | Pass |
| R17 | Open the local address shown after the development server starts. | 9 | Pass |
| R18 | Open `/demo` to use sample data that stays separate from your cards. | 12 | Listed claim |
| R19 | Automated product checks and their commands are listed in `.factory/claims.json`. | 10 | Verified repository fact |
| R20 | Use evidence cards as notes, not verdicts. | 7 | Pass |
| R21 | See Privacy and Terms. | 4 | Pass |

README headings are `Bird ID Evidence Card` (4), `Record and export evidence cards` (5), `Run locally` (2), `Test and build` (3), `Privacy and limits` (3), and `Research, design, demo, and licence files` (7). They make sense in context. The missing deployment heading/content is F-5-4.

## Demo and sandbox verification

The demo itself passes.

- One click on `Try it with sample data` opened `/?demo=1` at scroll position 0.
- The first phone screen showed `Complete · 5/5`, Northern Fulmar, Deerness coast, the leading candidate, 65% tentative confidence, and all six completed sections.
- The persistent banner said `Demo — sample data, nothing is saved.` and exposed `Reset demo` and `Start a blank card`.
- Reset restored `Deerness coast, Orkney` after an edit.
- A real card named `REVIEW 5 REAL SENTINEL` was saved first. Demo edit/save/reset/exit left the real `bird-id-evidence-card` database byte-for-byte unchanged and cleared the demo sample from `demo:bird-id-evidence-card`.
- All demo requests were same-origin. No cookies or localStorage keys were created.
- A fresh first visit to `/demo` installed the service worker; the next reload worked with the network disabled, retained the sample, accepted an edit, and showed the no-connection banner.

Evidence: [demo screenshot](artifacts/review-5/demo-first-mobile.png) and [live demo result](artifacts/review-5/live-demo.json).

## Claims verification

A clean clone was created at `/tmp/bird-review5-clean`, followed by `npm ci`. Every exact command in `.factory/claims.json` ran independently with no pre-existing build.

| Claim id | Result |
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

No listed test failed. F-5-1 records the two unlisted, therefore untested, claims found in reachable live copy.

## Structure, accessibility, links, and visual identity

The route implementation passes apart from F-5-3.

- `/`, `/demo`, `/records`, `/guide`, `/privacy/`, `/terms/`, and `/offline.html` returned 200. A cold unknown URL returned the designed 404 with HTTP 404.
- Every raw and rendered route had the expected route-specific title, one h1, a description, canonical URL, OG/Twitter metadata, SVG favicon, apple-touch icon, shared header/footer, Privacy/Terms links, and build `v1.0.4`.
- The social image is 1200 × 630. The sitemap, robots file, manifests, icons, CSP, referrer policy, and `nosniff` header resolve.
- The internal-link crawl found no dead destination or missing fragment. The intentional current-page fragment on the 404 document remained within its expected 404 response.
- Browser Back/Forward and route links focused the destination h1. The skip link focused `main`.
- Axe found zero violations on the seven 200 routes. The 390 px routes had no horizontal overflow and checked controls met 44 × 44 px.
- The installed app reopened demo and legal routes offline. An uncached route used the designed offline fallback without a CSP or console error.
- The production build contains 10,651 bytes gzip JavaScript, 5,741 bytes gzip CSS, and a 14,501-byte mobile hero asset.
- The paper/enamel palette, field receiver artwork, calibration rail, ruled evidence card, and mechanical controls are recognisably product-specific rather than a generic SaaS template.

Evidence: [live structure audit](artifacts/review-5/live-structure/live-audit.json).

## Earlier-finding verification

Each earlier review and each polish/handoff file was read. The table records fresh live and source confirmation, not the earlier closure labels.

| Earlier finding | Round-5 result |
| --- | --- |
| Review 1 B1 — unclear first screen | Fixed; cold phone and desktop checks answer job, audience, and first action. |
| Review 1 B2 — no isolated demo | Fixed; sample, banner, reset, exit, offline behavior, and real-data sentinel pass. |
| Review 1 B3 — missing/unlisted claims | **Reopened by F-5-1** for the 12-candidate and 20-reference promises. |
| Review 1 B4 — fake routes and 200 fallback | Fixed; direct routes, history, focus, and true 404 pass. |
| Review 1 H5 — metadata and common chrome | Fixed across app, legal, 404, and offline documents. |
| Review 1 M6 — jargon and inconsistent terms | **Reopened by F-5-2** for `Visual account` / `Audio account`. |
| Review 1 M7 — unclear headings and navigation | Fixed; semantic headings and result-naming route links pass. |
| Review 2 B1 — claim commands fail clean | Fixed; all 15 exact commands pass independently in the clean clone. |
| Review 2 B2 — route destination off-screen | Fixed; destination h1 is visible and focused; Back/Forward restores it. |
| Review 2 H3 — missing claim entries | **Reopened by F-5-1.** |
| Review 2 H4 — weak demo-isolation test | Fixed; automated and live sentinel comparisons are byte-for-byte. |
| Review 2 M5 — generic deep-link metadata | Fixed; route-specific metadata and social art pass. |
| Review 2 M6 — undersized targets | Fixed on every checked route, including demo, legal, 404, and offline. |
| Review 2 M7 — inconsistent chrome/landmarks | Fixed; shared chrome and zero axe violations pass. |
| Review 2 M8 — missing CSP | Fixed; strict live CSP is present and has no observed violation. |
| Review 2 M9 — unrealistic sample reference | Fixed; the inert xeno-canto catalogue reference has licence and comparison notes. |
| Review 3 F-3-1 — four raw h1 elements | Fixed; every raw and rendered route has one route-specific h1. |
| Review 3 F-3-2 — claims exceed proof | **Reopened by F-5-1.** |
| Review 3 F-3-3 — inconsistent shell | Fixed across app, legal, 404, and offline pages. |
| Review 3 F-3-4 — unexplained export formats | Fixed beside the actions and in README. |
| Review 4 F-4-1 — broken offline fallback | Fixed; actual uncached offline fallback is styled, accessible, and CSP-clean. |
| Review 4 F-4-2 — jargon and vague state copy | The quoted round-4 strings are gone, but **terminology coverage remains partial under F-5-2**. |

## Missed leverage

No missing product feature is recorded. The brief asks for private evidence capture and Markdown/CSV export; the product also provides JSON backup/import. Sync would conflict with the current local-only promise unless introduced as a separate, explicit design. Automatic identification would undermine the observation-before-suggestion boundary, so an AI step through the Sociobot gateway is not an obvious fit. No decorative AI control, provider call, or embedded provider key was found.

## Verification record

- Cold live captures: 390 × 844 and 1440 × 900, no console errors.
- Clean clone: `/tmp/bird-review5-clean` at `b7d75440d7928d37891a54d0f6a82c4dcbfd43b0`; `npm ci` passed with zero vulnerabilities.
- Claim registry: 15/15 exact commands passed independently.
- `npm test`: PASS; 10 unit tests, production build verification, 45 browser tests, and one intentional desktop skip.
- `npm run test:live -- https://bird-id-evidence-card.sociobot.in .factory/artifacts/review-5/live-structure`: PASS.
- Live demo isolation/network/offline script: PASS.
- Live internal-link and required-static-file crawl: PASS.

## What would make this perfect

Register and test the two quantitative entry limits, replace `Visual account` and `Audio account` with the established note terms, add the required how-it-works and limits/privacy sections to the landing route, and document deployment in README. Then rerun the copy extraction, every exact claim command, the full local suite, and the cold live audit. With those changes and no replacement findings, the review can pass.
