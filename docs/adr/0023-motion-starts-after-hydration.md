# ADR 0023: Motion starts after hydration

Status: Accepted by the human on 2026-11-09. Raised by the S6 motion plan (module M1).

## Decision
The static HTML and the first browser render are always the finished state (no motion, no pointer effects); motion starts only after hydration.

## Gap
Hydration is the moment the browser attaches React to the HTML that the static build already made. React expects the first browser render to match that HTML exactly. If it does not, React throws the HTML away, renders again and logs an error (a hydration mismatch).

The shared helper `useReducedMotion` used `framer-motion`'s hook. During the static build that hook knows nothing about the visitor, so we treated it as "reduce". In the browser it appears to read the setting at once and say "motion allowed" for most visitors (checked in the library code, not yet in a real browser). A wrapper that draws different markup for those two answers (for example a ruler that exists only when motion is allowed) would cause a mismatch. The hook also never noticed a change of the setting while the page was open.

`TiltCard` avoided the problem only because its fine-pointer check already used `useSyncExternalStore` with a server value of `false`.

## Proposal
- `useReducedMotion` uses `useSyncExternalStore`. Its server value is `true` (reduce). It also returns `true` when `window.matchMedia` does not exist. Otherwise it follows the `(prefers-reduced-motion: reduce)` setting, listens for changes and removes the listener on unmount. It no longer imports `framer-motion`.
- The fine-pointer check moves from `TiltCard` into one shared hook, `useFinePointer`, with a server value of `false`.
- Every animation wrapper reads these two hooks, so the build, the hydration and the first browser render all show the finished state. React then re-renders with the real values.

## Why
`useSyncExternalStore` is made for this: React uses the server value while hydrating and switches to the live value right after, so there should be no mismatch (not yet confirmed in a real browser). It is the pattern `TiltCard` already follows. The finished state is also what a visitor with JavaScript off, or with reduced motion on, should see (A11Y-03).

## Consequences
- Cost: an animation that plays on load cannot start before hydration without a flash, because the HTML already shows the finished state and the animation would then jump back to its start. For that reason the headline and the hero arrow use a CSS animation, which runs from the first paint and needs no hydration (ADR 0025, planned and not yet written).
- In tests, jsdom has no `matchMedia`, so it now counts as "reduce". A test that needs motion allowed must stub `matchMedia`.
- Wrappers that react to scroll or pointer appear a moment after the page loads, not in the HTML.
- Rollback: `git revert` the module commit. The helpers go back to the old code. No config or workflow changes, nothing deployed.
