# Plan: project scaffold
Flow: 3, because the story adds dependencies, creates `next.config.mjs` and the deploy workflow, and spans more than one area.
Status: Approved by the human on 2026-10-24 and built (T0 to T8 done; the ADR drafts are for the human to accept). Written by the `planner` agent; the versions were verified in T0 (see "T0 results").

Triggers checked:
| Trigger | Applies? | Note |
|---|---|---|
| `next.config.mjs` / deploy workflow / `basePath` | YES | Both files are created; `basePath` comes from an env var. |
| New dependency or pattern | YES | Next, React, TypeScript, Tailwind v4, Vitest, ESLint. |
| Spec or content schema change | Partly | No spec edit and no content schema. The scaffold adds files the spec does not list, so ADR drafts are needed. |
| More than one area | YES | `src/app`, config, `.github`, `public`, plus root tooling. `ui` and `content` are untouched. |
| Personal data | NO | Home page uses `TODO(human)` placeholders only. |
| Whole-site accessibility | YES, mildly | `layout.tsx` sets `lang` and landmarks for every page (`A11Y-01`). |

## Tasks
Each task: build it, run its check, draft learning note, `/review`. (`/checkpoint` was removed by the human on 2026-10-24.) Each npm script is added in the task that needs it.

Root files (`package.json`, `tsconfig.json`, ESLint, Vitest config, `.gitignore`) have no owner in the area map. Proposed: a one-off exception where `app-dev` takes them for this story (Q1). No task edits `.claude/hooks` or `.claude/settings.json`. `npm install` and `npm ci` are not in the allow-list, so they will prompt.

| # | Task | Builder | Files | First failing test | Rules | New deps |
|---|---|---|---|---|---|---|
| T0 | Verify versions (read-only): `npm view` for next, react, tailwindcss, vitest, eslint, eslint-config-next; check whether `next lint` still exists (use `eslint .` if not); check current majors of the GitHub Actions. Record results in this plan. | app-dev | none | None (research) | SE-01 | none |
| T1 | `.gitignore` (~30 lines) | app-dev (root exception) | `.gitignore` | `git check-ignore -v` on sample paths. Ignored: `node_modules`, `.next`, `out`, `.env`, `.claude/logs/state.json`, `.claude/checkpoints/x.patch`, `x.tsbuildinfo`. Not ignored: `.env.example`, `CLAUDE.md`, `.claude/settings.json`, `.impeccable/x`, `package-lock.json`. Needs `git init` first (Q2). | portfolio-safety | none |
| T2 | Manifest and TypeScript base: hand-written `package.json` (private; scripts `dev`, `build` only; `typecheck` and `test` move to T3, `lint` to T4, because `tsc` fails with TS18003 until `.ts` files exist), `tsconfig.json` (strict, `@/*` alias), `npm install` | app-dev (root exception) | `package.json`, `package-lock.json`, `tsconfig.json` | `npm run build` fails (no app directory). Honest but weak; a real `typecheck` needs TS files from T3. | TS-01 | next, react, react-dom, typescript, @types/node, @types/react, @types/react-dom |
| T3 | Vitest harness plus home page, TDD | test-writer (test first), then app-dev | `vitest.config.mts`, `vitest.setup.ts`, `src/app/page.test.tsx`, `src/app/page.tsx`, `test` script | Render `<Home />`; assert exactly one level-1 heading containing a `TODO(human)` placeholder and a `main` landmark. Red: cannot resolve `./page`. | TE-01, TE-02, A11Y-01, TS-03 | vitest, @vitejs/plugin-react, jsdom, @testing-library/react, @testing-library/dom, @testing-library/jest-dom |
| T4 | ESLint wiring | app-dev (root exception) | `eslint.config.mjs`, `lint` script | Throwaway `src/lib/__lint-probe.ts` with `const x: any = 1`; `npm run lint` must FAIL (proves `TS-01`). Delete the probe, lint passes. Never kept. | TS-01, TS-04 | eslint, eslint-config-next (plus typescript-eslint if not bundled) |
| T5 | Layout and Tailwind v4 | app-dev (postcss config under root exception) | `src/app/layout.tsx`, `src/app/globals.css`, `postcss.config.mjs`, `src/app/layout.test.tsx` | Import `layout.tsx`; assert `metadata.title` is a non-empty string and `renderToStaticMarkup(<RootLayout>x</RootLayout>)` contains `<html lang="en"`. Tailwind itself is proved by the build (a used utility class appears in the CSS under `out/_next/static/`). | A11Y-01, ST-04, ST-05, TS-03 | tailwindcss, @tailwindcss/postcss, postcss (verify if needed) |
| T6 | `next.config.mjs` and `public/.nojekyll` (Level 3) | app-dev | `next.config.mjs`, `public/.nojekyll`, `next.config.test.ts` | Defaults: `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`, `basePath` and `assetPrefix` undefined. With `NEXT_PUBLIC_BASE_PATH=/portfolio` (via `vi.stubEnv` + `vi.resetModules`) both equal `/portfolio`. `public/.nojekyll` exists and is empty. Build proof: `out/index.html` and `out/.nojekyll` exist; a build with the env var references `/portfolio/_next/`. Guard against empty-string `basePath`. | SE-01, SE-02, TE-03 | none |
| T7 | Deploy workflow (Level 3) | app-dev | `.github/workflows/deploy.yml` | No Vitest test that greps YAML (`TE-02`). Checks: run the exact CI sequence locally from the lockfile (`npm ci` then typecheck, lint, test, build); `/review` against the Pages docs; the real proof is the first Actions run after the human pushes. | SE-01, TE-03, portfolio-safety | none |
| T8 | Whole-story verification and ADR drafts | app-dev, then reviewer | ADR drafts, learning notes | Full check. Clean-state check: delete the single files `next-env.d.ts` and `tsconfig.tsbuildinfo` if present, run `npm ci`, run the full check. | TE-03 | none |

Review changes approved by the human on 2026-10-24 ("all recommended"):
- T1 review: `/out` anchored, `build` dropped, `.eslintcache`, `*.log`, `*.pem` added, `.vercel` removed; `.gitattributes` moved to ADR draft 0009. The human also asked to ignore the learning notes (`.claude/logs/learning/*`, with `TEMPLATE.md` kept tracked).
- T2 review: `engines.node` tightened to `^22.12.0 || ^24.0.0`; T2 row corrected (scripts `dev`, `build` only).
- **T3 must also add the `typecheck` script** (`tsc --noEmit`) next to `test`. At its first run, check whether TypeScript 6 stops loading `@types/node` by default; if so add `"types": ["node"]` to `tsconfig.json`.
- **T6 must also set `turbopack: { root: import.meta.dirname }` in `next.config.mjs`** (add `outputFileTracingRoot` too if the stray-lockfile warning persists), with an assertion in `next.config.test.ts`. Reason: a stray empty `C:\Users\squiteles\package-lock.json` outside the project makes Next guess the wrong workspace root. The file is outside the workspace and is not touched.
- T3 review (approved "all recommended"): `"**/*.mts"` added to the tsconfig `include` (typecheck clean, tests pass); `"types": ["node"]` was already added in T3 step 1 after confirming TypeScript 6 does not auto-load `@types/node`.
- **T5 must assert there is no second `<main>`:** `page.tsx` already renders `<main>`, so `layout.test.tsx` must check that the `renderToStaticMarkup` output with child `x` contains no `<main`, and `{children}` sits directly in `<body>` (A11Y-01).
- **T6:** `next.config.test.ts` starts with `// @vitest-environment node`.
- T4 review (approved "all recommended"): `.claude/**` removed from the lint ignores, replaced by an override turning off `no-require-imports` for `.claude/hooks/*.js` only; why-comment added to the `no-explicit-any` pin. Lint, tests and typecheck all still pass.
- **ADR 0008 (T8) must also record:** stay on ESLint 10, with the fallback "if a plugin crashes, pin `eslint@^9`" (three plugins list peer support only to ESLint 9, `npm ls` shows them "invalid", `npm ci --dry-run` passes); `unrs-resolver` postinstall is blocked by npm's `allowScripts`, which is harmless; alt-text and `no-img-element` are warnings only, promote them to errors in the ui story; `knip` for TS-04 is a possible later ADR.
- **T7 must confirm** that lint, tests, typecheck and build pass after a clean `npm ci` (the `unrs-resolver` script stays blocked in CI too).
- T5 review (approved "all recommended"): type guard and stricter `<body>x</body>` check in `layout.test.tsx`; `postcss.config.mjs` uses a named constant (lint now clean); full check passes (6 tests, build OK); a repeat build leaves `tsconfig.json` byte-identical.
- **T5 corrections to earlier assumptions:** Next set `allowJs: true` and `esModuleInterop: true` in `tsconfig.json` (it does not change what is type-checked; `include` still lists only `.ts`, `.mts`, `.tsx`). Record this in ADR 0006 or 0008. The stray home-folder `package-lock.json` no longer exists; the T6 `turbopack.root` requirement stays anyway so the root is explicit on every machine, and the T6 reason is now "make the root explicit", not "silence a warning".
- **T7 must confirm on a clean `npm ci`** that `typecheck` passes with no `.next/` and no `next-env.d.ts` (already tested locally: passes). Local-only trap: `.next/` deleted but `next-env.d.ts` kept makes `typecheck` fail until one build.
- T6 review (approved "all recommended"): config test typed with `NextConfig` (no cast; typing proved by a mutation check), why-comment on `normalise`, shorter Turbopack comment; bad base paths verified to fail loudly (`/portfolio/` and `portfolio`); normal build restored; 11 tests pass, typecheck and lint clean.
- **T7 must check `.nojekyll` and the upload action:** `actions/upload-pages-artifact` may exclude hidden files from `out/`. It is not load-bearing under the "GitHub Actions" Pages source (Jekyll only runs for branch deploys), but T7 reads the action's README for the current behaviour and the first real deploy confirms `_next/` files return 200 (download the `github-pages` artifact and list it, or open `https://<user>.github.io/<repo>/_next/static/...`).
- **T7 sets `NEXT_PUBLIC_BASE_PATH` only if the human chooses a project page** (`user.github.io/<repo>`); the runner is Linux, so the Git Bash path-conversion quirk does not apply there.
- **T8 ADRs (0006 or 0007) must record:** `assetPrefix` equals `basePath` because the spec asks for both (harmless, single prefix confirmed); `.nojekyll` not load-bearing under Actions plus the artifact-dotfile check; `turbopack.root` pinned; the Git Bash `MSYS_NO_PATHCONV=1` quirk (and a README line when a README exists).
- T7 review (approved "all recommended"): `pages: write` and `id-token: write` moved from the top of `deploy.yml` into the `deploy` job (only `contents: read` stays global); re-linted (exit 0; a misspelt permission exits 1); `include-hidden-files` left at its default; four first-run traps, the `.nojekyll` real check and the re-run caveat added to the T7 note.
- **T8 ADR contents from T7 (write into 0005 to 0009):** 0007 (CI gate): `configure-pages` omitted so enabling Pages is manual; major-tag pinning with commit hashes and Dependabot as later options; push to `main` plus `workflow_dispatch` only (no pull-request checks); the permission split; the `github-pages` environment only accepts the default branch; the YAML has no unit test (proof is the clean local run plus the first real push, TE-02/TE-03); the schema linter `@action-validator/cli` 0.6.0 is old and was a one-off run. 0006: `.nojekyll` not load-bearing under Actions, `include-hidden-files` left at default. 0008: Node 24 in CI, blocked `unrs-resolver` script. 0009: `.gitattributes`, with the observation that there is no CRLF in the repo today.
- T8: Next rewrites `tsconfig.json` on the first build; keep the result and confirm a second build gives no diff.

T7 workflow shape: triggers `push` to `main` (plus `workflow_dispatch`, Q3); jobs `build` then `deploy`; build runs checkout, setup-node (Node 24), `npm ci`, typecheck, lint, test, build, `upload-pages-artifact` with `path: out` (as built: `configure-pages` was omitted, see ADR draft 0007); deploy needs build, uses `environment: github-pages` and `deploy-pages`; as built, top-level `permissions: contents: read` only, with `pages: write` and `id-token: write` inside the `deploy` job, and a `concurrency` group. `NEXT_PUBLIC_BASE_PATH` comes from a repo variable and is unset by default.

Size: T3, T5 and T7 may exceed about 30 lines (generated config, YAML).

Why not `create-next-app`: it refuses a non-empty folder, running it elsewhere writes outside the workspace, and it adds Geist fonts (conflicts with ADR draft 0002) and boilerplate. Files are written by hand.

## T0 results (2026-10-24, from `npm view`; Node v24.18.0, npm 12.2.0)
Status: Approved by the human ("approved as recommended") on 2026-10-24.

| Package | Latest | Pin | Note |
|---|---|---|---|
| next | 16.4.3 | `^16.4.3` | engines node >=20.9 |
| react, react-dom | 19.3.1 | `^19.3.1` | |
| **typescript** | 7.0.2 | **`~6.0.3`** | `typescript-eslint` 8.72.0 only supports `<6.1.0`, so TS 7 would break the lint setup |
| tailwindcss, @tailwindcss/postcss | 4.3.3 | `^4.3.3` | |
| postcss | 8.5.31 | `^8.5.31` | verify if still needed with `@tailwindcss/postcss` |
| vitest | 5.0.5 | `^5.0.5` | needs Node `^22.12 \|\| ^24 \|\| >=26` (OK); peers `vite ^6.4 \|\| ^7 \|\| ^8` |
| @vitejs/plugin-react | 6.1.2 | `^6.1.2` | peer `vite ^8`, so install vite 8 |
| jsdom | 30.1.3 | `^30.1.3` | |
| @testing-library/react / dom / jest-dom | 16.3.3 / 10.4.2 / 7.0.1 | caret | |
| eslint | 10.13.0 | `^10.13.0` | `eslint-config-next` peer is `>=9`; re-verify its bundled plugins run on ESLint 10 in T4, fall back to ESLint 9 if not |
| eslint-config-next | 16.4.3 | `^16.4.3` | |
| typescript-eslint | 8.72.0 | `^8.72.0` | add if `eslint-config-next` does not bundle it |
| @types/node | 26.6.5 | **`^24`** | match the Node 24 runtime |
| @types/react, @types/react-dom | 19.3.0 | caret | |

`next lint`: Next 16 ships only the `next` binary, and the plan uses `eslint .` directly (confirm in T4).
GitHub Actions majors: check at T7.

## Test seams (to confirm in writing before T6 and T7)
- Rendered component: `Home` (T3), by role.
- Module export plus static markup: `RootLayout` and `metadata` (T5).
- Config object: default export of `next.config.mjs` with `vi.stubEnv` / `vi.resetModules` (T6).
- File system: `public/.nojekyll` exists and is empty (T6).
- Lint probe: a deliberate violation makes `npm run lint` fail (T4), throwaway.
- Build as proof: `npm run build` for static export, Tailwind CSS and the `basePath` build (T5, T6, T8).
- Not unit-testable: `.gitignore` (`git check-ignore` after `git init`) and the workflow (first real run).
- Test placement: colocated `*.test.tsx` beside source; `next.config.test.ts` in the repo root (Q4).

## Rollback
- `next.config.mjs`: new file; delete it and the build fails loudly. Nothing is live until the workflow exists and `main` is pushed; after that the human reverts the commit.
- Deploy workflow: delete `deploy.yml` or disable it in the Actions tab; re-run the last good run to restore. With Pages source "GitHub Actions", a failed build never replaces the live site.
- `basePath`: remove the env var.
- Dependencies: restore `package.json` / lockfile from the last git commit (the human commits), then `npm ci`.
- `.gitignore`: edit the lines. Do T1 before the first `git add`, or a secret could be committed before the ignore takes effect.

## Idempotency
- Hand-written files are overwritten with identical content. `npm install` is idempotent; `npm ci` is deterministic.
- Pin versions from T0 (carets are fine with the lockfile). Never `latest`.
- Next may edit `tsconfig.json` and create `next-env.d.ts` on first build; run once, keep the result; a second run must give no diff (T8 check).
- Do not clean with `rm -rf` (blocked); delete specific files.

## New decisions (ADR drafts to write in T8)
- 0005 Tailwind v4, CSS-first config; tokens live in `@theme` in `globals.css` (spec says only "Tailwind CSS").
- 0006 Root tooling files not in the spec layout (`package.json`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.mts`, `vitest.setup.ts`, `postcss.config.mjs`, colocated tests) and who owns them. Note `velite.config.ts` and `src/lib/types.ts` are deferred.
- 0007 CI gate before deploy (typecheck, lint, test, build, then publish).
- 0008 Pinned toolchain: Node 24, committed lockfile, ESLint flat config, no Prettier, outcome of the `next lint` check.

## Questions
- Q1 May `app-dev` take the root files as a one-off exception, or should the main session write them? Add an area-map line afterwards?
- Q2 Will you run `git init` before T1 so `git check-ignore` can be the test?
- Q3 Also run the checks on pull requests (without deploying)? Add `workflow_dispatch`?
- Q4 Colocated tests, or a `tests/` folder (needs an ADR under `ST-01`)?
- Q5 Add the palette tokens from `docs/design.md` now, or defer to a design story (recommended: defer)?
- Q6 Scaffold has only `<main>` and an h1; header, nav and footer come in a later story (`src/components/global`). OK?
- Q7 Track or ignore `WORKFLOW-TEMPLATE-generic.md`?
- Q8 Pages repo name and custom domain? Default (no `basePath`) is wrong for `user.github.io/repo`.

## Doc disagreements noted
- Spec says "Tailwind CSS"; design and standards say "theme tokens". No conflict, only a v4 detail.
- The full check needs scripts named exactly `typecheck`, `lint`, `test`, `build` to match the `settings.json` allow-list.
- ADR 0001 asks to re-check Velite when scaffolded; Velite is deferred, so that check moves to the content story.

## Assumptions (approve or change)
1. `.gitignore` tracks `.claude/`, `.impeccable/` and `CLAUDE.md`; ignores `state.json`, `settings.local.json`, `checkpoints/*.patch`, `next-env.d.ts`, `*.tsbuildinfo`, plus the usual; `!.env.example`.
2. Dependencies now: Next, React, TypeScript, Tailwind v4, Vitest, Testing Library, jsdom, `@vitejs/plugin-react`, ESLint, `eslint-config-next`. Deferred: shadcn, Framer Motion, Velite/MDX, fonts, animation wrappers, dark theme.
3. Latest stable Next and Tailwind v4, verified in T0; `eslint .` if `next lint` is gone.
4. Workflow runs the four checks then deploys on push to `main`; no `basePath` by default via `NEXT_PUBLIC_BASE_PATH`; `trailingSlash`, `images.unoptimized`, `.nojekyll`.
5. No Prettier.
6. The human enables Pages (source: GitHub Actions), runs `git init` and commits.

## End-of-story reviews
- `/review whole app` (`src/app`, `next.config.mjs`, `public/`, `.github/`, root tooling).
- No `ui` or `content` review needed; confirm `src/lib` is clean of the T4 probe.
- Level 3: `/apply-review` for every must-fix, seams confirmed in writing before T6 and T7, ADR drafts, a learning note per task.

Status: Approved and built (see the line at the top)
