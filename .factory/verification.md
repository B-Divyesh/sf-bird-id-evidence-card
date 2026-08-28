# Independent product verification

## Verdict: FAIL

Candidate `ac491c75725fb2cdb35c97c229a6aedfa59f4ff0` was tested from a clean checkout on 28 August 2026. The live deployment at <https://bird-id-evidence-card.sociobot.in> matches the candidate, and the core local-first workflow works. Release acceptance nevertheless fails because the shipped dark treatment contains an axe **serious** color-contrast violation (1.07:1 on three visible text nodes), contrary to the explicit 4.5:1 contract.

Two additional product defects were reproduced: deleting a card can cause a later card to reuse an existing card number, and several mobile navigation/legal targets are shorter than the required 44 CSS px.

## Scope and environment

- Work order: `bird-id-evidence-card-verify-1`
- Candidate: `ac491c75725fb2cdb35c97c229a6aedfa59f4ff0`
- Branch/remotes at start: clean `main`, `HEAD == origin/main == candidate`
- Deployment: <https://bird-id-evidence-card.sociobot.in>
- Node.js `v22.23.2`, npm `10.9.8`
- Playwright `1.58.2`, Chromium `145.0.7632.6`
- axe-core Playwright `4.10.2`, Lighthouse `13.0.1`
- Automated browser coverage: Chromium at 1280×900 and 390×844; light, dark, and reduced-motion preferences

No product code was changed during verification.

## Defects

### High — dark theme has unreadable text and an axe serious violation

With `prefers-color-scheme: dark`, axe reports `color-contrast` as serious on:

- `#preview-status`: foreground `#151c19` on `#0d1411`, 1.07:1 (10 px bold; requires 4.5:1)
- `#preview-privacy`: foreground `#151c19` on `#0d1411`, 1.07:1 (10 px bold; requires 4.5:1)
- `.site-footer > div > strong`: foreground `#151c19` on `#0d1411`, 1.07:1 (17 px bold; requires 4.5:1)

The text is visibly almost black on black. The dark rule sets these containers to `color: var(--paper)`, but dark-mode `--paper` is itself `#151c19`. This violates the acceptance contract's contrast requirement and its requirement that both themes be checked. The repository Playwright scan passes only because it runs the default light theme.

Reproduction: open `/` with dark color preference and run axe, or inspect the card/footer in dark mode.

### Medium — deleting a card permits duplicate card numbers

Reproduction:

1. Save two cards on the same observation day; they receive suffixes `001` and `002`.
2. Delete the first card.
3. Start and save a third card for the same day.

Observed archive numbers: `BID-20260828-002`, `BID-20260828-002`. New numbering uses `cards.length + 1`, so deletion reuses a suffix. This weakens the evidence trail and can also produce colliding export filenames.

### Low — some 390 px touch targets are below 44 px high

Measured rendered target boxes at 390×844:

- Header wordmark: 40 px high
- Footer `Privacy`, `Terms`, and `How it works` links: 19.6 px high

Segmented and decision controls use larger labels (46–63 px) and pass; their visually hidden radio inputs are not counted separately. The undersized links do not meet the attached 44×44 px target requirement.

### Low — one moderate axe landmark finding

Both themes report `landmark-complementary-is-top-level`: `.card-readout` is an `aside` landmark nested inside the workbench `section`. There are no light-theme serious/critical findings.

### Low — deployment caching and manifest MIME do not meet the preferred production policy

- Hashed JavaScript and CSS are served with `Cache-Control: public, must-revalidate, max-age=30`, rather than long-lived immutable caching.
- `manifest.webmanifest` is served as `application/octet-stream`, rather than `application/manifest+json` or JSON.

Chromium still parsed the manifest with zero manifest errors, install metadata and icons were valid, and Lighthouse's cache insight passed. These are production-policy/compatibility defects, not observed blockers in Chromium.

### Low — invalid backup recovery writes an expected exception to the console

Importing a malformed JSON/shape is rejected without changing the archive and shows a useful recovery toast, but the caught `No cards array` exception is also emitted with `console.error`. Initial load, normal workflows, offline use, and valid import have zero console or page errors.

## Repository gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 70 packages installed; audit reported 0 vulnerabilities |
| `npm test` | PASS — 5 Vitest tests, production build, and 8 Playwright tests across mobile/desktop Chromium |
| `npx tsc --noEmit` | PASS |
| Lint | Not available; no lint script/configuration is exposed by the repository |
| `npm run build` | PASS — exact production command produced `dist/` and an 18-file service-worker precache |
| `npm audit --audit-level=low` | PASS — 0 vulnerabilities |

Build output:

- JavaScript: 24,718 bytes raw / 8.67 kB gzip (budget: 200 kB)
- CSS: 21,633 bytes raw / 5.44 kB gzip (budget: 50 kB)
- Mobile AVIF hero: 14,501 bytes (budget: 300 kB)
- Fonts: none
- Complete `dist/`: 465,607 bytes

## Product exercise

### Core job-to-be-done

PASS, aside from the numbering defect:

- Recorded the researched Deerness-style uncertainty case with date/locality, sea-cliff context, visual traits, potentially unrelated call notes, two candidates, independent confidence/contradictions, a user-selected CC BY reference URL, and an unresolved reasoning trail.
- Readiness reached `Complete · 5/5` without representing completion as certainty.
- Saved to IndexedDB, survived reload, reopened from the archive, and preserved all fields.
- Exported Markdown and CSV with the candidate, observations, disclaimer, decision trail, and usable filenames.
- Exported a versioned JSON backup and imported it into a fresh browser context; locality, visual/audio notes, both candidates, reference, and decision survived the round trip.
- A hostile-looking imported species string was rendered literally; no injected element or script executed.

### Boundaries, invalid input, and recovery

- Blank required date/locality: save blocked, actionable alert shown, focus moved to `observedAt`.
- Invalid reference URL: save blocked and focus moved to the URL control; correcting it recovered.
- Latitude `91` / longitude `-181`: native bounds rejected; boundary values `90` / `-180` saved.
- Switching back to Private before export removed both stored coordinate strings from CSV and stated `private`.
- Candidate import confidence `999` normalized to `100`.
- Candidate cap: the 13th add was refused, count stayed at 12, and toast stated the limit.
- Malformed backup: no records changed; recovery message shown.
- Delete confirmation names the card, receives focus, Cancel retains it, and confirmation removes it.
- Empty archive state gives a working route back to the workbench.

## Accessibility, responsive behavior, and motion

- Semantic smoke test: `lang="en"`, descriptive title, exactly one `h1`, one `main`, labelled form controls, meaningful image alt, skip link, ordered headings, and legal pages present.
- Keyboard: first Tab reaches the visible skip link; Enter navigation and native controls/dialog work; focus returns through native dialog behavior. Focus ring measured 3 px in light and dark themes.
- 1280 px and 390 px: no horizontal overflow; mobile intentionally stacks the readout below the editor; visual review found no overlap, clipping, or hidden controls.
- Reduced motion: root scroll behavior becomes `auto`; transitions/animations are reduced to 0.01 ms; functionality and focus styling remain available.
- Axe light at desktop and mobile: 0 serious/critical, one moderate landmark issue.
- Axe dark: FAIL — one serious rule affecting three nodes, detailed above.

## Privacy and browser behavior

- The live page made requests only to `https://bird-id-evidence-card.sociobot.in`; local preview likewise contacted only its own origin.
- Entering `https://example.net/private-reference.mp3` produced zero new requests. Reference URLs are stored as text and are not fetched.
- No cookies and no `localStorage` keys were created. User data appeared only in IndexedDB database `bird-id-evidence-card`.
- No analytics, ads, remote fonts, CDN scripts, API traffic, or third-party media requests were observed.
- `/privacy/` and `/terms/` load online and from the service-worker cache offline.
- Initial load and normal flow: zero console errors and zero uncaught page errors.

Live response policies observed on the document: HTTPS 200, Brotli, HSTS (`max-age=10886400; includeSubDomains; preload`), `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, and `X-DNS-Prefetch-Control: off`. No CSP, Permissions Policy, `frame-ancestors`, or equivalent framing policy was present; this is recorded as defense-in-depth information because no exploit was demonstrated.

## PWA and offline evidence

- Manifest fields, standalone display, versioned start URL, theme/background colors, and 192/512/maskable PNG dimensions are correct. Chromium's manifest parser reported zero errors.
- Service worker controls the page, uses a versioned cache, and precaches 18 production files.
- Candidate app reloads offline, displays `Offline field mode`, preserves/edits the IndexedDB draft, and serves privacy and terms offline.
- A real update was exercised by rebuilding while an installed local page was open, calling `registration.update()`, and observing `A fresh field console is ready.` with a Reload action. The updated app then reloaded and continued offline with its prior draft.
- The same offline reload and draft-persistence check passed against the live deployment at 390 px.

## Performance

Lighthouse 13.0.1 mobile results:

| Target | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Local production preview | 100 | 100 | 100 | 100 | 1.0 s | 1.2 s | 0 ms | 0 | 64 KiB |
| Live deployment | 100 | 100 | 100 | 100 | 0.9 s | 1.2 s | 0 ms | 0 | 64 KiB |

Lighthouse used the default light preference, so its accessibility score does not invalidate the independently measured dark-theme failure.

## Deployment identity

The deployment matches the candidate:

- Live `index.html` is byte-identical to the candidate build (`SHA-256 05ce2b2f2df6d2d68cd242bbc1f2980992e0499dcd50aa26faaa7479ad5082a0`).
- All 18 deterministic build files checked (HTML, JS, CSS, manifest, icons, images, legal/offline pages, robots, sitemap) are byte-identical.
- Key asset hashes match, including JS `f6552acc…` and CSS `f935c558…`; live asset names are `index-B8WpGtgu.js` and `style-Cff6YJ3Y.css`.
- Local and live service workers are structurally identical after excluding the expected generated `CACHE_NAME` timestamp. Their app-shell lists and behavior match.

The builder's earlier deployment concern is not present in fresh evidence: the candidate is deployed and reachable. The release still fails the acceptance contract on product quality, chiefly dark-mode contrast.

## Required disposition

Do not mark this candidate accepted. Correct the three dark-theme text colors and add dark-mode axe coverage, then fix card-number allocation so identifiers cannot be reused after deletion. Re-run the complete verification, including deployment identity and live offline behavior, on the replacement commit.
