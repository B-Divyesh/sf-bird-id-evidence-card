# Polish 3 handoff

## Outcome

Perfection-loop round 3 is complete. Every finding in reviews 1–3 is mapped in `.factory/polish-3.md`, implemented, tested, deployed, and rechecked on the public domain. No finding is deferred.

The shipped product remains a static, offline-first PWA with its field-naturalist instrument-panel identity intact.

The infrastructure retry work order reran the complete proof set in a new clean clone. The controller's earlier Chromium `SIGSEGV` did not recur.

## What changed

- Rewrote the first screen around the exact user job, audience, one-click sample action, outcome, and three short facts.
- Added a realistic `/demo` and `?demo=1` flow backed only by `demo:bird-id-evidence-card`, with a persistent banner, reset, and blank-card exit.
- Added 15 registered claims with one unique observable `@claim:<id>` test each.
- Added route-specific static documents, metadata, titles, canonical URLs, social metadata, focus/announcement behavior, and a true styled HTTP 404.
- Unified header/footer navigation and build `v1.0.3` across app, demo, legal, and 404 pages.
- Narrowed privacy/audio wording to tested behavior and added tests for accounts, coordinates, deletion, storage schema, network privacy, and exports.
- Explained CSV, Markdown, and backup outcomes in plain words.
- Corrected the populated Saved cards outline so its item headings follow the page `<h1>`.
- Added stable sharded browser execution and a reproducible cold-live verifier.
- Updated the catalog line to: `Record bird evidence before logging an uncertain sighting.`

## Verification

Implementation commit tested: `5c8e7226807b91ba3f2807677080583605a018a1`.

Clean clone: `/tmp/bird-polish3-final.mukzQg`.

- `npm ci`: passed.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- Every exact command in `.factory/claims.json`: 15/15 passed independently (`ALL_CLAIMS_PASS=15`).
- `npm test`: 9/9 unit tests passed; production build verification passed; browser suite passed 43 tests across phone and desktop. One desktop instance of the phone-only first-viewport test was intentionally skipped.
- `npm run build`: passed and created `dist/index.html`.
- Build budgets: JavaScript 10,624 bytes gzip; CSS 5,743 bytes gzip; mobile hero 14,501 bytes.

Evidence summary: `.factory/evidence/polish-3/verification-summary.json`.

Fresh-worker infrastructure retry at `4d9e6eb510220fdd6b2f5a231b866c547c84944d`:

- Clean clone: `/tmp/bird-polish3-infra-retry.HKek2t/repo`.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `npm run typecheck` and `npm run lint`: passed.
- Every exact command in `.factory/claims.json`: 15/15 passed independently.
- `npm test`: 9/9 unit tests, build verification, and 43 browser tests passed; one desktop instance of the phone-only first-screen test was intentionally skipped.
- The multi-context export/import test passed on phone and desktop. Chromium completed all four full-suite shards without a crash.
- Independent URL verification: correct title/lang/landmarks/alt/button labels and zero console errors.
- Local Lighthouse 13.4.1: performance 100, accessibility 100, best practices 100, SEO 100; FCP 998 ms, LCP 1,359 ms, TBT 51 ms, CLS 0.
- Machine-readable retry record: `.factory/evidence/polish-3/infra-retry-summary.json`.

## Deployment and live checks

- Public URL: <https://bird-id-evidence-card.sociobot.in/>
- Azure Static Web Apps deployment: `9b5ac897-9026-4fb0-a1aa-019c4fc4e375` from pushed commit `e8cc8cd9a5d23f8c938ecfb6ea96d80bfd858259`.
- `verify-url.sh`: 200 response, correct title/lang, one `<h1>`, `<main>`, all image alt text, no unlabeled buttons, no console errors.
- `npm run test:live -- https://bird-id-evidence-card.sociobot.in .factory/evidence/polish-3/live`: passed after the final deployment.
- Cold live audit covered six 200 routes, a real unknown-route 404, raw/rendered heading counts, metadata, common chrome, focus, 390px layout, 44px targets, axe, console errors, same-origin traffic, cookies/localStorage, demo reset/isolation, and offline demo/legal reloads.
- All 28 publicly served build files matched local `dist/` byte-for-byte by SHA-256. Hashed assets have a one-year immutable cache policy.
- Live Lighthouse 13.4.1: performance 100, accessibility 100, best practices 100, SEO 100; FCP 937 ms, LCP 1,221 ms, TBT 0 ms, CLS 0.
- Screenshots: `.factory/evidence/polish-3/live/home-mobile.png`, `demo-mobile.png`, `screenshot-mobile.png`, and `screenshot-desktop.png`.
- Machine-readable results: `.factory/evidence/polish-3/live/live-audit.json`, `live/verify.json`, and `lighthouse-live-summary.json`.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run test:live -- https://bird-id-evidence-card.sociobot.in .factory/evidence/polish-3/live
```

Deploy with:

```sh
/opt/fleet/lib/deploy-static.sh bird-id-evidence-card dist
```

## Known gaps

None.
