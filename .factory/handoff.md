# Bird ID Evidence Card — review 1 handoff

## Status: FAIL

Completed the requested adversarial first-read review without modifying product code. The full review is in [`.factory/review-1.md`](review-1.md).

## What was verified

- Fresh live Chromium contexts at 390 × 844 and 1280 × 900, including the pre-scroll phone screen.
- `/demo`, `/?demo=1`, Privacy, Terms, a non-existent route, root links, title/metadata, and normal offline/same-origin behavior.
- A clean local clone at `/tmp/bird-review-Z7Pe7i`: `npm ci` and `npm test` passed; its final Playwright status was `passed`.

## Release blockers

1. The first screen has no plain job statement, named audience, or primary first action.
2. No isolated sample-data demo exists; `/demo` and `?demo=1` open the ordinary empty workspace.
3. `.factory/claims.json` and `@claim:` sandbox tests are absent while public claims remain on the landing page and README.
4. Meaningful product destinations are fragment-only and a nonexistent URL returns the normal app with HTTP 200 rather than a designed 404.

## Left intentionally unchanged

Only this handoff and `.factory/review-1.md` were added. No product, test, deployment, or configuration files were changed.

## Next verification

After the blockers are repaired, run the demo entry point from a fresh browser context, execute every command in the new `.factory/claims.json`, confirm demo storage does not affect real storage, then rerun `npm test` and the live first-read review.
