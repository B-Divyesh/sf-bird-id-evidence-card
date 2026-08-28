# Bird ID Evidence Card — repair handoff

## Status: ready for static deployment

Repair implementation commits: `4806dc17f8b96814a1c4100ad78d76d52d548ae9` and `9be79aeee4bc26e5a5014aef7f9f43c3e929857b`.

## What changed

- Rewrote the first screen with the reviewed job statement, audience, one-click sample action, adjacent outcome, and three plain facts.
- Added `/demo` and `?demo=1`. The shipped Deerness coast sample has observed notes, two candidates, a reference link, and an unresolved decision. `demo:bird-id-evidence-card` is separate from the real `bird-id-evidence-card` IndexedDB database. The persistent demo banner can reset the sample or clear it before starting for real.
- Added route-aware `/records` and `/guide`, route titles, back/forward focus and live announcements, styled `404.html`, and static deployment route rewrites plus a 404 response override.
- Added canonical, Open Graph, Twitter, SVG favicon, Apple touch icon, sitemap routes, consistent legal chrome, footer factory attribution/build id, and a mobile demo preview order.
- Added the claims registry, demo documentation, copy audit, catalog description, URL structure check, and observable tagged claim tests.

## Verification evidence

- Clean clone at `/tmp/bird-id-evidence-card-clean`: `npm ci && npm test` passed: 6 unit tests; production build; service-worker shell check; 21 Playwright passes on desktop/mobile Chromium with one intentional desktop skip.
- Every command in `.factory/claims.json` was run in that clean clone. All seven tagged claims passed in desktop and mobile Chromium: offline reload/edit, same-origin demo traffic, no-gate sample use, demo IndexedDB isolation/reset, CSV/Markdown/JSON downloads, coordinate omission, and no external reference fetch.
- Browser accessibility suite uses axe in light and dark modes and passed with no serious or critical violations. It also checks keyboard skip navigation, mobile first-screen visibility at 390 × 844, route focus, legal chrome, offline demo reload, and metadata.
- `scripts/verify-url.sh http://127.0.0.1:4173/` passed (title, language, main, and image alt text). Browser screenshots at 390 px were inspected for the landing and demo layouts.
- Build size: initial JavaScript gzip 9.90 kB; CSS gzip 5.67 kB. Both are under the static-product budgets.

## Run and deploy

```sh
npm ci
npm test
npm run build
```

Deploy the generated `dist/` directory as the configured static artifact. `public/staticwebapp.config.json` supplies the static host routing and security headers.

## Known gaps

None known. The external Lighthouse CLI could not complete in this container because its Chromium tab crashed; the committed browser/axe suite and build-size checks completed successfully.
