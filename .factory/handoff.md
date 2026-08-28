# Bird ID Evidence Card — repair handoff

## Status: ready for deployment

This repair replaces the failed candidate `ac491c75725fb2cdb35c97c229a6aedfa59f4ff0` identified in the independent verifier report. Product repair commit: `afdb8633d11cb63ec03b271720cfccf80bbe6727` (`fix: resolve verification release blockers`). The artifact remains a Vite + TypeScript, static-deployed, local-first PWA; `npm run build` writes `dist/index.html` at its root.

## Repairs made

- **Dark treatment contrast:** the dark evidence-card footer and site footer now use the light `--ink` foreground on `#0d1411`, rather than the dark background token. This corrects `#preview-status`, `#preview-privacy`, and the footer product name.
- **Evidence-number integrity:** new IDs are allocated in an IndexedDB transaction from a per-observation-day high-water mark. The mark is retained after deletion and advances during import, so `BID-YYYYMMDD-NNN` values are never reissued after a deletion or a restored backup.
- **Mobile targets:** the header wordmark and footer links have explicit 44 × 44 CSS-pixel minimum targets at the 390 px breakpoint.
- **Landmarks and recovery:** the nested preview `aside` is now a labelled non-landmark container, eliminating axe’s nested-complementary result. Malformed backup recovery remains safe and visible without emitting an expected `console.error`.
- **Regression coverage:** unit coverage verifies retained high-water allocation. Playwright now tests dark axe with no violations, actual save/delete/save allocation in IndexedDB, 390 px target dimensions, and malformed-backup console cleanliness. Typecheck/lint commands are exposed in `package.json`.

## Verification evidence

Run from a clean locked install on 2026-08-28 (Node 22 / npm 10):

```sh
npm ci                         # 70 packages, audit 0 vulnerabilities
npm run typecheck              # pass
npm run lint                   # pass
npm audit --audit-level=low    # pass, 0 vulnerabilities
npm test                       # pass: 6 Vitest + 16 Playwright project runs
npm run build                  # pass; dist/ produced
```

`npm test` exercised desktop Chromium and mobile Chromium. It covered the complete save/reload/reopen/export workflow, keyboard skip-link navigation, light and dark axe scans, 390 × 844 touch targets, malformed recovery, coordinate privacy, and installed-app offline reload/editing. Both light and dark axe scans have zero violations; the prior dark serious contrast and moderate landmark failures are absent. The offline test waits for service-worker control, sets the browser offline, reloads, and edits a local draft successfully. A separate production-preview update exercise kept an installed page open, rebuilt the worker, called `registration.update()`, observed `A fresh field console is ready.`, activated Reload, and confirmed service-worker control after reload. The versioned `skipWaiting`/`clientsClaim` update path passes.

Current production bundle from the repair build:

- JavaScript: 25,410 bytes raw / 8.97 kB gzip (under 200 kB).
- CSS: 21,740 bytes raw / 5.46 kB gzip (under 50 kB).
- Service-worker precache: 20 files.

Privacy checks remain local-first by design: IndexedDB is the only application store; reference URLs are text only and never fetched; there are no accounts, analytics, cookies, third-party scripts, remote fonts, or runtime APIs. `/privacy/`, `/terms/`, and the offline shell remain precached. `public/staticwebapp.config.json` also sets immutable caching for hashed assets and `no-cache` for the service worker. The linked `manifest.json` is served as JSON by the static host; the retained `manifest.webmanifest` is available for tooling that expects that filename.

## Deployment and follow-up

Deploy `dist/` using `/opt/fleet/lib/deploy-static.sh bird-id-evidence-card dist`, then verify the deployed response identity against this final build and repeat the live 390 px offline reload.

No known product gaps remain from verifier report `f18b6e83572b1d206c773d351306350d95ba23c7`.
