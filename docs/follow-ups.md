# Follow-ups

Things parked on purpose. Each says when it should be done. Remove a line when it is done.

## Before the first deploy (deploying is on hold)
- **Deploy workflow.** It runs only by hand (ADR 0007). Re-add `push:` with `branches: [main]` when deploying resumes, and enable Pages by hand (Settings, Pages, Source: GitHub Actions).

## In the styling story
- A `cover` branch in `ProjectCard` when the first project image exists (alt text required).
- Lighthouse on Home, run by the human on 2026-11-08 (Lighthouse 13.3, mobile, served locally): performance 98, accessibility 100, layout shift 0, largest paint 2.1 s, blocking time 150 ms, 392 KiB in 28 requests. Home loads only 3 font files (129 KB) and about 184 KB of scripts. Lighthouse estimates 106 KiB of unused JavaScript; look at it when the bundle grows. No action now.
- Tilt-listener flicker near card edges: the listeners sit on the tilting element. Only act if it is seen in the browser; the fix would be an outer static element.
- Footer floating on short pages (Contact): the body has no minimum height. The human checked each screen and saw nothing wrong, so this is parked; revisit if it shows on a tall viewport.
- Heading levels on Home: the `ProjectCard` titles are h2, siblings of the h2 'Projects' (flat but valid). Making them h3 needs a heading-level prop on `ProjectCard`.
- MDX map (`MdxContent.tsx`) overrides: each element spreads its props and then sets `className`, so a class a future MDX plugin adds would be dropped. Merge the classes if a plugin ever adds one.
- The hook finding `codex-grid-background` on `src/app/globals.css` line 27 is unsuppressed, pending the human's decision.
- Home arrow offset: `SketchArrow` sits in the flow with `md:ml-72`, a fixed offset that will not follow the tagline if the headline wraps differently. Check it in the browser (the arrow must not cover text).
- `--text-hero` (2.875rem) repeats the base `h1` size in `globals.css`. Keep the base rule as the fallback for other pages' h1, or delete it once every page sets its own h1 size.
- Tomato must not be used as body text over the grid (4.31, under 4.5). It is fine as an underline or a graphic.
- Style guard false positives (`src/lib/style-guard.ts`, ST-05): it flags `href="#add"`, `issue #123` and `[key:string]` (no space), because any 3, 4, 6 or 8 character hex-looking word after `#` counts. Nothing in the project trips it today. If a future MDX page or anchor does, narrow the pattern test first.
- Style guard known gaps: an arbitrary breakpoint such as `min-[400px]:p-4` passes (arbitrary variants are allowed by design), and so do inline `style`, named colours and `rgb()`/`hsl()`.
- The font mock returns the option string for `.variable`, while real Next returns a class name, so `layout.test.tsx` proves the layout wires the variable, not that the real class is applied. A browser check covers the real one.
- Candidates to automate (`docs/standards.md`): the `ST-02` import limit, `knip` for unused exports.

## Motion (S6)
- **Headline translation and copy.** The headline is a hidden full copy plus aria-hidden single-letter spans. A page translator may translate the visible letters as separate pieces, and find-in-page or select-and-copy may see the sentence twice. Check it in the browser pass; if it hurts, settle per word and not per letter.
- **Headline wrapping.** Words are inline blocks that never break, so "full-stack" no longer wraps after the hyphen. Check 360 px in the browser; if the gap looks bad, split on the hyphen and keep it with the first part.
- **Headline kerning.** Splitting into letters loses kerning pairs at display size. Check in the browser; the fallback is to animate per word.
- **Hero arrow dot.** A round line cap may show a small dot at the shaft end before it draws. Look once in the browser; if it shows, change the dash setting.
- **Pointer depth wrapper layout shift.** Check in the browser that the wrapper around the hero adds no layout shift.
- **Safari mouseleave.** Check that the depth effect and the tilt settle back when the pointer leaves in Safari.
- **Lighthouse after the motion story (2026-11-09, mobile, built site, two runs by the human):** performance 98 and 96, accessibility 100 and 100, layout shift 0, largest paint 2.1 s and 2.2 s, blocking time 120 ms and 170 ms, 399 KiB in 29 requests (189 KB of scripts, 129 KB of fonts). The 2 point drop in the second run comes from main-thread time (1.5 s against 2.2 s), which varies run to run. Lighthouse also notes that the two arrow paths animate stroke-dashoffset, which cannot run on the compositor. It is informational and small (two paths, 0.9 s); revisit only if a later page animates many strokes.
- **Real hydration, scroll feel and reduced motion** are unproven by tests. They are the S6 browser pass (module M6).

## Next motion story
Unbuilt pieces of ADR 0003. Each is its own module, and each keeps the shared rule that the static HTML and first render are the finished state (ADR 0023):
- **Crosshair cursor.** An overlay with a live x/y readout; the normal cursor is kept. Fine pointer only, off under reduced motion.
- **Tagline word swap.** Cycles only the three stack names already in the tagline (no new words). Stops under reduced motion; the static tagline is the finished state.
- **Page transitions.** Probably enter-only, after a spike to see if it works with the static export.
- **Card corner peel.** Also triggers on focus; none under reduced motion or touch.

## Physical interactions (S7)
Part 1 (pick up a project note) is built. The design prototype is in `private/` (git-ignored) and is a reference, not a source of content.
- **Later interactions** (each its own story, with the same shared rule, ADR 0023): B unfold the blueprint on a case study; C turn the page on page changes; D open the Experience folder; E re-stick Skills stickers; F pull out the résumé; G write out the Contact message.
- **Content the later interactions need from the human.** A Skills list, a public résumé file (the PDF has a phone number and address: a redacted copy is needed), screenshots, and architecture text for the blueprint. The prototype's case-study wording and skills list were written by the design tool: check every claim before any of it is used (portfolio safety).
- **Page turn (C) needs a spike first.** Does React's `ViewTransition` work in the built static export for a page turn and a card-to-case-study morph? Cap: one session, `scratch/`, at most 6 files, a written answer. It also touches ADR 0023 (motion after hydration) and focus handling on route change.
- **Deferred decision: 3D.** The pickup uses CSS 3D and `framer-motion` only. React Three Fiber (or any WebGL layer) was not needed and is not added. Revisit only if a later interaction cannot be done with transforms.
- **Feel decisions after the human's browser pass:** cut or fade the details when the put-back starts; pass the current velocity into the return when the close arrives mid-opening; size the sheet from the card's own width and height, not its bounding box (the 1 degree tilt makes the box a few pixels larger); a backdrop fade; the dialog's scrollbar showing while the sheet flies on tall content.
- **Refactor candidates.** `ProjectOverlay.tsx` is about 330 lines: move the pure helpers (constants, `planFlight`, `restingTilt`, `sheetTransform`, `paintSheet`) to `pickupFlight.ts` in the same folder, no behaviour change. `PickupBoard` finds the card with `closest('li')`, a tag lookup that depends on the grid markup; a ref or data attribute would be sturdier. `ProjectDetail` repeats the repository and paper link markup of `ProjectCard`. The pickup tape repeats `Tape` with an imperative transform. The Home page-count guards in `landmarks.test.tsx` and `placeholders.test.tsx` use "at least 4" and would pass if one page were swapped for another; assert the four paths by name.
- **More from the S7 whole-area ui review.** `ProjectDetail` and `ProjectCard` repeat the tag list and the repository and paper links: extract `TagList` and `ProjectLinks`. `NeighbourField` imports `useBoardOpen` from `PickupBoard`, so `TiltCard` pulls the whole overlay into its imports: move the board context to a small `boardState.ts`. The overlay's `TAPE_REST_DEGREES = 2` repeats `Tape`'s `-rotate-2`; if the card tape angle changes the sheet's tape will jump. `ScrollRuler` has no hydration test (TE-04); low risk, it adds a node and does not rebuild a subtree. Tests for TiltCard, PointerDepth, ScrollRuler and NeighbourField mock `useReducedMotion`; `ProjectOverlay.test.tsx` stubs only `matchMedia`, the more realistic style. In the overlay "Put back" is last in DOM order but receives the initial focus; confirm in the screen-reader pass. The glossary entry "Wrapper" ("a small component that adds motion") does not fit `ProjectOverlay`, `PickupBoard` or `NeighbourField`: widen it or add a word for an interactive motion component.
- **Shadow layer remount.** `TiltCard` remounts its decorative shadow layer when the lift becomes available after hydration (the key flips); harmless today because it is invisible at opacity 0.
- **`scrollbar-gutter: stable` on `html`** reserves the scrollbar width on every page with a classic scrollbar (a small shift on Home on desktop). Kept on purpose (the human, 2026-11-13).
- **Lighthouse.** `/projects/` baseline before the pickup (built site, mobile, 2026-11-13): performance 77, 88, 88 (the first run cold), accessibility 100. Target for S7: no worse than 88 on the page that holds the pickup, accessibility 100. That page is now Home (ADR 0027); compare with the Home runs from 2026-11-08 and 2026-11-09 above (98, 96). The human will run it later, after the next round of UI and UX changes (decided 2026-11-24).
- **Spec edit waiting for the human.** ADR 0027 is accepted (2026-11-24). `docs/spec.md` Routes table still lists `/projects/`: remove that row and call Home "Home / showcase and project index".
- **The build can fail with no code change.** `next.config.mjs` sets `experimental.agentUpgrade: 'security'` (committed by the human in eea3b75). When an advisory affects the installed Next and an agent runs the build, Next throws `SecurityFatalError` after generating the pages, until Next is upgraded; a retry within 5 minutes is let through. This happened on 2026-11-20 on Next 16.4.3 and went away on 16.4.6. A failed advisory lookup only logs a warning. Not pinned by a test and not in an ADR. The human decided on 2026-11-24 to keep the setting.
- **`docs/spec.md` and `docs/requirements.md` drift.** Beyond the Routes row (ADR 0027): the Animation components section lists none of `PickupBoard`, `ProjectOverlay`, `Elevation`, `NeighbourField` or `ProjectDetail`, and has no overlay or scroll-lock rule; R-02 says "Projects index" (met on Home).
- **`npm audit`** reports nine moderate findings in dev-only lint tooling (eslint, typescript-eslint, `minimatch` denial of service). Not part of the built site; upgrade at the human's choice.
- **Scroll-driven draw wrapper.** A `framer-motion` wrapper in `animations/` for later sketches; the drawing appears complete under reduced motion.

## Later stories
- **Blog (R-03, R-11).** A later story, decided by the human on 2026-11-08. `/blog/`, `/blog/[slug]/` and the RSS feed are in `docs/spec.md` and `docs/requirements.md` but have no code. When it starts, CT-02 (drafts never reach a production build) becomes testable, and every post needs the human's own text.

- **Font notices.** The README credits the three fonts with the copyright lines read from each upstream repository (2026-11-08), not from Google Fonts, whose pages could not be read. Confirm the files served through `next/font/google` carry the same notice.

## Content that goes stale
- The HTD role has no end date, so it shows "Present", and the intro says "currently in" the program. Update both when the program ends (`src/data/experience.ts`, `src/data/profile.ts`).
- The footer year is computed at build time, so it is only as fresh as the last deploy.
- The margin-note caption in `docs/design.md` is still a placeholder.

## Before the first push
- Run `npm run publish-review` and read the diff of everything that becomes public. The push is the one step that cannot be undone.
