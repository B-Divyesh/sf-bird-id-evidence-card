# Polish 2 — finding closure map

Scope: release-candidate repair from reviews 1 and 2. Evidence screenshots: `/tmp/bird-polish2-home.png` and `/tmp/bird-polish2-demo.png` (390px-equivalent Pixel 5 captures). Local route checks used `scripts/verify-url.sh`; post-deploy checks are recorded in the handoff.

| Finding | Change made | Evidence |
| --- | --- | --- |
| R1-B1 | Kept the plain first-screen job, audience, sample action, outcome text, and three facts. | `first phone screen states the job, audience, action, and outcome`; home screenshot. |
| R1-B2 | Kept `/demo` and `?demo=1`, separate `demo:` IndexedDB, completed Deerness sample, persistent banner, reset, and real-workspace exit. | `@claim:demo-isolation`; `@claim:offline-demo`; demo screenshot. |
| R1-B3 | Added the complete claim registry and one uniquely tagged test per claim. | Clean-clone registry sweep; `rg @claim:` returns one tag per registry id. |
| R1-B4 | Built real static `/demo`, `/records`, and `/guide` route shells; app updates title, metadata, focus, and announcement. Retained the styled host 404. | `routes use meaningful titles and navigation restores focus`; build inspection of `dist/{demo,records,guide}/index.html`. |
| R1-H5 | Added route-shell metadata, canonical URLs, Twitter/OG image, 1200×630 social crop, consistent legal chrome, SVG favicon/apple icon, factory footer, and build id. | `legal documents have common chrome and metadata`; generated route-shell inspection. |
| R1-M6 | Rewrote README and audited landing text; uses `evidence card` consistently and moves technical detail out of visitor copy. | `.factory/copy-audit.md`; README review. |
| R1-M7 | Replaced ambiguous route and section names with standalone headings and result-naming links. | Browser route/focus test; screenshot. |
| R2-B1 | Playwright now builds before previewing, so every listed Playwright claim command works from an empty `dist/`. Corrected the Vitest claim command to use `-t`. | Fresh clone `/tmp/bird-clean-final-3CISS2`; all 13 exact registry commands passed. |
| R2-B2 | Non-home routes hide the landing masthead, render their own visible `<h1>`, scroll to the top, focus that heading, and announce it. Demo uses a visible route heading. | `routes use meaningful titles and navigation restores focus`; `/demo` screenshot. |
| R2-H3 | Registered and tested record entry, observation/suggestion separation, no automatic identification, storage schema, remote-asset privacy, and generated-art provenance. Removed the untestable causal wording. | `@claim:record-evidence-card`, `@claim:separate-observation-and-suggestion`, `@claim:no-automatic-identification`, `@claim:stored-card-schema`, `@claim:no-tracking-or-remote-assets`, and `@claim:generated-artwork`. |
| R2-H4 | Strengthened demo isolation to seed and snapshot a real sentinel database before demo edit/save/reset/exit, then compare it byte-for-byte. | `@claim:demo-isolation keeps a seeded real database unchanged`. |
| R2-M5 | Added route-specific static HTML shells plus runtime canonical/description/OG/Twitter updates and a 1200×630 original-art social card. | `dist/demo/index.html`, `dist/records/index.html`, `dist/guide/index.html` inspection. |
| R2-M6 | Made demo controls, legal footer links, and recovery actions at least 44px tall. | Mobile screenshots and `accessibility and keyboard baseline pass in both color treatments`. |
| R2-M7 | Standardized legal/404 header and footer links; guide panel is a normal section rather than a nested complementary landmark. | Axe test in `accessibility and keyboard baseline pass in both color treatments`; legal test. |
| R2-M8 | Added a strict same-origin Content-Security-Policy to `staticwebapp.config.json`. | Production config inspection; browser suite reports no console/CSP errors. |
| R2-min9 | Replaced the invalid personal-notes URL with a Northern Fulmar xeno-canto catalogue reference and licence/comparison context, while preserving no-fetch behavior. | `@claim:no-audio-fetch`; demo screenshot. |
| R2 copy audit | Changed `Privacy shutter on`, `Decision`, `Live card readout`, `Field record`, `Start for real`, `Cancel`, guide jargon, and inconsistent sample terms. | `.factory/copy-audit.md`; current UI screenshot. |

No review finding is deferred.
