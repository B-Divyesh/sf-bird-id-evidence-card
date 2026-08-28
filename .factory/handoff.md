# Review 4 handoff

## Outcome

Adversarial first-read review 4 is complete. Verdict: **FAIL** with two blocking findings. No product code was modified.

The live first screen, sample demo, real/demo storage isolation, registered claims, main route structure, accessibility, and build all pass. The blockers are documented in `.factory/review-4.md`:

1. `/offline.html` violates the live CSP, renders unstyled with a 17 px recovery target, and lacks the shared metadata/header/footer shell.
2. Previously flagged jargon and inconsistent terms remain in live and reachable state copy, including `field console`, `archive`, `IDs`, `locally`, and the generic dialog heading `Confirm action`.

## Verification performed

- Fresh live Chromium contexts at 390 × 844 and 1440 × 900.
- One-click demo entry, realistic populated first screen, reset, exit, seeded real-data sentinel isolation, and separate `demo:bird-id-evidence-card` storage.
- Live offline reload/editing and same-origin-only request interception.
- Raw and rendered route status/title/h1/metadata checks, History API focus/Back behavior, shared chrome, link crawl, touch targets, and designed 404.
- Playwright axe checks on all six main routes; zero violations.
- Direct `/offline.html` CSP, console, metadata, chrome, and target-size inspection.
- Clean clone `/tmp/bird-review4-clean.ABUpUp`: `npm ci`, all 15 exact `.factory/claims.json` commands independently, then full `npm test`.
- Full suite result: 9 unit tests passed; build verification passed; 43 browser tests passed; one intended desktop skip.
- Build budgets: JS 10,624 bytes gzip; CSS 5,743 bytes gzip; mobile hero 14,501 bytes.
- `./scripts/verify-url.sh https://bird-id-evidence-card.sociobot.in/`: passed.

## Reproduce

```sh
npm ci
npm test
npm run build
npm run test:live -- https://bird-id-evidence-card.sociobot.in /tmp/bird-review-4-live
./scripts/verify-url.sh https://bird-id-evidence-card.sociobot.in/
```

Open `/offline.html` in a fresh browser context with console capture to reproduce F-4-1.

## Next steps

Repair the two findings exactly as specified in `.factory/review-4.md`, add offline-fallback and dynamic-copy coverage, deploy through the factory workflow, and rerun the full adversarial checklist from scratch.
