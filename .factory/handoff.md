# Review 3 handoff

## Completed

- Performed the requested adversarial first-read review without modifying product code.
- Wrote `.factory/review-3.md` with the full copy audit, live demo/offline/privacy checks, clean-clone claim results, prior-finding verification, and structure review.

## Verification

- Clean clone: `/tmp/bird-review-3.3ClPNY`; `npm ci` completed successfully.
- All 13 exact commands listed in `.factory/claims.json` passed independently from that clone.
- Live mobile and desktop cold first-read checks passed. Live demo isolation, reset, offline reload, and same-origin-only request checks passed.
- Focused route/accessibility/legal suite passed 6/6. `scripts/verify-url.sh` passed against the live root.

## Known gaps

- Review verdict is **FAIL**. See `.factory/review-3.md` for blocking findings: four static `<h1>` elements per app route; unlisted/under-proved privacy and audio claims; and inconsistent app/legal navigation plus build IDs. A minor export-format jargon finding also remains.
