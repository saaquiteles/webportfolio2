# Follow-ups

Things parked on purpose. Each says when it should be done. Remove a line when it is done.

## Before the first deploy (deploying is on hold)
- **Photo base path.** The profile photo `src` (`/images/sean-quiteles.webp`) has no `basePath`, so it returns 404 when the site is served from a repo sub-path. Full flow, because it touches the deploy setup; name a rollback.
- **Deploy workflow.** It runs only by hand (ADR 0007). Re-add `push:` with `branches: [main]` when deploying resumes, and enable Pages by hand (Settings, Pages, Source: GitHub Actions).

## In the styling story
- A "Skip to content" link (needs an id on each page's `main`).
- `aria-current="page"` on the active navigation link, and a visible `focus-visible` style.
- Shared page spacing (the case-study page lacks the `p-8` the other pages have), or a `PageShell`.
- An MDX `components` map, so `##` headings in case studies can be styled.
- A `cover` branch in `ProjectCard` when the first project image exists (alt text required).
- Font weight: `out/` holds 16 `.woff2` files, because `next/font` ships every unicode-range slice of each family, not only `latin`. Check the page weight in the T13 Lighthouse run; if it hurts, look at `preload` and the number of weights.
- Base `h3` is 26 px at every width, but the comp's card title is 24 px on a phone. Settle it in T10, where the card title is styled.
- A short page (Contact) leaves the footer floating mid-screen with the grid continuing below it, because the body has no minimum height. Confirmed in the human's T8 screenshots (412, 768 and 960 px) and the Contact screenshots (768 and 1024 px); most visible on a tall viewport. Decide on a sticky footer in T13.
- Home arrow offset: `SketchArrow` sits in the flow with `md:ml-72`, a fixed offset that will not follow the tagline if the headline wraps differently. Check it in the T13 screenshots (the arrow must not cover text).
- `--text-hero` (2.875rem) repeats the base `h1` size in `globals.css`. Keep the base rule as the fallback for other pages' h1, or delete it once every page sets its own h1 size.
- Tomato must not be used as body text over the grid (about 4.3, under 4.5). It is fine as an underline or a graphic.
- Design comp borders are 1.5 px, but the build uses the standard `border-2` (2 px), because `ST-05` forbids arbitrary values. Say so in `docs/design.md` in T14, or add a border-width token if the 0.5 px matters.
- Style guard false positives (`src/lib/style-guard.ts`, ST-05): it flags `href="#add"`, `issue #123` and `[key:string]` (no space), because any 3, 4, 6 or 8 character hex-looking word after `#` counts. Nothing in the project trips it today. If a future MDX page or anchor does, narrow the pattern test first.
- Style guard known gaps: an arbitrary breakpoint such as `min-[400px]:p-4` passes (arbitrary variants are allowed by design), and so do inline `style`, named colours and `rgb()`/`hsl()`.
- The font mock returns the option string for `.variable`, while real Next returns a class name, so `layout.test.tsx` proves the layout wires the variable, not that the real class is applied. The T13 browser check covers the real one.
- Candidates to automate (`docs/standards.md`): the `ST-02` import limit, the `ST-05` colour rule, `knip` for unused exports.

## Content that goes stale
- The HTD role has no end date, so it shows "Present", and the intro says "currently in" the program. Update both when the program ends (`src/data/experience.ts`, `src/data/profile.ts`).
- The footer year is computed at build time, so it is only as fresh as the last deploy.
- The margin-note caption in `docs/design.md` is still a placeholder.

## Before the first push
- Run `npm run publish-review` and read the diff of everything that becomes public. The push is the one step that cannot be undone.
