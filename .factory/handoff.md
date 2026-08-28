# Polish 2 handoff

## Completed

- Closed every finding in `.factory/review-1.md` and `.factory/review-2.md`; the detailed mapping is in `.factory/polish-2.md`.
- Fixed independent clean-clone claim execution, route-specific first screens/focus/metadata, demo isolation proof, mobile targets, legal/404 chrome, CSP, copy, and the sample recording citation.
- Added a locally derived 1200×630 social image from the existing original field-console artwork. Its provenance is recorded in `.factory/design.md`.

## Verification before deployment

- Fresh clone: `/tmp/bird-clean-final-3CISS2`, created with `git clone --no-local /work/repo`; `npm ci` completed with zero vulnerabilities.
- Every exact command in `.factory/claims.json` passed independently from that clone: 12 browser claim commands (mobile and desktop) and the tagged provenance unit command.
- `npm test`: 7 unit tests, production build, service-worker shell check, and 31 Playwright passes with one intentional desktop skip.
- `npm run typecheck`, `npm run build`, and `git diff --check` passed.
- `scripts/verify-url.sh` passed on local `/` and `/demo`; `@axe-core/playwright` reported no serious or critical violations in light or dark treatment.
- Local mobile evidence: `/tmp/bird-polish2-home.png` and `/tmp/bird-polish2-demo.png`.
- Built route shells have the expected static titles/canonicals: `/demo`, `/records`, and `/guide`.

## Deployment and live check

- Deployed production build with `/opt/fleet/lib/deploy-static.sh bird-id-evidence-card dist`; Azure deployment `81adb915-fcca-4b4f-b089-28c3310bbd54` completed successfully on 2026-08-28.
- Cold live route/status check: `/`, `/demo`, `/records`, `/guide`, `/privacy/`, and `/terms/` each returned 200. `/not-a-real-route` returned the designed 404 with HTTP 404.
- Cold Chromium check confirmed route-specific titles, visible route `<h1>` values, and canonical URLs for every public route. `/demo` showed the persistent demo banner and Northern Fulmar sample.
- Live header check found the required CSP, `Referrer-Policy`, and `X-Content-Type-Options`. Live demo browser check: zero console errors, zero external requests, and zero serious/critical axe violations.
- Live mobile evidence: `/tmp/bird-polish2-live-demo.png`.

## Known gaps

None.
