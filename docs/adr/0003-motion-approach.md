# ADR 0003: How the drawn-in sketches and custom cursor are built

Status: Proposed (the human decides)

## Gap
`docs/spec.md` lists animation wrappers but names none. The design needs scroll-drawn SVG, a crosshair cursor with a live readout, tilt and peel cards, and kinetic headline text.

## Proposal
Create these wrappers in `src/components/animations/` (the only place that imports `framer-motion`, `ST-02`):
- `DrawOnScroll`: animates an SVG path's `pathLength` from scroll progress.
- `ScrollRuler`: the side progress ruler.
- `CrosshairCursor`: pointer-following cursor with x/y readout. Renders only when the device has a fine pointer and reduced motion is off.
- `TiltCard`: tilt and corner peel on hover and focus.
- `KineticHeadline`: letters settle from a scatter. `WordSwap`: tagline words rotate on a timer.

Every wrapper reads one shared `useReducedMotion` helper and renders its finished state when motion is reduced (`A11Y-03`).

## Why
One place for motion makes reviews easy and keeps pages thin (`ST-04`). Drawing paths with `pathLength` needs no extra library.

## Consequences
Sketches are hand-made inline SVGs, which is the main effort. Add a `docs/spec.md` line listing the wrappers once approved. Full flow for the first wrapper (new pattern); later wrappers copy the first one.
