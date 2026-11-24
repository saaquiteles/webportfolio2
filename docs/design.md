# Design: Lab Notebook (APPROVED direction, details are first drafts)

Chosen by the human from three options. The look was drawn as a comp (a visual mock-up) and approved on 2026-10-27; the tokens live in `src/app/globals.css`, which is the source of truth for the hex values.

## Concept
A warm paper notebook with a graph-paper grid and sticker-like labels. The quirky doodles are drawn with precise engineering marks: arrows, measurements, margin notes. Playful on the surface, technical underneath.

## Palette (Tailwind theme tokens, `ST-05`)
| Token | Hex | Use |
|---|---|---|
| `paper` | `#FBF5E9` | Page background |
| `surface` | `#FFFFFF` | Cards, labels |
| `ink` | `#1E1B18` | Text |
| `tomato` | `#C8321E` | Accent (underlines, graphics) |
| `blueprint` | `#1F5FA8` | Links, secondary accent, focus ring, tape |
| `muted` | `#5C544B` | Secondary text (years, captions) |
| `rule` | `#D8CDB8` | Card borders, dividers |
| `grid` | `#E4E7EC` | Graph-paper lines on the body |

`muted`, `rule` and `grid` are derived tokens added while building. They are not in the first palette.

Contrast ratios, recomputed on 2026-11-08 from the hex values above with the WCAG relative-luminance formula (AA needs 4.5 for body text, 3 for large text and graphics):

| Text on background | Ratio | Verdict |
|---|---|---|
| ink on paper | 15.79 | passes |
| ink on surface | 17.14 | passes |
| ink on grid | 13.83 | passes |
| muted on paper | 6.85 | passes |
| muted on surface | 7.43 | passes |
| muted on grid | 6.00 | passes |
| blueprint on paper | 5.93 | passes |
| blueprint on surface | 6.44 | passes |
| blueprint on grid | 5.20 | passes |
| tomato on paper | 4.92 | passes |
| tomato on surface | 5.34 | passes |
| tomato on grid | 4.31 | fails for small text |

Tomato is not used as body text. Over the grid it falls under 4.5, so it stays an underline, a rule or a graphic. `rule` on paper is 1.45, which is fine because it is a decorative border and no text sits in it.
The grid lines stay very faint so they never hurt legibility (`A11Y-05`). The grid is a 32 px square, drawn as a body background with two linear gradients.

## Type
- Headings: Bricolage Grotesque (SIL OFL)
- Body: Inter (OFL)
- Mono (annotations, labels, cursor readout): JetBrains Mono (OFL)

## Home page hero
A graph-paper page with a huge headline and a hand-drawn arrow pointing at the tagline. Small mono margin notes read like "fig. 1". Project cards sit taped on at slight angles.

Copy (text approved by the human; never invent facts about the human, see `portfolio-safety.md`). It lives in `src/data/profile.ts` and `src/data/projects.ts`, which are the source of truth:
- Headline: "I build full-stack apps with Spring Boot and React."
- Tagline: "Programmer/Analyst · Spring Boot, React and React Three Fiber · Metro Manila"
- Project cards: the real project titles, thesis first (see `src/data/projects.ts`)

Still a placeholder until the human supplies the text:
- Margin notes: `TODO(human): fig. 1 caption` (deferred until the human supplies the text)

## Approved comp decisions (2026-11-08)
- Page width 1120 px (the `page` container token, 70rem).
- Grid 32 px, drawn on the body.
- Headings are bold Bricolage Grotesque with tight letter spacing. Base sizes: h1 2.875rem, h2 2rem (2.5rem from 768 px), h3 1.625rem. The project-card title is 24 px (`text-2xl`) at every width, by the human's choice.
- Borders: the comp draws 1.5 px borders. The build uses `border-2` (2 px), because `ST-05` forbids arbitrary values such as `border-[1.5px]`. If the 0.5 px ever matters, add a border-width token instead.
- No dark theme (ADR 0004).

## Project cards
- A white `surface` card with a `border-2 border-rule`, padding, and a translucent blueprint tape strip (`Tape`, `bg-blueprint/30`, slightly rotated) at the top.
- In the grid the cards alternate `rotate-1` and `-rotate-1` (at most 2 degrees), so they look taped on by hand.
- Content order: year line (mono, `muted`), title link, summary, tags, then repository and paper links when present.
- Tags are stickers: a `surface` fill, a 1 px ink border, mono text.
- Home holds the grid (`ProjectGrid`) with every project and its Pick up button.

## 3D tilt on project cards
`TiltCard` (`src/components/animations/TiltCard.tsx`) wraps each card. ADR 0003 is partly accepted: `TiltCard`, `ScrollRuler` and `KineticHeadline`; the crosshair cursor, the word swap and scroll-driven drawing are still Proposed. `framer-motion` stays inside `src/components/animations/` (`ST-02`).
- With a fine pointer, the card tilts toward the pointer in 3D (at most 10 degrees) and its shadow grows with the lift (`Elevation`: one spring drives the lift and the shadow's opacity, so the shadow never switches on in one frame). It settles when the pointer leaves.
- Keyboard focus on the title link gives an equivalent lift, and the focus ring stays visible.
- With reduced motion, or on touch (no fine pointer), the visitor gets the static card with no transform (`A11Y-03`).

## Pick up a project note (S7, ADR 0028 Accepted)
On Home each project card has a "Pick up" button. It is in the static HTML as `hidden` and is shown only after the page hydrates, so a visitor without JavaScript never sees a dead control. The title link still opens the case study.
- **Overlay.** Pick up opens a native `dialog` (`ProjectOverlay`) with the project's year, title, summary, tags, repository and paper links, and a "Read the full case study" link. It shows only data that already exists. "Put back", Escape and a click on the backdrop close it; a click inside the panel does not. Focus moves to "Put back" on open and returns to the Pick up button on close. The page behind is inert and its scroll is locked in CSS (`html:has(dialog[open])`, with `scrollbar-gutter: stable` on `html`). No history entry is added.
- **Flight (pick up).** A paper sheet inside the dialog starts at the card's measured place. The card dips, one tape end peels to about 50 degrees, the sheet lifts with a growing shadow, swings toward the viewer with a small overshoot and lands in the panel (about 0.8 s after the click). The details fade in after it lands, so text never scales. The grid card goes invisible but keeps its space.
- **Flight (put back).** The sheet flies back to the card's current place, measured again at close time, turns to the card's resting tilt, its shadow shrinks and the tape presses flat. The dialog closes only after it lands (about 0.8 s). Extra presses during the return are ignored, a close during the opening reverses from where the sheet is, and a bare browser `close` event resets everything at once.
- **Neighbours make room.** When a card is lifted by hover or focus, the other cards ease up to 6 px away from it (measured from the real card centres, so it is vertical in one column) and drift back. It is translate only, on the same wrapper as the tilt (`NeighbourField` and `useMakeRoom`), so the grid items and their tilt classes are unchanged. Nothing moves under reduced motion or touch, and the field pauses while the overlay is open (it reads that from `PickupBoard`). After the overlay closes, the focused Pick up button lifts its card but the neighbours stay at rest until the next lift.
- **Only transforms and opacity**, springs, `framer-motion` plus CSS 3D. No React Three Fiber and no new dependency.
- **Reduced motion:** the overlay opens and closes at once, with no flight (the pickup is still available). **Touch:** the cards do not tilt, lift or make room, but the flight still plays when Pick up is tapped (a tap is not a hover). **No layout or zero-size card:** the overlay opens at once.
- Files: `PickupBoard` (button and open state), `ProjectOverlay` (dialog and both flights), `Elevation` (lift and shadow spring), `NeighbourField` (the neighbours' room, `useMakeRoom`), `TiltCard` (tilt, lift and the card's part in the neighbour field), `useMediaQuery` (the shared media-query hook under the reduced-motion and fine-pointer hooks), and `ProjectDetail` (the overlay's content), in `src/components/animations/` and `src/components/sections/`.

## About photo
The profile photo is a taped print: a `surface` frame with `border-2`, a slight `rotate-1` and tape on top. The file and its alt text are the ones the human approved.

## Case-study body (MDX map)
`MdxContent` passes a `components` map to the compiled MDX (`src/components/sections/MdxContent.tsx`), so case studies are styled with token classes and standard utilities, not hand-written CSS: `h2` gets a tomato top rule, lists get bullets or numbers with spacing, links are blueprint and underlined. The body is capped at `max-w-prose`.

## Motion
Shared rule (ADR 0023): the static HTML and the first browser render are the finished state. Motion only starts after the page has hydrated and only when the visitor allows it, so without JavaScript, before hydration and with reduced motion the page looks complete.

Built (S6, M1 to M5):
| Piece | What it does |
|---|---|
| 3D tilt on project cards | `TiltCard`, described above. |
| Scroll progress ruler | `ScrollRuler`: a thin bar at the left edge of Home that fills as you scroll. Decorative (`aria-hidden`). Hidden under reduced motion. |
| Hero arrow draw | `SketchArrow` with `drawIn` draws on load with a CSS stroke animation (`sketch-draw` in `globals.css`). |
| Headline settle | `KineticHeadline`: the letters settle into place with a CSS animation (`kinetic-settle`). The full sentence stays in the page for screen readers. |
| Pointer depth on the hero | `PointerDepthField` with `PointerDepthLayer`: the headline drifts 4 px, the name tag 8 px and the arrow 12 px with the pointer. Translate only. |

Built (S7, physical interactions part 1; described under "Pick up a project note" above):
| Piece | What it does |
|---|---|
| Shadow follows the lift | `Elevation`: the card's shadow grows and shrinks with the lift spring. |
| Pick up and put back | `PickupBoard` and `ProjectOverlay`: the note flies from its card into an overlay and back. |
| Neighbours make room | `NeighbourField`: the cards next to a lifted card ease up to 6 px away. |

Not built yet (see "Next motion story" in `docs/follow-ups.md`):
| Piece | Plan |
|---|---|
| Crosshair cursor | An overlay with a live x/y readout; the normal cursor is kept. |
| Tagline word swap | Cycles only the three stack names already in the tagline. |
| Page transitions | Probably enter-only, decided after a spike. |
| Card corner peel | Not started. |
| Scroll-driven draw | A `framer-motion` wrapper for later sketches. |

All `framer-motion` code lives in wrappers under `src/components/animations/` (`ST-02`); the arrow draw and the headline settle are plain CSS.

## Fallbacks
| Situation | Behaviour |
|---|---|
| `prefers-reduced-motion` (`A11Y-03`) | The finished static state: the arrow is fully drawn, the headline is in place, the ruler is hidden, there is no tilt and no depth drift. Pick up still opens the overlay, instantly and with no flight. |
| Touch device or no fine pointer | The static hero and static cards: no tilt, no depth effect, no shadow change. The scroll ruler stays. Pick up still works. |
| Keyboard focus (`A11Y-02`) | Every hover effect also triggers on focus, with a visible focus ring, except the pointer depth effect. That one is decorative: it carries no information and no action, so a keyboard visitor loses nothing. |

## Risks to watch
- Lots of SVG drawing is the most effort. Start with a few reusable sketches.
- Faint grid behind text: test legibility on real screens.
- Test scroll effects on a mid-range phone before adding more.

## Not yet decided
- Dark theme (R-10, "should have"): see `docs/adr/0004-dark-theme.md`.
- Hosting: deploying to GitHub Pages is on hold. The `basePath` is set by one env var (`NEXT_PUBLIC_BASE_PATH`, read in `next.config.mjs`); unset or empty means no prefix.
