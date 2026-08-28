# Polish 4 handoff

## Outcome

Perfection-loop round 4 is complete. Every finding from reviews 1–4 is closed, including both review-4 blockers. The deployed product remains an offline-first static PWA with its original field-instrument visual system.

Live: <https://bird-id-evidence-card.sociobot.in/>

Demo: <https://bird-id-evidence-card.sociobot.in/demo>

Tested product commit: `ff0078b767cffde6bc6755080f6543a33c0bd395`

Deployment: `b60c3431-eacc-44e5-ad48-9f644f740e6a`

## What changed

- Rebuilt `/offline.html` with the shared product header/footer, complete metadata, one h1, legal links, self-hosted styles, and 44 px recovery actions.
- Made uncached offline navigations choose the fallback before attempting a network request.
- Replaced every flagged state term with consistent evidence-card language and action-specific dialog/update wording.
- Added offline fallback and dynamic-copy regression coverage to route, metadata, accessibility, touch-target, console, copy-audit, and service-worker tests.
- Updated the catalog sentence, claim wording, build version `v1.0.4`, copy audit, and cumulative finding map.

## Verification

From clean clone `/tmp/bird-polish4-clean.8zNA83` at `ff0078b767cffde6bc6755080f6543a33c0bd395`:

- `npm ci` — pass, zero audit vulnerabilities.
- Every exact command in `.factory/claims.json` — 15/15 pass independently.
- `npm test` — pass: 10 unit tests, 45 browser tests, one intentional desktop skip.
- `npm run build` and `npm run test:build` — pass; `dist/index.html` present.
- Budgets — JS 10,651 bytes gzip; CSS 5,741 bytes gzip; mobile hero 14,501 bytes.
- Playwright axe — zero violations across app, demo, saved cards, guide, Privacy, Terms, 404, and offline routes in tested treatments.
- Offline — demo editing/reload, Privacy, Terms, and an uncached service-worker fallback pass with networking disabled.
- Privacy — same-origin requests only; no cookies or localStorage keys; demo never changed the seeded real database.

After deployment:

- `./scripts/verify-url.sh https://bird-id-evidence-card.sociobot.in/` — pass.
- `npm run test:live -- https://bird-id-evidence-card.sociobot.in .factory/evidence/polish-4/live` — pass at `2026-08-28T14:45:24.357Z`.
- Seven public routes returned 200 with correct title, h1, metadata, shared chrome, no mobile overflow, 44 px targets, and zero axe violations.
- Unknown online URL returned the designed 404 with HTTP 404; unknown offline URL returned the designed fallback from the service worker.
- All 28 served build files matched local `dist/` by SHA-256.
- Live Lighthouse — performance 100, accessibility 100, best practices 100, SEO 100; LCP 1,146 ms; CLS 0; TBT 0.

Evidence: [cumulative map](polish-4.md), [live audit](evidence/polish-4/live/live-audit.json), [byte match](evidence/polish-4/live/byte-match.json), [live offline screenshot](evidence/polish-4/live/offline-fallback-mobile.png), and [live Lighthouse](evidence/polish-4/live/lighthouse.json).

## Run and verify

```sh
npm ci
npm test
npm run build
./scripts/verify-url.sh https://bird-id-evidence-card.sociobot.in/
npm run test:live -- https://bird-id-evidence-card.sociobot.in .factory/evidence/polish-4/live
```

## Known gaps and next steps

None.
