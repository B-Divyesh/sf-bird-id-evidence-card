# Bird ID Evidence Card — handoff

## Shipped

- A complete Vite + vanilla TypeScript PWA at `dist/`, designed as a product-specific mid-century field instrument.
- Six-part evidence workflow: context and privacy, visual evidence, audio evidence, candidates, lawful reference links, and decision trail.
- Observations and app/guide suggestions are visually and semantically separated. Confidence belongs to the birder; the tool makes no species claim.
- Local IndexedDB autosave, saved-card archive, reopen/edit, named delete confirmation, and clear empty/error/offline states.
- Markdown and CSV per-card exports plus versioned JSON archive export/import. Private and approximate modes always strip coordinates from exports.
- Install manifest, 192/512/maskable original icons, generated/versioned service worker, app-shell precache, cache cleanup, offline navigation, and update toast.
- Responsive 390 px layout, keyboard path, designed focus states, native accessible form controls/dialog, reduced-motion treatment, automatic dark palette, and print-friendly evidence readout.
- Static `/privacy/` and `/terms/` pages; no accounts, analytics, runtime CDNs, remote fonts, third-party scripts, or media fetching.
- Original factory-generated field-console illustration in AVIF/WebP/JPEG. Source, exact prompt, review, model, and date are recorded in `assets/src/` and `.factory/design.md`.

## Run and deploy

```sh
npm ci
npm test
npm run build
```

Deployment is static. Publish `dist/`; `dist/index.html` is at its root. The exact build command is `npm run build`.

## Verification — 28 August 2026

- `npm test`: pass — 5 Vitest unit tests and 8 Playwright tests across Pixel 5 and desktop Chromium.
- Browser paths covered: complete-card creation, IndexedDB persistence after reload, archive reopen, Markdown download, keyboard skip link, location-precision consent, and service-worker reload/edit while `context.setOffline(true)`.
- Axe 4.10 automated scan: 0 serious or critical violations on mobile and desktop.
- Browser console assertion: 0 console errors on initial production load.
- `npx tsc --noEmit`: pass.
- `npm audit`: 0 vulnerabilities.
- `npm run build`: pass; generated 18-file precache and a 524 KB total `dist/` directory.
- Initial compiled assets: 24.72 KB JavaScript (8.67 KB gzip), 21.63 KB CSS (5.44 KB gzip), 14.5 KB mobile AVIF hero. No font payload.
- Lighthouse 13.4.1 mobile on the local production server: **Performance 100, Accessibility 100, Best Practices 100, SEO 100**.
- Lighthouse lab metrics: FCP 0.9 s, LCP 1.5 s, TBT 0 ms, CLS 0; initial transfer reported as 71 KiB.
- Visual review performed at desktop 1280 px and Pixel 5/393 CSS px. Content stacks intentionally, controls remain at least 44 px, and the live card moves below the editor on mobile.

## Known gaps and intentional limits

- No identification engine, hosted call library, external-service integration, or automatic licensing check; these are explicit product non-goals.
- Data has no cloud sync. Browser/OS storage eviction is possible, so the product directs users to export JSON backups before clearing data or moving devices.
- Automated browser coverage is Chromium only. Safari/iOS install and Firefox should receive hands-on device checks during the pilot.
- The `verified` state remains a user-authored conclusion. The interface warns when it is chosen without a linked reference but does not block the user.

## Suggested next steps

1. Run the month-long pilot from the brief and measure complete-card rate plus changes in unqualified “certain” logs.
2. Observe which fields birders skip; change readiness criteria only from that evidence.
3. Add optional, user-authored export templates only after the base portability workflow proves useful.
