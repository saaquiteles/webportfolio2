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
- Candidates to automate (`docs/standards.md`): the `ST-02` import limit, the `ST-05` colour rule, `knip` for unused exports.

## Content that goes stale
- The HTD role has no end date, so it shows "Present", and the intro says "currently in" the program. Update both when the program ends (`src/data/experience.ts`, `src/data/profile.ts`).
- The footer year is computed at build time, so it is only as fresh as the last deploy.
- The margin-note caption in `docs/design.md` is still a placeholder.

## Before the first push
- Run `npm run publish-review` and read the diff of everything that becomes public. The push is the one step that cannot be undone.
