# Review 2 handoff

## What was done

- Performed the adversarial first-read review against the live site in fresh 390px and desktop Chromium contexts.
- Audited every landing/README sentence, headings, actions, terminology, claims, demo isolation, offline behavior, routing, metadata, links, accessibility, touch targets, 404, and visual identity.
- Wrote the full evidence and FAIL verdict to `.factory/review-2.md`.
- Changed no product code.

## Verification

- Clean clone at commit `e9a4f330e4dc55457be6c3ae8a7cba0b51fff41b` with `npm ci`.
- All seven exact `.factory/claims.json` commands failed from that clean clone because Playwright's preview server had no prebuilt `dist/` and timed out after 30 seconds.
- After an explicit diagnostic `npm run build`, the combined claim run passed 14 mobile/desktop cases.
- Final repository `npm test` passed: 6 unit tests, production build and shell check, and 21 Playwright tests with 1 intentional skip.
- Live demo reset, real/demo IndexedDB isolation, service-worker offline reload/edit, and same-origin-only requests were independently exercised and passed.
- Live link crawl, designed 404, console check, `scripts/verify-url.sh`, and axe scans were run. Axe found no serious/critical violations.

## Known gaps and next steps

1. Make every exact claim command build and start successfully from a clean clone.
2. Render and focus a visible route-specific `<h1>`; do not leave destination content below the unchanged hero.
3. Register or remove the unlisted claims catalogued in the review, and strengthen demo isolation with a seeded real-data sentinel.
4. Correct route canonical/OG metadata, 1200 × 630 social art, 44px demo/legal targets, common header/footer structure, guide landmark nesting, and CSP.
5. Replace the demo's invalid field-notes reference with a realistic licensed recording citation while preserving no-fetch behavior.

Run the review's exact checks from a new clone after repair; do not rely on a previously generated `dist/`.
