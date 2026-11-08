# Follow-ups

Things parked on purpose. Each says when it should be done. Remove a line when it is done.

## Before the first deploy (deploying is on hold)
- **Photo base path.** The profile photo `src` (`/images/sean-quiteles.webp`) has no `basePath`, so it returns 404 when the site is served from a repo sub-path. Full flow, because it touches the deploy setup; name a rollback.
- **Deploy workflow.** It runs only by hand (ADR 0007). Re-add `push:` with `branches: [main]` when deploying resumes, and enable Pages by hand (Settings, Pages, Source: GitHub Actions).

## In the styling story
- A `cover` branch in `ProjectCard` when the first project image exists (alt text required).
- Lighthouse numbers on Home are not recorded yet (M5 closed on a hand check). Run it and record performance and accessibility (aim for at least 90), and the bundle cost of `framer-motion` and the 16 `.woff2` files. `out/` holds 16 `.woff2` files because `next/font` ships every unicode-range slice of each family, not only `latin`; if the weight hurts, look at `preload` and the number of weights.
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

## Content that goes stale
- The HTD role has no end date, so it shows "Present", and the intro says "currently in" the program. Update both when the program ends (`src/data/experience.ts`, `src/data/profile.ts`).
- The footer year is computed at build time, so it is only as fresh as the last deploy.
- The margin-note caption in `docs/design.md` is still a placeholder.

## Before the first push
- Run `npm run publish-review` and read the diff of everything that becomes public. The push is the one step that cannot be undone.
