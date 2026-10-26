# ADR 0006: Root tooling files, their owner, and the static-export choices

Status: Proposed (the human decides). Raised by T1 to T7.

## Gap
`docs/spec.md` lists the app folders but not the files at the repo root, and the area map in `CLAUDE.md` gives them no owner. The scaffold created them under a one-off permission for `app-dev`.

## Proposal
**1. Name the files and give them an owner.** The `builder`, working in the app area, owns, in addition to `src/app`, `next.config.mjs`, `public/` and `.github/`:
`package.json`, `package-lock.json`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.mts`, `vitest.setup.ts`, `postcss.config.mjs`, `.gitignore`, and the root-level `next.config.test.ts`. Add them to `docs/spec.md` and the area map. Tests sit next to the code they test (`src/app/page.test.tsx`), except the config test, which sits next to `next.config.mjs`. `velite.config.ts` and `src/lib/types.ts` are still not created: they arrive with the content story.

**2. Record the static-export choices** (from `next.config.mjs`):
- `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`.
- `basePath` and `assetPrefix` are both set from `NEXT_PUBLIC_BASE_PATH`. `assetPrefix` equal to `basePath` is redundant for a static export, but the spec asks for both and a build with `/portfolio` showed a single prefix and no doubles.
- `turbopack.root` is pinned to the project folder, so Next never guesses the root from a lockfile in a parent folder.
- `public/.nojekyll` is kept. It is not load-bearing under the GitHub Actions Pages source (see ADR 0007). The upload step leaves `include-hidden-files` at its default (`false`), so the file is not uploaded; setting it to `true` would also publish any future dot-folder in `out/`.

**3. Record the `tsconfig.json` facts.**
- `"types": ["node"]` was added, because TypeScript 6 no longer loads `@types/node` by itself.
- `"**/*.mts"` was added to `include`, so `vitest.config.mts` is type-checked.
- Next rewrote the file on the first build: it added `allowJs: true`, `esModuleInterop: true` and `.next/dev/types/**/*.ts`. A repeat build leaves it byte-identical. `allowJs` does not change what is type-checked, because `include` lists no `.js` or `.mjs`, so `postcss.config.mjs`, `eslint.config.mjs`, `next.config.mjs` and the hook scripts stay untyped. Commit the Next-rewritten file as it stands.

## Why
A file nobody owns gets changed by whoever is nearest. Writing down the static-export choices means a later change to `basePath` or the root is a decision, not an accident (full flow per `CLAUDE.md`).

## Consequences
- A local-only trap: if `.next/` is deleted but `next-env.d.ts` is kept, `typecheck` fails until one build. A fresh checkout is fine, because `next-env.d.ts` is git-ignored.
- On Windows in Git Bash, a local build with a base path needs `MSYS_NO_PATHCONV=1` in front: `MSYS_NO_PATHCONV=1 NEXT_PUBLIC_BASE_PATH=/portfolio npm run build`. Git Bash otherwise rewrites `/portfolio` into a Windows path. Linux CI is not affected. Add this line to a README when one exists.
- Bad base paths fail loudly at build time: `/portfolio/` ("should not end with /") and `portfolio` ("has to start with a /").
