# Independent product verification — candidate 2

## Verdict: PASS

Candidate `cce7d86f3c24405c267b365578e58af3e382f396` satisfies the researched brief and factory acceptance contract. It was tested from a clean checkout on 28 August 2026, and the live deployment at <https://bird-id-evidence-card.sociobot.in> is the candidate build.

The prior report, `.factory/verification.md`, applies to the superseded candidate `ac491c7…`. Fresh evidence confirms that its dark-theme contrast, duplicate-number, small-target, nested-landmark, malformed-import console, caching, manifest, and production service-worker installation defects are repaired.

## Scope and environment

- Work order: `bird-id-evidence-card-verify-2`
- Tested commit: `cce7d86f3c24405c267b365578e58af3e382f396`
- Checkout at start: clean `main`; `HEAD == origin/main == candidate`; GitHub `refs/heads/main` independently resolved to the same SHA
- Tested deployment: <https://bird-id-evidence-card.sociobot.in>
- Node.js `v22.23.2`, npm `10.9.8`
- Playwright `1.58.2`, Chromium `145.0.7632.6`, axe-core Playwright `4.10.2`, Lighthouse `13.0.1`
- Viewports: 1280 × 900 desktop and 390 × 844 mobile; light, dark, and reduced-motion preferences

No product code was changed during verification.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

Informational hardening note: the live document has HSTS, `nosniff`, and a strict-origin referrer policy, but does not send CSP, Permissions Policy, or an explicit framing restriction. No exploit, unexpected outbound request, or acceptance-contract violation was found.

## Repository gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 70 packages installed; lockfile honored |
| `npm audit --audit-level=low` | PASS — 0 vulnerabilities |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS — repository lint command is the TypeScript no-emit check |
| `npm test` | PASS — 6 Vitest tests; production build and shell check; 15 Playwright runs passed and the desktop-only duplicate mobile target run was intentionally skipped |
| `npm run build` | PASS — exact production command produced `dist/` and a 19-file app-shell precache |

Production output:

- JavaScript: 25,401 bytes raw / 8.97 kB gzip (budget: 200 kB)
- CSS: 21,735 bytes raw / 5.46 kB gzip (budget: 50 kB)
- Mobile AVIF hero: 14,501 bytes (budget: 300 kB)
- Fonts: none
- Complete `dist/`: 472,090 bytes
- The generated worker excludes the host-only `staticwebapp.config.json`; the build-shell regression check passes.

## End-to-end product exercise

The smallest useful job-to-be-done works:

- Recorded the researched Deerness-style uncertain sighting with date, broad locality, habitat/conditions, visual evidence, potentially unrelated call notes, two competing candidates, user-owned confidence and contradictions, an openly licensed reference link, and unresolved reasoning.
- The interface kept observed facts, app/personal suggestions, and the user's conclusion visibly separate. Completing all evidence sections did not claim a certain identification.
- Saved to IndexedDB, survived reload, reopened from the archive, and retained the uncertainty trail.
- Exported Markdown and CSV with observations, candidates, reference, status, disclaimer, and expected filename; exported JSON and imported it into a fresh browser context.
- The empty archive provides a working return path. Delete confirmation names the card, focuses Cancel, and Cancel preserves it.

Boundary, invalid-input, and recovery evidence:

- Blank locality blocked save, displayed an actionable error, and focused the invalid control.
- An invalid reference URL blocked save and focused the URL; correction recovered.
- Latitude `91` / longitude `-181` were rejected. Boundary values `90` / `-180` saved and exported when Precise was explicit.
- Switching back to Private excluded both retained coordinate strings from CSV.
- A malformed backup changed no records and showed a useful recovery message without a console error.
- Imported confidence `999` normalized to `100`; an imported HTML event-handler payload rendered as literal text and did not execute.
- The thirteenth candidate was refused with a visible limit message and the card remained at 12.
- Delete/save/save regression coverage proved same-day identifiers are not reused. A separate two-tab simultaneous save produced unique `BID-20260828-001` and `BID-20260828-002` numbers.

## Accessibility, responsive design, and motion

- Semantics pass: `lang="en"`, descriptive title, exactly one `h1`, one `main`, ordered headings, labels, meaningful image alt, legal landmarks, and no unlabeled buttons.
- Keyboard smoke test: first Tab focuses the skip link, Enter activates it, native form/dialog controls operate, and the visible focus treatment is a 3 px solid ring.
- Body text is 16 px at 390 px. Desktop and mobile have no horizontal overflow, clipping, overlap, or fixed-bar obstruction in screenshot review. Mobile intentionally stacks the preview below the form.
- At 390 px the wordmark and all legal/footer links measured at least 44 × 44 CSS px (including a 44 px Terms target).
- Independent axe scans found **zero violations** in all four combinations: desktop light, desktop dark, mobile light, and mobile dark.
- Under `prefers-reduced-motion: reduce`, smooth scrolling becomes `auto` and transition/animation durations become `0.00001s`; no looping or flashing motion exists.

## Privacy, security, and browser behavior

- Normal local and live journeys had zero console errors and zero uncaught page errors.
- All observed requests were same-origin. Entering `https://example.net/private-recording.mp3` as a reference caused no request; the app stores links as text.
- The app created no cookies and no localStorage keys. Application data existed only in IndexedDB database `bird-id-evidence-card`.
- No analytics, ads, CDN scripts, remote fonts, third-party media, APIs, or tracking traffic were observed.
- `/privacy/` and `/terms/` load online and from the installed worker while offline.
- Live document: HTTPS 200, HSTS `max-age=10886400; includeSubDomains; preload`, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Content-Type-Options: nosniff`.
- Live hashed JavaScript: `Cache-Control: public, max-age=31536000, immutable`; worker: `no-cache`; manifest: JSON with one-day caching. The HTML uses a short 30-second revalidation policy.

## PWA and offline behavior

- Chromium reported zero manifest errors. The linked manifest has standalone display, a versioned start URL, product theme/background colors, and verified 192, 512, and 512 maskable PNG dimensions.
- The worker controls the app, precaches the shell, and offline reload preserves and edits the local draft. Privacy and terms also reload offline.
- A real update was exercised against the production preview: keep a controlled 390 px client open, rebuild to produce a new cache version, call `registration.update()`, observe `A fresh field console is ready.`, activate Reload, confirm worker control, then reload successfully offline. No errors were emitted.
- The live worker is structurally byte-identical to the tested worker after replacing only the generated cache timestamp, so the tested update/offline logic is what is deployed.

## Deployment identity and response checks

- All 19 deterministic deployed files were fetched and compared with `dist/`; every SHA-256 matched. This includes HTML, hashed JS/CSS, all image variants and icons, both manifests, offline/legal pages, robots, and sitemap.
- Live and local `index.html` SHA-256: `00a2a248d9c758bb50b1e989253dd1b5bd6b24c2aa48f39c71cba990cc5ebdaf`.
- Live JavaScript SHA-256 begins `a7667c8f1151001f`; CSS begins `104456fcfc2c2378`.
- `/opt/fleet/lib/verify-url.sh` returned HTTPS 200, 845 ms network-idle load, zero console/page errors, one `h1`, one `main`, valid title/lang/alt/button labels, and rendered desktop/mobile screenshots.
- Fresh live 390 px dark-mode automation independently confirmed zero axe violations, valid manifest parsing, service-worker control, offline reload/editing, 44 px targets, and same-origin-only traffic.

The builder's historical deployment-only failure is not present: the candidate is deployed, reachable, installable, and byte-matched.

## Performance

Fresh Lighthouse 13 mobile results for the live deployment:

| Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Transfer |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 99 | 100 | 100 | 100 | 0.98 s | 1.13 s | 142 ms | 0 | 72,104 B |

The static budgets, Lighthouse thresholds, and LCP/interaction proxies all pass.

## Disposition

Accept candidate `cce7d86f3c24405c267b365578e58af3e382f396`. No product repair is required before release.
