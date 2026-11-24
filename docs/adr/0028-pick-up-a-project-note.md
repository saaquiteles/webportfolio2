# ADR 0028: Pick up a project note

Status: Accepted by the human on 2026-11-24. Raised on 2026-11-24, at the end of story S7 (physical interactions, part 1).

## Decision
A project card on Home can be picked up: a Pick up button opens the project's details in an overlay, and the card's paper flies into the overlay and back. It is built with CSS 3D and `framer-motion` only, on a native `dialog`, with no new dependency.

## Gap
The human asked for a portfolio that feels like handling paper, starting with the project cards. `docs/spec.md` and ADR 0003 allow motion but do not describe an overlay, a flight between two places, or the scroll lock the overlay needs. ADR 0023 says the static HTML and the first render are the finished state. The pickup must respect that.

## Proposal
- **Overlay.** A native `dialog` opened with `showModal`. It shows only data that already exists (year, title, summary, tags, repository and paper links) and a "Read the full case study" link. The browser makes the page behind inert and handles Escape. "Put back", Escape and a backdrop click close it. Focus moves in on open and returns to the Pick up button on close. No history entry is added.
- **Static first.** The Pick up button is in the static HTML as `hidden` and is shown after hydration. With JavaScript off the title link still opens the case study. The dialog is mounted only after a click, so the server HTML has no dialog.
- **Flight.** A paper sheet inside the dialog starts at the card's measured box and lands in the panel by springs, then the details fade in. Put back runs the same flight in reverse to the card's place, measured again at close time, and the dialog closes only after it lands. Only transforms and opacity change. Text never scales.
- **Reduced motion and touch.** Reduced motion opens and closes the overlay at once, with no flight. Touch gets no tilt or shadow change; Pick up still works.
- **Shadow.** The card's shadow is a layer whose opacity follows the lift spring (`Elevation`), so it grows and shrinks with the card instead of switching on in one frame.
- **Scroll lock in CSS.** `html:has(dialog[open])` hides overflow, and `scrollbar-gutter: stable` on `html` stops the page from jumping sideways when the scrollbar goes. The gutter applies to every page.
- **No 3D library.** React Three Fiber and WebGL are not used. Revisit only if a later interaction cannot be done with transforms.

## Why
A native `dialog` already gives focus handling, an inert background and Escape, which is less code to get wrong than a custom overlay. Measuring the card at open and at close lets the paper land exactly where the card really is, even after a scroll or resize. Keeping the button and the dialog out of the static HTML keeps ADR 0023 true.

## Consequences
- Home is heavier: the pickup code and `framer-motion` load there. The Lighthouse baseline before the pickup was 88 for the page that held it, measured on 2026-11-13 (77, 88, 88). The target is no worse than that, with accessibility at 100. The comparison is the human's run at the end of S7.
- `scrollbar-gutter: stable` reserves the scrollbar width on every page with a classic scrollbar. The human chose to keep it (2026-11-13).
- jsdom has no layout, so the tests inject card and panel boxes and prove the order of operations, not the look. The feel, the arc and the alignment at landing are checked by the human in a real browser.
- Safari and Firefox behaviour for a fixed child inside a top-layer dialog is reasoned, not tested.
- The later interactions (blueprint unfold, page turn, Experience folder, Skills stickers, résumé pull-out, Contact writing) are separate stories and are listed in `docs/follow-ups.md`.
- Code added by the agent (all tracked): `src/components/animations/PickupBoard.tsx`, `ProjectOverlay.tsx`, `Elevation.tsx` and their tests; `src/components/sections/ProjectDetail.tsx`; `src/app/globals.css` (the scroll lock) and its test. The agent did not edit `docs/spec.md`, `docs/glossary.md` or any other ADR's status.
- Words proposed for `docs/glossary.md` (the human decides; the agent has not added them):

| Term | Meaning | Avoid |
|---|---|---|
| Project card | One project's card in the Home grid (`ProjectCard` inside `TiltCard`): year, title link, summary, tags and links. | tile, box |
| Pickup | The Pick up button and the flight that opens a project's details in the project overlay, and the flight back (Put back). | zoom, lightbox |
| Project overlay | The native `dialog` that shows a picked-up project's details. | modal, popup |
| Elevation | How far a card is lifted: one spring that drives its scale and its shadow's opacity. | depth, z-level |
| Sheet | The paper that flies between the card and the project overlay during a pickup. | ghost, clone |
