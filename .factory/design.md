# Bird ID Evidence Card — visual thesis

## Direction: the field naturalist's instrument panel

This product is a **mid-century field instrument**, not another glossy ID app. It borrows the legibility, honest materials, calibration marks, and deliberate controls of a 1950s portable receiver: warm enamel, inked labels, knurled controls, paper notes, and one vermilion signal light. That world suits the job because the app is a tool for weighing evidence, not a machine that pretends to know the answer.

The hierarchy always puts **what I observed** before **what an app suggested**. Confidence is written in words and numbers, location precision is visible, and unfinished records look unfinished. Decorative marks explain evidence, comparison, and uncertainty; there is no generic gradient hero.

## Palette

Daylight treatment (default):

- `paper #F1E9D5` — field-card background
- `panel #E1D5B8` — enamelled instrument surface
- `panel-deep #C9B993` — recessed controls
- `ink #1D2823` — near-black green, 12.2:1 on paper
- `ink-muted #566158` — secondary ink, 5.3:1 on paper
- `pine #174D3C` — primary action and verified observation
- `signal #A53B2A` — selected/attention indicator, never the only cue
- `amber #7B5512` — uncertainty/warning
- `danger #8E2F26`, `success #235D43`

Night treatment (`prefers-color-scheme: dark`):

- `background #151C19`, `surface #202A26`, `surface-raised #293630`
- `text #F2E8CF`, `muted #B7BEAD`
- `accent #E28A63`, `pine-bright #78B493`

All body-text pairs meet WCAG AA. Status always includes text or an icon as well as color.

## Typography

- Display/labels: **Arial Narrow**, `Roboto Condensed`, `Franklin Gothic Medium`, system sans-serif. Uppercase is limited to short dial labels and section eyebrows, with generous tracking.
- Body/data: **Georgia**, `Charter`, serif for a field-journal voice; controls fall back to system sans where compact scanning matters.
- No remote fonts. The system pairing keeps first load fast and makes the utility available offline without font failure.
- Scale: 12 / 14 / 16 / 20 / 28 / clamp(36–58) px; body is 17 px with 1.55 line height. Measurements and dates use tabular figures.

## Spacing and structure

An 8 px base rhythm with 4 px optical adjustments. Content is capped at 1180 px and uses a 7/5 desktop split: the form is the working console, while a sticky “card readout” previews the portable record. At 760 px the readout stacks beneath the editor; no controls are hidden. Touch targets are at least 44 px with 8 px separation.

Corners are modest (2–12 px), borders are inked, and shadows resemble a case lifted from a table. Cards are reserved for independently saved sightings; form sections are grouped by proximity and divider rules rather than nested cards.

## Interaction grammar

- A six-position evidence rail (Context → Look → Listen → Candidates → References → Decision) shows progress and jumps to sections.
- Controls depress by 1 px like physical switches; selected segmented controls fill with pine and retain a written label.
- Autosave uses an explicit readout (`Saved locally · 14:32`) so ownership and persistence are clear.
- Candidate confidence is a calibrated range with a live numeric and verbal readout.
- Exports are generated on-device. Location detail defaults to **Private / locality only**; precise coordinates require a deliberate choice and warning.
- Delete requires a confirmation naming the record. Import validates format before writing and reports skipped records.

## Motion policy

Transitions last 160–240 ms and use only opacity/transform: panels settle a few pixels from their origin, save status fades, and toasts rise from the bottom edge. Nothing loops. Under `prefers-reduced-motion: reduce`, smooth scrolling is disabled and movement becomes an instant opacity/state change.

## Original asset plan and provenance

Hero asset: a square editorial still life of a fictional compact field receiver, evidence card, pencil, small binocular silhouette, and feather-shaped sound waveform on a wooden hide shelf. It establishes comparison and recording without implying that the product identifies birds. Used as a compact hero panel and PWA/social artwork.

Prompt sheet:

> Mid-century naturalist field instrument panel still life, compact olive enamel portable receiver with analog meter and blank unlabelled dials, cream evidence index card with abstract tick marks only, graphite pencil, small vintage binocular silhouette, subtle feather-shaped sound waveform diagram, wooden bird-hide shelf, restrained 1950s scientific editorial illustration, screenprint and gouache texture, warm overcast window light, shallow three-quarter view, palette of parchment, pine green, oxidized brass, vermilion signal red, charcoal ink; precise functional composition, generous quiet space; no readable text, no letters, no numbers, no watermark, no logos, no brand marks, no real species depiction, no people, no gradient, no glossy 3D app interface.

- Generated through the factory Azure image model (`factory-image`) on 2026-08-28.
- Original generated asset; no third-party image or trademark is included.
- The selected source and prompt sidecar live in `assets/src/`; optimized WebP/AVIF output lives in `public/assets/`.
- App icons are original hand-authored SVG/PNG derivatives of the product's calibration-mark motif.

## Why it is distinct

Most bird tools lead with a species photo and a confident result. This one leads with a paper-like observation record and a literal comparison meter. The bounded palette, type contrast, ruled sections, mechanical micro-interactions, and privacy shutter make uncertainty feel rigorous rather than unfinished.
