# Adversarial first-read review 1 — Bird ID Evidence Card

**Verdict: FAIL**

Review date: 2026-08-28. Tested the deployed site in new Chromium contexts at 390 × 844 and 1280 × 900 before scrolling, then exercised the published routes and repository from a clean clone. This is a first-read review, not a product-code change.

## First screen result

My first-read interpretation was: this is a private form for recording why a bird-app suggestion may or may not be right. It appears intended for a person deciding whether to log a bird. I could not identify a first action: the selected navigation item is `Workbench`, but there is no action in the first phone screen and no indication that the form is below the illustration.

This fails the required three answers from one screen. The exact first-screen copy is `KEEP THE EVIDENCE. THEN DECIDE.` and `Separate what you observed from what an app suggested. Build a private, portable reasoning trail before you log a bird.` It never names *birders* and contains no primary action, sample path, or explanation of what happens next.

## Findings, ordered by severity

### BLOCKING 1 — The first screen does not state the job in plain words or give a first action

**Quote:** `KEEP THE EVIDENCE. THEN DECIDE.`; `Separate what you observed from what an app suggested.`; the three visible navigation controls are `Workbench`, `Saved cards`, and `Field guide`.

**Why this loses a first-time visitor:** “Evidence” and “decide” do not say whether the site identifies birds, records sightings, compares a suggestion, or submits a report. The phone screen has no result-naming action at all. A visitor has to infer that the active `Workbench` might lead to a form below the fold.

**Concrete fix:** replace the headline with `Record bird evidence before you log.` Replace the supporting sentence with `For birders checking an app suggestion against what they saw and heard.` Put a visible primary button beside it: `Try it with sample data`, followed by `See a completed uncertain-sighting card.` Keep three plain facts: `Works offline after first visit`, `Stays on this device`, and `Free`.

**Test to add:** a 390 px first-viewport Playwright check that asserts the headline, audience sentence, `Try it with sample data` button, and its adjacent outcome text are visible without scrolling.

### BLOCKING 2 — There is no one-click, isolated sample demo

**Quote/evidence:** no page control has the text `Try it with sample data`. Directly opening both `/demo` and `/?demo=1` returned the ordinary empty application: title `Bird ID Evidence Card — compare before you log`, h1 `Keep the evidence.Then decide.`, and initial readout `DRAFT · 0/5`. Neither view contained `Demo`, `sample data`, `Reset demo`, or `Start for real`.

**Why this loses or misleads a first-time visitor:** the visitor must enter personal observation data before seeing a useful evidence card. There is no way to verify the workflow, exports, offline behavior, or privacy boundary without using real browser storage.

**Concrete fix:** make `/demo` (or `?demo=1`) seed a realistic uncertain sighting, for example a Deerness coast observation with visual notes, a competing Fulmar candidate, a contradiction, and an unresolved decision. The first demo screen must already show that completed card. Keep a persistent `Demo — sample data, nothing is saved` banner with `Reset demo` and `Start for real`. Use a separate `demo:` IndexedDB database/key namespace; leaving demo must discard it without reading or writing the real database. Document the URL, records, reset behavior, and namespace in `.factory/demo.md`.

**Tests to add:** enter `/demo` from a fresh context; assert populated records and the banner; edit/reset; assert the demo namespace changes while the real namespace is untouched; reload offline after the first demo load.

### BLOCKING 3 — Claims are unlisted and therefore have no required sandbox proof

**Quote/evidence:** `.factory/claims.json` is absent. A repository search found no `@claim:` test tag and no demo/sample implementation. There were therefore zero listed claim commands to run from the clean clone, rather than the required claim registry and one observable sandbox test per claim.

Every following visitor-relevant sentence is an **unlisted claim** because no claims entry exists:

- Landing: `Works offline`; `Stays on device`; `Exports cleanly`; `Privacy shutter on.`; `Coordinates are excluded.`; `This app stores the link and your notes; it never copies or hosts the audio.`; `Cards are stored in this browser’s IndexedDB.`; `Field-console artwork generated for this product with the factory image model.`
- README introduction: `An offline-first evidence notebook for birders who have a tentative app result but want to compare it with what they actually saw and heard before logging.`; `It creates a portable reasoning trail without performing identification itself.`
- README capabilities: `Records date, privacy-controlled locality, habitat, conditions, visual traits, and call notes.`; `Keeps candidate species and their source separate from observed facts.`; `Gives each candidate a user-owned confidence score plus fits/contradictions.`; `Stores links to user-selected open or owned reference recordings without fetching or copying audio.`; `Preserves an unresolved, likely, or independently verified review state.`; `Autosaves drafts and saved cards in browser IndexedDB.`; `Exports one card as Markdown or CSV, and the archive as an importable JSON backup.`; `Installs as a PWA and continues to load, edit, and save offline.`
- README privacy/limits: `Location detail defaults to Private / locality only.`; `Coordinates are only included after selecting Precise and entering both values.`; `It is not species-ID AI, a call library, a citizen-science database, or a verifier.`; `It has no integration or affiliation with BirdNET, Merlin, or eBird.`; `Browser data is local to that origin.`; `There are no accounts, analytics, ads, third-party scripts, remote fonts, or application APIs.`; `Drafts and cards remain in IndexedDB until the user deletes them or clears site storage.`; `JSON export is the migration/backup path.`
- README test/build assertions: ``npm test` runs unit tests, creates the production build, then runs Playwright on mobile and desktop Chromium, including axe and offline service-worker checks.`; `The exact deployment command is npm run build; it creates dist/ with dist/index.html at its root.`

**Why this loses or misleads a first-time visitor:** privacy, local storage, exports, installation, and offline operation are promises a birder may rely on in the field. They are currently not tied to a clean, repeatable, sample-data test, so a verifier cannot establish that the public promise and the product behavior agree.

**Concrete fix:** add `.factory/claims.json` and one `@claim:<id>` test per sentence or remove the claim. At minimum register and test: offline reload after first visit, same-origin-only traffic throughout a demo flow, `demo:` storage isolation, CSV/Markdown/JSON exports with demo data, coordinate omission at private precision, and no audio fetching. The privacy test must intercept every request in the demo journey and assert same-origin only.

**Observed but insufficient evidence:** a fresh live browser context made requests only to `https://bird-id-evidence-card.sociobot.in`; after service-worker control, an offline reload showed `Offline field mode`. These checks do not cure the finding because they used the real empty workspace, not the required demo sandbox, and are not claim-tagged registry tests.

### BLOCKING 4 — Routing does not provide real app destinations and the 404 is the normal app

**Quote/evidence:** the header uses buttons and fragment URLs such as `#workbench`, `#guide`, and `#records`; source initialization only reads `location.hash`. `/demo` returns the normal root title and empty workbench rather than a demo. Requesting `/not-a-real-route` returned HTTP 200 with the same h1, `Keep the evidence.Then decide.`, rather than a designed not-found page. The app has no `/demo` entry in `sitemap.xml`.

**Why this loses or misleads a first-time visitor:** a copied URL cannot name or restore a particular product place. A non-existent URL silently looks like a valid empty workbench, which makes a bad link indistinguishable from a successful visit. Fragment-only application views also do not meet the required history/focus behavior for meaningful views.

**Concrete fix:** add real `/demo`, `/records`, and `/guide` (or a product-appropriate `/log`) routes using History API navigation. On each route change, set a route-specific title, focus/announce the new h1, and make back/forward restore the correct state. Add a styled 404 route that returns 404 and links back to `/`. Include public routes in the sitemap.

**Tests to add:** direct navigation and reload for every route; back/forward focus assertions; `/not-a-real-route` status 404 plus the designed h1 and home link; `/demo` title `Demo — Bird ID Evidence Card`.

### HIGH 5 — Required metadata and common chrome are incomplete

**Quote/evidence:** the root page title, `Bird ID Evidence Card — compare before you log`, and one h1, plus a description and PNG icon, are present. However root, Privacy, and Terms have no canonical URL, Open Graph tags, Twitter card, SVG favicon, or apple-touch icon. Privacy and Terms also omit a meta description and render only a back-link header, not the consistent product header/footer. The root footer omits the required `Built by Param Factory` and version/build id.

**Why this loses or misleads a first-time visitor:** shared links have no product artwork or trustworthy summary, and a legal page looks like a detached document rather than part of the same product. Missing chrome makes it harder to return safely or verify what site is handling stored data.

**Concrete fix:** add canonical, description, OG/Twitter title/description/image, SVG favicon, and 180 px apple-touch icon to every route. Use a real 1200 × 630 derivative of the field-console art. Put the same wordmark, nav, skip link, footer, Privacy, Terms, factory attribution, and build id on legal routes.

### MEDIUM 6 — Copy has one overlong sentence, internal jargon, and inconsistent record terms

**Quote:** README: `An offline-first evidence notebook for birders who have a tentative app result but want to compare it with what they actually saw and heard before logging.` (26 words). Other unexplained terms include `offline-first`, `PWA`, `IndexedDB`, `axe`, `service-worker`, `Chromium`, `reasoning trail`, `field console`, and `better-calibrated`. The same saved item is called an `evidence notebook`, `reasoning trail`, `card`, `field record`, `draft`, `archive`, and `backup`.

**Why this loses a first-time visitor:** the long README opening asks the reader to parse several purposes at once. The technical terms are useful for developers but not for a birder deciding whether to use the product. Multiple names make it unclear what is saved or exported.

**Concrete fix:** use `evidence card` for the saved item throughout. Rewrite the opening as `Compare an app suggestion with what you saw and heard.` Then: `For birders deciding whether to log an uncertain sighting.` Rewrite the footer as `A private evidence card for uncertain bird sightings.` Move implementation words such as IndexedDB, PWA, axe, and Chromium to a developer note with a plain-language explanation.

### MEDIUM 7 — Several headings and navigation controls do not stand alone

**Quote:** `Keep the evidence.Then decide.`, `Current observation`, `Observed fact`, `Method, not verdict`, `A two-minute evidence check`, `Workbench`, and `Field guide`.

**Why this loses a first-time visitor:** a headings list or a screen-reader rotor supplies these fragments without nearby context. `Workbench` and `Field guide` also name places rather than results; the first does not tell the visitor whether it starts, resumes, or edits an evidence card.

**Concrete fix:** use headings such as `Record an uncertain bird sighting`, `Your current evidence card`, and `Check an uncertain bird in four steps`. Make navigation links rather than buttons where they change location: `Edit evidence card`, `View saved cards`, and `Read the evidence guide`.

## Copy audit

Word counts treat hyphenated and possessive forms as one word. The landing table covers every rendered sentence or sentence-like heading/help message in the initial app, including hidden route content that becomes visible from its own navigation. Pure field labels, numeric values, and code commands are listed after the tables because they are not sentences. Flags: **H** = does not make sense alone, **J** = unexplained jargon, **T** = inconsistent term, **C** = unlisted claim, **O** = over 22 words, **B** = button/navigation wording needs a result-naming verb or a link.

### Landing page sentences and sentence-like copy

| # | Copy | Words | Flags |
| --- | --- | ---: | --- |
| L1 | Field console · No ID algorithm | 5 | H, J |
| L2 | Keep the evidence. Then decide. | 5 | H |
| L3 | Separate what you observed from what an app suggested. | 9 | C |
| L4 | Build a private, portable reasoning trail before you log a bird. | 11 | J, T |
| L5 | Works offline | 2 | C |
| L6 | Stays on device | 3 | C |
| L7 | Exports cleanly | 2 | C, H |
| L8 | Current observation | 2 | H |
| L9 | Evidence workbench | 2 | H |
| L10 | Observed fact | 2 | H |
| L11 | When and where | 3 | H |
| L12 | Name the broad place, not a nest site. | 8 | — |
| L13 | Locality only | 2 | — |
| L14 | ~10 km | 2 | — |
| L15 | Coordinates | 1 | — |
| L16 | Privacy shutter on. | 3 | J, C |
| L17 | Coordinates are excluded. | 3 | C |
| L18 | Avoid recording nest locations for sensitive species. | 7 | — |
| L19 | What you saw | 3 | — |
| L20 | Specific negatives help too: “no black wing tips visible.” | 9 | — |
| L21 | What you heard | 3 | — |
| L22 | This is still useful observed evidence. | 6 | — |
| L23 | Suggestion, not observation | 3 | — |
| L24 | Candidate species | 2 | — |
| L25 | Record who suggested it and why it does or does not fit. | 12 | — |
| L26 | Confidence is yours—not the app’s score. | 7 | — |
| L27 | Tentative | 1 | H |
| L28 | User-selected sources | 2 | — |
| L29 | Reference recordings | 2 | — |
| L30 | Link to material you have permission to use. | 8 | — |
| L31 | This app stores the link and your notes; it never copies or hosts the audio. | 15 | C |
| L32 | No references linked yet. | 4 | — |
| L33 | This step is optional. | 4 | — |
| L34 | Your conclusion | 2 | — |
| L35 | Decision | 1 | H |
| L36 | Keep comparing | 2 | — |
| L37 | Evidence leans one way | 4 | — |
| L38 | Independently supported | 2 | H |
| L39 | Live card readout | 3 | J |
| L40 | Unresolved bird | 2 | — |
| L41 | Your visual and audio notes will appear here. | 8 | — |
| L42 | A complete card is not a certain ID. | 8 | — |
| L43 | It means your uncertainty has a useful trail. | 8 | J, T |
| L44 | Device archive | 2 | J, T |
| L45 | Saved evidence cards | 3 | — |
| L46 | No filed cards yet | 4 | J, T |
| L47 | Your current draft is still safe. | 6 | C, T |
| L48 | Save it when you have enough evidence to revisit later. | 10 | — |
| L49 | Method, not verdict | 3 | H |
| L50 | A two-minute evidence check | 4 | C |
| L51 | Write from memory first | 4 | — |
| L52 | Record shape, movement, habitat, and sound before opening another guide. | 10 | — |
| L53 | This limits suggestion bias. | 4 | C, J |
| L54 | Name alternatives | 2 | — |
| L55 | Add at least two candidates when possible. | 7 | — |
| L56 | Note one fit and one contradiction for each. | 8 | — |
| L57 | Compare lawful references | 3 | J |
| L58 | Link to openly licensed recordings or material you own. | 9 | — |
| L59 | Confirm the caller was likely the bird you saw. | 9 | — |
| L60 | Log at the evidence level | 5 | J |
| L61 | “Unresolved” is a useful result. | 5 | — |
| L62 | Only use “verified” when independent evidence supports the identification. | 9 | — |
| L63 | What this tool does not do | 6 | — |
| L64 | It does not identify birds, download recordings, connect to BirdNET, Merlin, or eBird, or decide whether a record is reportable. | 20 | C |
| L65 | BirdNET, Merlin, and eBird are trademarks of their respective owners. | 10 | C |
| L66 | This independent tool does not imply affiliation. | 7 | C |
| L67 | Your data, on your device | 5 | C |
| L68 | Cards are stored in this browser’s IndexedDB. | 7 | J, C, T |
| L69 | Use Export backup before clearing browser storage or changing phones. | 10 | J, T |
| L70 | A small tool for better-calibrated field records. | 7 | J, T |
| L71 | Field-console artwork generated for this product with the factory image model. | 11 | J, C |

Non-sentence controls/labels inspected: `Workbench` (**B**), `Saved cards` (**B**), `Field guide` (**B**), `+ Add candidate`, `+ Add reference`, `Save evidence card`, `Export Markdown`, `Export CSV`, `Start a new card`, `Export backup`, `Import backup`, `Return to workbench` (**B**), `Cancel`, `Delete card`, and `Reload`. The export/save actions are result-naming verbs; the three location-changing header controls should be links with clearer destination labels. There is no `Try it with sample data` action.

### README sentences and headings

| # | Copy | Words | Flags |
| --- | --- | ---: | --- |
| R1 | Bird ID Evidence Card | 4 | — |
| R2 | An offline-first evidence notebook for birders who have a tentative app result but want to compare it with what they actually saw and heard before logging. | 26 | **O**, J, T, C |
| R3 | It creates a portable reasoning trail without performing identification itself. | 10 | J, T, C |
| R4 | Live: https://bird-id-evidence-card.sociobot.in | 5 | — |
| R5 | What it does | 3 | H |
| R6 | Records date, privacy-controlled locality, habitat, conditions, visual traits, and call notes. | 11 | C |
| R7 | Keeps candidate species and their source separate from observed facts. | 10 | C |
| R8 | Gives each candidate a user-owned confidence score plus fits/contradictions. | 10 | C |
| R9 | Stores links to user-selected open or owned reference recordings without fetching or copying audio. | 14 | C |
| R10 | Preserves an unresolved, likely, or independently verified review state. | 9 | C |
| R11 | Autosaves drafts and saved cards in browser IndexedDB. | 8 | J, C, T |
| R12 | Exports one card as Markdown or CSV, and the archive as an importable JSON backup. | 15 | J, C, T |
| R13 | Installs as a PWA and continues to load, edit, and save offline. | 12 | J, C |
| R14 | Location detail defaults to Private / locality only. | 7 | C |
| R15 | Coordinates are only included after selecting Precise and entering both values. | 11 | C |
| R16 | Do not store or share sensitive nest locations. | 8 | — |
| R17 | Intended users and limits | 4 | — |
| R18 | This is for birders reviewing uncertain sightings or sound suggestions. | 10 | C |
| R19 | It is not species-ID AI, a call library, a citizen-science database, or a verifier. | 14 | J, C |
| R20 | It has no integration or affiliation with BirdNET, Merlin, or eBird. | 11 | C |
| R21 | Users must follow source licences and the submission rules of any service they later use. | 15 | — |
| R22 | Run locally | 2 | — |
| R23 | Requires Node.js 22+ and npm. | 5 | J |
| R24 | Open the local URL printed by Vite. | 6 | J |
| R25 | Browser data is local to that origin. | 6 | J, C |
| R26 | Test and build | 3 | — |
| R27 | npm test runs unit tests, creates the production build, then runs Playwright on mobile and desktop Chromium, including axe and offline service-worker checks. | 23 | **O**, J, C |
| R28 | The exact deployment command is npm run build; it creates dist/ with dist/index.html at its root. | 17 | J, C |
| R29 | Useful individual commands | 3 | H |
| R30 | Data and privacy | 3 | — |
| R31 | There are no accounts, analytics, ads, third-party scripts, remote fonts, or application APIs. | 13 | J, C |
| R32 | Drafts and cards remain in IndexedDB until the user deletes them or clears site storage. | 15 | J, C, T |
| R33 | JSON export is the migration/backup path. | 7 | J, C, T |
| R34 | See /privacy and /terms. | 4 | — |
| R35 | Project notes | 2 | H |
| R36 | Product research contract: .factory/brief.json | 6 | J |
| R37 | Visual system and image provenance: .factory/design.md | 8 | J |
| R38 | Build verification and known gaps: .factory/handoff.md | 8 | J |
| R39 | Licence: MIT | 2 | J |

The README code blocks (`npm ci`, `npm run dev`, `npm test`, `npm run build`, `npm run test:unit`, `npm run test:e2e`, `npx tsc --noEmit`, `npm run preview`) are commands, not sentences. They were inspected for accuracy separately.

## Verification record

- Fresh browser contexts: root loaded with no console/page errors at both required viewports. The first 390 px screenshot was captured before scroll.
- Demo probe: `/demo` and `/?demo=1` both returned 200 but were the ordinary empty workbench, not a demo. No demo banner or reset/start-real controls were present.
- Clean clone: `git clone --no-local /work/repo /tmp/bird-review-Z7Pe7i`, `npm ci`, and `npm test` completed. The final Playwright result records `{"status":"passed","failedTests":[]}`. This is a general quality result, not claim verification: `.factory/claims.json` is absent, so there were no listed claim commands and no `@claim:` tests to run.
- Offline/privacy probe: after service-worker control in a fresh context, `context.setOffline(true)` plus reload displayed `Offline field mode`; all 12 observed requests in that normal flow were same-origin. This was not demo mode and did not establish sandbox isolation.
- Link crawl: the root’s actual hash links resolved on the root document; `/privacy/`, `/terms/`, `/robots.txt`, and `/sitemap.xml` returned 200. `/not-a-real-route` also returned 200 but incorrectly rendered the normal landing app.
- Structure confirmed: root has `lang="en"`, one h1, one main, descriptive root title, and meta description. The mid-century field-console art is product-specific rather than a generic SaaS template. These passes do not offset the blocking findings.

## Acceptance rule

`PASS` requires zero blocking findings and at most three minor findings. This review has four blocking findings, so the verdict is **FAIL**.
