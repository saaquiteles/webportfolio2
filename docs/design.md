# Design: Lab Notebook (APPROVED direction, details are first drafts)

Chosen by the human from three options. Palette contrast ratios were computed by the `designer` agent with the WCAG formula; re-check them when the tokens are first wired up.

## Concept
A warm paper notebook with a graph-paper grid and sticker-like labels. The quirky doodles are drawn with precise engineering marks: arrows, measurements, margin notes. Playful on the surface, technical underneath.

## Palette (Tailwind theme tokens, `ST-05`)
| Token | Hex | Use |
|---|---|---|
| `paper` | `#FBF5E9` | Page background |
| `surface` | `#FFFFFF` | Cards, labels |
| `ink` | `#1E1B18` | Text |
| `tomato` | `#C8321E` | Accent |
| `blueprint` | `#1F5FA8` | Secondary accent, grid and annotation marks |

Contrast (from the designer agent, all pass AA including small text): ink on paper 15.79, ink on surface 17.14, tomato on paper 4.92, blueprint on paper 5.93.
Grid lines behind text stay very faint so they never hurt legibility (`A11Y-05`).

## Type
- Headings: Bricolage Grotesque (SIL OFL)
- Body: Inter (OFL)
- Mono (annotations, labels, cursor readout): JetBrains Mono (OFL)

## Home page hero
A graph-paper page with a huge headline and a hand-drawn arrow pointing at the tagline. Small mono margin notes read like "fig. 1". Project cards sit taped on at slight angles.

Placeholders (never invent facts about the human, see `portfolio-safety.md`):
- Headline: `TODO(human): headline`
- Tagline: `TODO(human): tagline`
- Margin notes: `TODO(human): fig. 1 caption`
- Project cards: `TODO(human): project title` (replace once the resume arrives)

## Motion
| Priority | What it does |
|---|---|
| Scroll storytelling | The page is a notebook. Sections "draw in" as ruled lines and sketches animate along their paths while you scroll. A progress ruler runs down the side. |
| Cursor and hover | A small crosshair cursor with a live x/y readout in mono. Cards tilt and peel a corner on hover. |
| Kinetic typography | Headline letters settle from a slight scatter into place. Words in the tagline swap on a timer. |

All motion lives in wrappers under `src/components/animations/` (`ST-02`).

## Fallbacks
| Situation | Behaviour |
|---|---|
| `prefers-reduced-motion` (`A11Y-03`) | Drawings appear complete, text fades in, cursor stays the default, tilt and peel removed, the tagline stops swapping. |
| Touch device (no cursor) | No custom cursor. Cards get a tap highlight. Scroll effects stay, simplified. |
| Keyboard focus (`A11Y-02`) | Every hover effect also triggers on focus, with a visible focus ring. |

## Risks to watch
- Lots of SVG drawing is the most effort. Start with a few reusable sketches.
- Faint grid behind text: test legibility on real screens.
- Test scroll effects on a mid-range phone before adding more.

## Not yet decided
- Dark theme (R-10, "should have"): see `.claude/logs/adr-drafts/0004-dark-theme.md`.
- Real name, tagline, projects and photos: waiting on the human's resume.
- Hosting: undecided. Default is no `basePath`, controlled by one env var.
