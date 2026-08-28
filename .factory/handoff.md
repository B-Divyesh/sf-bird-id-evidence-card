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

Pending this work order's static deployment. After deployment, record cold checks for `/`, `/demo`, `/records`, `/guide`, `/privacy/`, `/terms/`, and an unknown URL here.

## Known gaps

None in the product. The only remaining operation is the required deploy-and-cold-live verification.
