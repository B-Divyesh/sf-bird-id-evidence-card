# Review 6 handoff

## Outcome

The independent adversarial review at commit `11218c9c8082baeac712d7f0061f08327e239884` passed with zero findings. Product code was not modified. The deployed PWA is <https://bird-id-evidence-card.sociobot.in>.

The review confirmed the cold-phone message, one-click isolated demo, all current claims, offline/privacy behavior, routes, metadata, accessibility coverage, and prior finding closure. The field-instrument visual system and offline/local-first deployment class are unchanged.

The complete report is [review-6.md](review-6.md).

## Verification

- Fresh live 390 × 844 and desktop contexts confirmed the job, audience, sample action, outcome, and three facts before scrolling.
- The demo loaded a completed Deerness coast sample, showed its persistent isolation banner, reset correctly, remained same-origin-only, and passed real/demo IndexedDB isolation and offline checks.
- Fresh clone `/tmp/bird-review6-clean`: `npm ci`, every exact claim command (16/16), `npm test`, `npm run build`, and `npm run test:build` passed.
- Review-6 route/metadata/focus crawl passed for app, demo, records, guide, legal, offline, and 404 views. Unknown live paths return the designed HTTP 404. All nine discovered same-origin links responded successfully.

- Clean clone: `/tmp/bird-polish5-clean.eznbKb` at `61181b9f18c4cd196ac0e81da17a32d6086d1cfb`.
- `npm ci`: passed with zero vulnerabilities.
- Every exact `.factory/claims.json` command: 16/16 passed independently.
- `npm test`: passed with 11 unit tests, 49 applicable browser tests, and one intentional desktop skip of the phone-only viewport assertion.
- `npm run build`: produced `dist/index.html`; JavaScript 10,654 B gzip, CSS 6,033 B gzip, hero 14,501 B.
- Accessibility: axe found zero violations on app, demo, records, guide, privacy, terms, 404, and offline pages in the browser suite. Light/dark themes, reduced motion, keyboard focus, 44 px targets, and 390 px overflow checks passed.
- Privacy and offline: only same-origin requests, no cookies/localStorage keys, no recording fetch, byte-for-byte real/demo database isolation, offline reload/edit, cached legal routes, and uncached fallback passed.
- Local Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1,508 ms, CLS 0, TBT 39 ms. Evidence: [local report](evidence/polish-5/local/lighthouse.json).
- Work-order build command `npm ci && npm test && npm run build`: passed before deployment.
- Azure Static Web Apps deployment: `d757e528-1fd2-4dfb-86d5-128222dcf85f` succeeded.
- Cold live audit: seven 200 routes, designed 404, route titles/metadata/chrome, first phone screen, landing sequence, exact entry limits, corrected readiness terms, demo sentinel/reset/exit, focus, zero axe issues, privacy, and offline fallback all passed. Evidence: [live audit](evidence/polish-5/live/live-audit.json).
- Live Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1,151 ms, CLS 0, TBT 27 ms. Evidence: [live report](evidence/polish-5/live/lighthouse.json).
- URL structure check: `./scripts/verify-url.sh https://bird-id-evidence-card.sociobot.in` passed.

## Run, test, and deploy

```sh
npm ci
npm run dev
npm test
npm run build
```

Publish `dist/` as the static site root. Factory infrastructure performs deployment; the repository contains the route documents, service worker, static-host configuration, and designed 404.

## Known gaps and next steps

None. No finding, TODO, deferred minor item, or known acceptance gap remains.
