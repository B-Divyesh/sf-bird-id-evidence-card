# Bird ID Evidence Card — verifier handoff

## Verification status: FAIL

Independent QA of candidate `ac491c75725fb2cdb35c97c229a6aedfa59f4ff0` against <https://bird-id-evidence-card.sociobot.in> completed on 28 August 2026. The live deployment matches the candidate, but the candidate does not satisfy the acceptance contract.

Release blocker: the dark theme has an axe **serious** contrast failure on the evidence-card footer status/privacy text and the site-footer product name. Each measures 1.07:1 instead of the required 4.5:1.

Also reproduced:

- Medium: deleting an earlier same-day card allows a later card to reuse an existing `BID-YYYYMMDD-NNN` number; two records were both assigned `BID-20260828-002`.
- Low: the 390 px header wordmark is 40 px high and footer legal/navigation links are 19.6 px high, below the 44 px touch-target requirement.
- Low: axe reports one moderate nested complementary-landmark issue.
- Low/deployment: hashed assets use a 30-second revalidating cache rather than immutable caching; the manifest is served as `application/octet-stream` (Chromium nevertheless parses it without errors).
- Low: malformed import is safely rejected but emits the caught exception as a console error.

The full evidence, reproduction steps, response headers, hashes, workflows, and measurements are in [`.factory/verification.md`](verification.md).

## What passed

- Clean locked install; `npm test` (5 unit + 8 Playwright), `npx tsc --noEmit`, exact `npm run build`, and `npm audit --audit-level=low` all pass. No lint command exists.
- The researched uncertain-identification workflow works end to end, including conflicting observations, multiple candidates, confidence, reference provenance, decision trail, local save/reopen, Markdown/CSV, and JSON backup/import.
- Invalid required values, URL and coordinate validation, import recovery, deletion confirmation, candidate limit, empty state, and coordinate privacy were exercised.
- IndexedDB persistence, installed service-worker update toast/reload, offline app/legal reload, and live 390 px offline editing pass.
- Only same-origin requests occur; reference URLs are not fetched; no cookies, analytics, trackers, remote fonts/scripts, or application API traffic were observed.
- Responsive layouts at 1280 px and 390 px have no horizontal overflow; keyboard skip/focus and reduced motion work.
- Initial/normal loads have zero console or page errors. Light-theme axe has zero serious/critical findings.
- Bundle budgets pass: 24,718-byte JS, 21,633-byte CSS, 14,501-byte mobile AVIF, no fonts, and 465,607-byte total `dist/`.
- Lighthouse mobile: local and live are 100/100/100/100; live FCP 0.9 s, LCP 1.2 s, TBT 0 ms, CLS 0, 64 KiB transfer.
- Deployment identity: 18 deterministic output files are byte-identical to the candidate; the service worker differs only by its generated cache timestamp.

## Re-run

```sh
npm ci
npm test
npx tsc --noEmit
npm audit --audit-level=low
npm run build
```

For acceptance, add a dark-color-scheme axe run to Playwright and reproduce the delete/save numbering sequence before rechecking the deployed replacement.
