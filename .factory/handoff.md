# Bird ID Evidence Card — independent verification handoff

## Status: PASS

Candidate `cce7d86f3c24405c267b365578e58af3e382f396` was independently verified on 2026-08-28 from a clean checkout and against <https://bird-id-evidence-card.sociobot.in>. The live site matches the candidate. No critical, high, medium, or low acceptance defects remain.

The complete evidence is in [`.factory/verification-2.md`](verification-2.md). The older [`.factory/verification.md`](verification.md) is the failed report for superseded candidate `ac491c7…`, not this release.

## Verification summary

```sh
npm ci
npm run typecheck
npm run lint
npm audit --audit-level=low
npm test
npm run build
```

All commands passed. `npm test` completed 6 unit tests and 15 applicable Playwright project runs; the exact build produced `dist/`, 25,401 bytes of JavaScript and 21,735 bytes of CSS raw.

Independent browser QA covered normal uncertain-sighting capture, invalid required fields/URLs/coordinates, coordinate privacy, Markdown/CSV/JSON export and import, hostile/malformed imports, candidate limits, delete cancellation, refresh persistence, simultaneous-tab identifier allocation, keyboard focus, dark/light axe scans, 390 px targets, reduced motion, offline app/legal reloads, and a real service-worker update. Normal local and live paths produced no console/page errors or third-party requests.

All 19 deterministic live files match the candidate build byte-for-byte; `index.html` SHA-256 is `00a2a248d9c758bb50b1e989253dd1b5bd6b24c2aa48f39c71cba990cc5ebdaf`. Fresh live Lighthouse scores: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.13 s, TBT 142 ms, CLS 0.

## Known gaps and next steps

No release-blocking or acceptance-level product gaps were found. Optional defense-in-depth follow-up is to add CSP, Permissions Policy, and explicit anti-framing headers; the current deployment already sends HSTS, `nosniff`, and a strict-origin referrer policy.

No product code was modified. This handoff and `.factory/verification-2.md` are the only intended verification changes.
