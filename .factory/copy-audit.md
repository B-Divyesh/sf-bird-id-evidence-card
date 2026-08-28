# Copy audit — polish 5

Checked 2026-08-28. Hyphenated terms count as one word. No public sentence exceeds 22 words. No banned marketing word appears. File-format terms are explained where a visitor chooses an export. The source-backed audit test also covers model labels, limits, dialog, toast, error, offline, and import/export states.

## Landing, workbench, demo, and guide

| Copy | Words | Result |
| --- | ---: | --- |
| Record bird evidence before you log. | 6 | `record-evidence-card` |
| For birders checking an app suggestion against what they saw and heard. | 12 | Pass |
| See a completed uncertain-sighting card. | 5 | Pass |
| Works offline after first visit | 5 | `offline-demo` |
| Stays on this device | 4 | `device-only` |
| Free | 1 | `free` |
| Demo — sample data, nothing is saved. | 7 | `demo-isolation` |
| Name the broad place, not a nest site. | 8 | Pass |
| Coordinates hidden. | 2 | Pass |
| Coordinates are excluded. | 3 | `private-coordinates` |
| Avoid recording nest locations for sensitive species. | 7 | Pass |
| Write only what you noticed: size, shape, flight, bill, plumage, behaviour… | 11 | Pass |
| Specific negatives help too: “no black wing tips visible.” | 9 | Pass |
| Rhythm, pitch, repetition, distance, direction—and whether the caller was visible. | 11 | Pass |
| This is still useful observed evidence. | 6 | Pass |
| Record who suggested it and why it does or does not fit. | 12 | Pass |
| Set your confidence. | 3 | Pass |
| Fits: stiff-winged glide. | 3 | Pass |
| Contradiction: call seemed sharper… | 4 | Pass |
| Link to material you have permission to use. | 8 | Pass |
| The app stores the link as text and does not fetch it. | 12 | `no-audio-fetch` |
| No references linked yet. | 4 | Pass |
| This step is optional. | 4 | Pass |
| What matched or differed? | 4 | Pass |
| What supports or contradicts the leading candidate? | 7 | Pass |
| What would resolve it? | 4 | Pass |
| Your visual and audio notes will appear here. | 8 | Pass |
| A complete card does not confirm the species. | 8 | `no-automatic-identification` |
| It records what you observed and what still needs checking. | 10 | `record-evidence-card` |
| CSV opens in a spreadsheet. | 5 | Explains format |
| Markdown is a shareable text card. | 6 | Explains format |
| A backup saves all cards for moving to another browser. | 10 | `exports` |
| Save your current draft when you want to find it here. | 11 | Instruction |
| Record shape, movement, habitat, and sound before checking the suggestion. | 10 | Instruction |
| Add alternatives, then note what fits and what contradicts each one. | 11 | Instruction |
| Keep the status unresolved until your own evidence supports a change. | 10 | Instruction |
| It records your notes. | 4 | `record-evidence-card` |
| It does not identify birds or download recordings. | 8 | `no-automatic-identification`, `no-audio-fetch` |
| Record shape, movement, habitat, and sound before opening another guide. | 10 | Pass |
| Add at least two candidates when possible. | 7 | Pass |
| Note one fit and one contradiction for each. | 8 | Pass |
| Link to openly licensed recordings or material you own. | 9 | Pass |
| Confirm the caller was likely the bird you saw. | 9 | Pass |
| “Unresolved” is a useful result. | 5 | Pass |
| Only use “verified” when independent evidence supports the identification. | 9 | Pass |
| It records notes and does not identify birds or download recordings. | 11 | `no-automatic-identification`, `no-audio-fetch` |
| Cards are stored in this browser. | 6 | `stored-card-schema` |
| Export a backup before clearing browser storage or changing phones. | 10 | Instruction |
| A private evidence card for uncertain bird sightings. | 8 | Pass |
| Artwork generated for Bird ID Evidence Card. | 7 | `generated-artwork` |

## Dialog, toast, error, update, and offline states

| Copy or tested fragment | Words | Result |
| --- | ---: | --- |
| No connection — your work still saves on this device. | 9 | `offline-demo`; replaces `Offline field mode` |
| Ready on this device | 4 | Pass |
| Saving draft… | 2 | Pass |
| Saved on this device | 4 | `stored-card-schema` |
| Save failed — export this card | 6 | Clear recovery action |
| This browser could not save your changes. | 7 | Clear error |
| Your current work remains on screen; export it before leaving. | 10 | Clear recovery action |
| A card can hold up to 12 candidates. | 8 | `card-entry-limits` |
| A card can hold up to 20 reference links. | 9 | `card-entry-limits` |
| Complete evidence card saved on this device. | 7 | `record-evidence-card` |
| Draft card saved. | 3 | `record-evidence-card` |
| The readiness list shows what is still missing. | 8 | Pass |
| Saved as verified. | 3 | Pass |
| Consider adding an independent reference or reasoning note. | 8 | Instruction |
| Start a new evidence card? | 5 | Action-specific dialog heading |
| Stays under Saved evidence cards. | 5 | Pass; rendered with the card title |
| Has not been saved and will be cleared. | 8 | Warning; rendered with the card title |
| New evidence card ready. | 4 | Pass |
| Delete this evidence card? | 4 | Action-specific dialog heading |
| Restore it only from an exported backup. | 7 | `exports`; replaces `JSON backup` in the dialog |
| Evidence card deleted from this device. | 7 | `delete-card` |
| The card could not be deleted. | 6 | Clear error |
| Try again. | 2 | Clear recovery action |
| Could not read your saved evidence cards for backup. | 9 | Clear export error |
| Existing copies of those cards were replaced. | 7 | Clear import result; rendered with the imported count |
| That file is not a valid Bird ID Evidence Card backup. | 11 | Clear import error |
| No data was changed. | 5 | Clear import result |
| Back online. | 2 | Pass |
| Your cards remained available. | 4 | Pass |
| An update is ready. | 4 | Clear update state |
| Load update | 2 | Result-naming action |
| Sample evidence card reset. | 4 | Clear demo feedback |
| That page is not available offline. | 7 | Offline fallback heading |
| Open your evidence card or the sample sighting. | 8 | Recovery instruction |
| Return to the missing page when you have a connection. | 10 | Recovery instruction |
| Artwork generated for Bird ID Evidence Card. | 7 | `generated-artwork` |

## Privacy and terms

| Copy | Words | Result |
| --- | ---: | --- |
| Your evidence cards stay on this device. | 7 | `device-only` |
| Cards are stored in this browser. | 6 | `stored-card-schema` |
| You do not need an account. | 6 | `no-account` |
| Cards store your entries, a card number, local timestamps, and review status in this browser. | 15 | `stored-card-schema` |
| Entries can include notes, locality, optional coordinates, candidates, and reference links. | 11 | `stored-card-schema` |
| New cards start with locality-only exports. | 6 | `private-coordinates` |
| Coordinates are exported only after you choose Precise and enter both values. | 12 | `private-coordinates` |
| No analytics, ads, remote fonts, or recording links are loaded. | 10 | `no-tracking-or-remote-assets` |
| Download one card for a spreadsheet or as shareable text. | 10 | `exports`; formats explained |
| Download a backup of all saved cards. | 7 | `exports` |
| Delete any card from Saved evidence cards. | 7 | `delete-card` |
| The app stores each reference link as text and does not fetch it. | 13 | `no-audio-fetch` |
| Use evidence cards as notes, not verdicts. | 7 | Pass |
| You decide what to log, share, or submit. | 9 | Pass |
| This tool records the notes you enter; it does not identify birds. | 12 | `no-automatic-identification` |
| Do not record or share sensitive nest locations. | 8 | Pass |
| Check licence terms before adding a recording link. | 8 | Pass |
| Review any export before sharing it. | 6 | Pass |
| Check records against your own observations and the rules of any service you later use. | 15 | Pass |
| Keep a backup before clearing browser storage or changing devices. | 10 | Instruction |
| The app is provided as a free local tool. | 9 | `free`, `device-only` |
| Browser storage and offline support depend on your browser and device settings. | 12 | Limitation |

## README

| Copy | Words | Result |
| --- | ---: | --- |
| Record bird evidence before you log an uncertain sighting. | 9 | `record-evidence-card` |
| For birders checking an app suggestion against what they saw and heard. | 12 | Pass |
| It records notes and does not identify birds. | 8 | `no-automatic-identification` |
| Try the sample bird sighting at bird-id-evidence-card.sociobot.in/demo. | 7 | Pass |
| Keeps observed notes separate from candidate suggestions. | 7 | `separate-observation-and-suggestion` |
| Records locality, visual notes, call notes, candidates, and an unresolved decision. | 11 | `record-evidence-card` |
| Export one card as CSV or Markdown, and saved cards as a JSON backup. | 14 | `exports`; followed by explanations |
| CSV opens in a spreadsheet. | 5 | Explains format |
| Markdown is shareable text. | 4 | Explains format |
| A backup moves all cards to another browser. | 8 | `exports` |
| Works offline after the first visit. | 6 | `offline-demo` |
| Stays on this device. | 5 | `device-only` |
| Stores reference links as text and does not fetch them. | 10 | `no-audio-fetch` |
| New cards start with locality-only exports. | 6 | `private-coordinates` |
| Coordinates export only after you choose Precise and enter two valid values. | 12 | `private-coordinates` |
| Review sensitive wildlife locations before sharing an export. | 8 | Pass |
| Open the local address shown after the development server starts. | 9 | Developer instruction |
| Open `/demo` to use sample data that stays separate from your cards. | 12 | `demo-isolation` |
| Automated product checks and their commands are listed in `.factory/claims.json`. | 10 | Developer documentation |
| Run `npm run build`, then publish `dist/` as the static site root. | 12 | Deployment instruction |
| The build includes route documents, the service worker, `staticwebapp.config.json`, and the designed 404 page. | 14 | Verified build contents |
| Factory infrastructure deploys that output. | 5 | Deployment instruction |
| This repository does not change DNS, hosting, or billing. | 9 | Deployment boundary |
| Use evidence cards as notes, not verdicts. | 7 | Pass |

## Headings, actions, and terminology

Route and landing headings stand alone: `Record bird evidence before you log.`, `Your current evidence card`, `How it works`, `What this tool does not do`, `Your data, on your device`, `Saved evidence cards`, and `Check an uncertain bird in four steps`.

Model-derived readiness labels use the same input terms: `Visual notes` and `Call notes`. The retired `Visual account` and `Audio account` labels do not appear in public source.

Actions name their result: `Try it with sample data`, `Save evidence card`, `Export Markdown`, `Export CSV`, `Export backup`, `Import backup`, `Start a new card`, `Reset demo`, `Start a blank card`, `Open card`, `Delete`, and `Keep card`.

| Concept | One term |
| --- | --- |
| Saved item | evidence card |
| Try-out content | sample data |
| Candidate from an app or person | suggestion |
| Browser persistence | this browser |
| Observed appearance | visual notes |
| Observed sound | call notes |
| Coarse location | locality-only |
| Move all saved cards | backup |
