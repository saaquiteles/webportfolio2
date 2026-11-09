# ADR 0024: Pointer depth on the Home hero

Status: Proposed. Raised by the S6 motion plan (module M5).

## Decision
The Home hero has a depth effect: the name tag, the headline and the arrow drift by small, different amounts as the pointer moves, but only with a fine pointer (a mouse or trackpad) and when the visitor allows motion.

## Gap
ADR 0003 asks for a motion-heavy site. The hero is the first thing a visitor sees, and it is flat. ADR 0023 says the static HTML is the finished state and motion starts after hydration (the moment the browser attaches React to the HTML).

## Proposal
- A `PointerDepthField` listens for pointer movement on the window and turns the position into two numbers from -1 to 1, measured from the middle of the viewport. A `PointerDepthLayer` moves its content by that number times its strength, in pixels.
- Strengths: headline 4 px, name tag 8 px, arrow 12 px. The headline moves least, the arrow most.
- Layers only translate (move sideways and up or down). No rotation, no perspective. A layer never moves more than 12 px, even if asked.
- The movement goes through a spring (a soft follow-along) and does not use React state, so there is no re-render on each move.
- When the pointer leaves the window, the layers settle back to 0.
- The drift sits on an outer wrapper, so the name tag keeps its own tilt.
- With reduced motion, or without a fine pointer (touch), the field attaches no listener and the layers are plain elements: the static hero (ADR 0023).
- No keyboard equivalent. The effect is ambient decoration: it has no control, no focus target and no information, so a keyboard visitor loses nothing.

## Why
12 px is the largest drift that stays inside the 16 px page gutter at a 360 px window, so it cannot cause sideways scrolling. It is also small enough not to hurt readability. Only translating keeps the text sharp and cheap to draw. Putting the effect on the window, not on the hero, lets the whole page feel connected to the pointer.

## Consequences
- Another `framer-motion` user inside `src/components/animations/` (ST-02), no new dependency.
- The feel, the order and the amounts are judged by eye in a browser, not by a test.
- The tree keeps one shape in every state (server, first render, reduced motion, touch, active): the field always renders the same provider and every layer is always the same `motion.div`. Only the numbers and the listeners change. If the shape changed after hydration, React would rebuild the hero, and the headline and arrow CSS animations would play again. At rest framer-motion writes `transform: none`, which moves nothing.
- `mouseleave` on the document is not reliable in every browser (Safari). After the pointer leaves the window the layers may stay offset until the next move. This is cosmetic.
- Rollback: `git revert` the module commit. The hero goes back to the static layout. No config or workflow changes, nothing deployed.
