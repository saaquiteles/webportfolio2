# ADR 0025: CSS for the headline and the hero arrow

Status: Proposed. Raised by the S6 motion plan (module M3; the headline part is built in M4).

## Decision
The Home headline settle (built in M4) and the hero arrow drawing (built in M3) use a CSS animation that only runs when the visitor allows motion, not `framer-motion`.

## Gap
ADR 0023 says the static HTML and the first browser render always show the finished state, and motion starts only after hydration (the moment the browser attaches React to the HTML). An animation that plays on load then has a problem. The HTML already shows the finished arrow. If JavaScript started the drawing after hydration, the arrow would jump back to empty and draw again, a visible flash.

ADR 0003 also says the arrow draws "from scroll progress". The hero arrow is above the fold, so most visitors never scroll before they see it. "On load" is the real trigger.

## Proposal
- The hero arrow gets one optional prop, `drawIn`. It sets `pathLength="1"` on the two paths and adds the class `sketch-draw`.
- `globals.css` holds the keyframes and the class inside `@media (prefers-reduced-motion: no-preference)`. The shaft draws first, then the head, about 0.9 s in total.
- With reduced motion, or with JavaScript off, there is no animation and no dash style. The arrow is simply drawn.
- The Home headline settle (M4) follows the same rule.
- The `framer-motion` `DrawOnScroll` wrapper is still planned for sketches further down the page, in a later story. ADR 0003 is not edited here.

## Why
CSS runs from the first paint. It needs no hydration logic, no flash handling and no JavaScript. Putting it inside the media query means reduced motion cannot get it by mistake (A11Y-03). A stylesheet test checks that.

## Consequences
- Two ways to animate now exist: CSS for load effects, `framer-motion` for scroll and pointer effects.
- For the arrow, this differs from ADR 0003's "from scroll progress".
- The look and timing are checked by eye in a browser, not by a test.
- Rollback: `git revert` the module commit. The arrow goes back to a plain static drawing. No config or workflow changes, nothing deployed.
