# Bird ID Evidence Card — repair handoff

## Status: deployed and verified

This repair replaces the failed candidate `ac491c75725fb2cdb35c97c229a6aedfa59f4ff0` identified in the independent verifier report. Product repair commits are `afdb8633d11cb63ec03b271720cfccf80bbe6727` and `6e054fb` (`fix: keep host config out of PWA precache`). The artifact remains a Vite + TypeScript, static-deployed, local-first PWA; `npm run build` writes `dist/index.html` at its root.

## Repairs made

- **Dark treatment contrast:** the dark evidence-card footer and site footer now use the light `--ink` foreground on `#0d1411`, rather than the dark background token. This corrects `#preview-status`, `#preview-privacy`, and the footer product name.
- **Evidence-number integrity:** new IDs are allocated in an IndexedDB transaction from a per-observation-day high-water mark. The mark is retained after deletion and advances during import, so `BID-YYYYMMDD-NNN` values are never reissued after a deletion or a restored backup.
- **Mobile targets:** the header wordmark and footer links have explicit 44 × 44 CSS-pixel minimum targets at the 390 px breakpoint.
- **Landmarks and recovery:** the nested preview `aside` is now a labelled non-landmark container, eliminating axe’s nested-complementary result. Malformed backup recovery remains safe and visible without emitting an expected `console.error`.
- **Regression coverage:** unit coverage verifies retained high-water allocation. Playwright now tests dark axe with no violations, actual save/delete/save allocation in IndexedDB, 390 px target dimensions, and malformed-backup console cleanliness. Typecheck/lint commands are exposed in `package.json`.
- **Production PWA install:** Azure consumes but does not serve `staticwebapp.config.json`; the generated worker now excludes this host-only file. A post-build check fails if it ever returns to the app-shell list, preventing a production-only offline-install failure.

## Verification evidence

Run from a clean locked install on 2026-08-28 (Node 22 / npm 10):

```sh
npm ci                         # 70 packages, audit 0 vulnerabilities
npm run typecheck              # pass
npm run lint                   # pass
npm audit --audit-level=low    # pass, 0 vulnerabilities
npm test                       # pass: 6 Vitest + build-shell check + 16 Playwright project runs
npm run build                  # pass; dist/ produced
```

`npm test` exercised desktop Chromium and mobile Chromium. It covered the complete save/reload/reopen/export workflow, keyboard skip-link navigation, light and dark axe scans, 390 × 844 touch targets, malformed recovery, coordinate privacy, and installed-app offline reload/editing. Both light and dark axe scans have zero violations; the prior dark serious contrast and moderate landmark failures are absent. The offline test waits for service-worker control, sets the browser offline, reloads, and edits a local draft successfully. A separate production-preview update exercise kept an installed page open, rebuilt the worker, called `registration.update()`, observed `A fresh field console is ready.`, activated Reload, and confirmed service-worker control after reload. The versioned `skipWaiting`/`clientsClaim` update path passes.

Current production bundle from the repair build:

- JavaScript: 25,410 bytes raw / 8.97 kB gzip (under 200 kB).
- CSS: 21,740 bytes raw / 5.46 kB gzip (under 50 kB).
- Service-worker precache: 19 files (host-only `staticwebapp.config.json` intentionally excluded).

Privacy checks remain local-first by design: IndexedDB is the only application store; reference URLs are text only and never fetched; there are no accounts, analytics, cookies, third-party scripts, remote fonts, or runtime APIs. `/privacy/`, `/terms/`, and the offline shell remain precached. `public/staticwebapp.config.json` also sets immutable caching for hashed assets and `no-cache` for the service worker. The linked `manifest.json` is served as JSON by the static host; the retained `manifest.webmanifest` is available for tooling that expects that filename.

## Deployment and follow-up

Deployed on 2026-08-28 using `/opt/fleet/lib/deploy-static.sh bird-id-evidence-card dist` to <https://bird-id-evidence-card.sociobot.in> (Azure Static Web Apps deployment `877d7b50-ad8b-41d3-b327-eeeae298a91b`). Live evidence:

- The deployed and local `index.html` SHA-256 are both `00a2a248d9c758bb50b1e989253dd1b5bd6b24c2aa48f39c71cba990cc5ebdaf`.
- The live manifest is `application/json`; hashed JavaScript is `Cache-Control: public, max-age=31536000, immutable`; `sw.js` is `no-cache`.
- `verify-url.sh` returned HTTPS 200, 657 ms load, no console/page errors, title/lang/one h1/main/alt/button-label checks all passed, and rendered desktop plus 390 px screenshots.
- A live 390 px dark-browser run reported zero axe violations, only same-origin requests, 44 px targets, service-worker control, offline reload, and successful offline locality editing.
- Live Lighthouse 13 report scores were Performance 100, Accessibility 100, Best Practices 100, and SEO 100 (FCP 1.1 s, LCP 1.2 s, TBT 50 ms, CLS 0). The CLI reported a Chromium tab crash while collecting its final screenshot after the audits had completed; the emitted report contains the listed scores.

No known product gaps remain from verifier report `f18b6e83572b1d206c773d351306350d95ba23c7`.
