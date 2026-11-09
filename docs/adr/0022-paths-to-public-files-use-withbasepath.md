# ADR 0022: Paths to files in `public/` go through `withBasePath`

Status: Proposed. Raised by the S5 deploy plan (module M1).

## Decision
Every path to a file in `public/` that is written as a plain string (for example an image `src`) goes through `withBasePath` from `src/lib/base-path.ts` before it reaches the page.

## Gap
On GitHub Pages a project site lives under a sub-path, such as `user.github.io/webportfolio2/`. The `basePath` setting in `next.config.mjs` adds that prefix to links made with `next/link` and to Next's own files. It does not change a plain string like `/images/sean-quiteles.webp` inside an `img` tag. So the profile photo would return 404 on the live site.

## Proposal
- Add `withBasePath(path)`. It reads `NEXT_PUBLIC_BASE_PATH` each time it is called. It returns one path that always starts with `/`: the prefix plus the path, or just the path when there is no prefix. A trailing slash on the prefix is dropped, and a missing leading slash on the path is added.
- Data files keep the plain path (`/images/...`). The `Profile` shape in `docs/spec.md` does not change.
- `ProfilePhoto` calls the helper. Future raw paths (for example the unused cover branch of `ProjectCard`) must do the same.
- Call it once per path. Calling it twice adds the prefix twice. It is only for paths inside `public/`, not for full URLs.

## Why
It is the smallest fix that keeps the data and the spec as they are. Reading the variable inside the function (the exact form `process.env.NEXT_PUBLIC_BASE_PATH`) lets Next fix the value into the build, and lets tests change it with `vi.stubEnv`.

## Consequences
- Tests that check a photo `src` must stub `NEXT_PUBLIC_BASE_PATH` themselves, because CI runs the checks with it set.
- A later step could turn this into a numbered rule in `docs/standards.md` (the human owns that file).
- The build is checked by hand once: with the variable set, `out/about/index.html` has `/webportfolio2/images/sean-quiteles.webp`; without it, `/images/sean-quiteles.webp`.
- Rollback: `git revert` the module commit. Nothing is deployed and no config or workflow changes.
