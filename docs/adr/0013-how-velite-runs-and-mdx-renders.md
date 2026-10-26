# ADR 0013: How Velite runs and how MDX renders

Status: Accepted by the human on 2026-10-26, with the recommended options. Raised by the first content story. Follows ADR 0001 (Velite), which must be accepted first.

## Gap
ADR 0001 chose Velite to turn `content/**/*.mdx` into typed data. It says nothing about when Velite runs, how the compiled MDX is shown on a page, or what happens if it does not work with this project's setup (Next 16, Turbopack, `output: 'export'`, `trailingSlash`).

## What is verified and what is not
- Velite 0.4.0 (published 2026-06-17; a 1.0 alpha followed on 2026-06-19) needs Node 18.20 or newer and brings `sharp`, `terser`, `esbuild` and `@mdx-js/mdx`. It has no peer dependencies.
- Its documentation recommends starting it from `next.config.mjs`, because its webpack plugin does not work with Turbopack.
- **Unverified:** that Velite works with Turbopack, Next 16 and `output: 'export'`. The documentation does not say. The first tasks of the story are a small test-first spike that proves it, or triggers the fallback.

## Proposal
**How Velite runs.**
- Option A: npm `pre` scripts. `prebuild`, `pretest` and `pretypecheck` run `velite build` (in a strict mode if 0.4.0 has one), and `predev` runs it once, or `velite dev` runs in a second terminal.
- Option B: the documentation's block in `next.config.mjs` (top-level await, `build({ watch, clean })`).
- **Recommendation: A.** It leaves `next.config.mjs` and the deploy workflow untouched, and CI's separate steps still run Velite first through the same `pre` hooks.
- B is the fallback, and only after updating `next.config.test.ts` first, because that test imports the config and must prove that importing it does not start Velite.

**Where the output goes.** `.velite/` (git-ignored and lint-ignored), imported through the alias `#site/content`, set in both `tsconfig.json` and `vitest.config.mts`. The collection is named `CaseStudy` (glossary). `types.ts` derives its type from the data (`TS-02`; see the part B update below).

**How it renders.** Compile with `s.mdx()` and render through an `MdxContent` component. The sub-fallback is `s.markdown()`, which gives HTML without MDX components.

**Fallback if the spike fails.** `@next/mdx` (16.4.3, Next's own package). It changes `next.config.mjs` and needs frontmatter handling, so it would get its own revision of this ADR.

## Why
The cheapest option that keeps the riskiest file (`next.config.mjs`) and the deploy workflow unchanged is the one to try first, and the spike keeps the unknown small.

## Consequences
- A new dependency (`velite`, and through it `esbuild` and `sharp`): check `npm ci` for blocked install scripts, as ADR 0008 did for another package.
- A broken frontmatter must fail the build (`CT-01`): check this by hand once.
- The static build must write `out/projects/<slug>/index.html`, and `npm run dev` must serve the page; both are checked by hand and recorded in the learning note (`TE-03`).
- Rollback is `npm uninstall velite` plus a revert, then a choice between `@next/mdx` and plain markdown.

## Update from the spike, part A (T11, 2026-10-26)
- **Velite 0.4.0 works here for the data step.** With Next 16.4.3, Turbopack, `output: 'export'`, Node 24 and Windows, `velite build --strict` turns `content/projects/buriccat.mdx` into typed data, and `npm run check` passes from a clean `npm ci` copy. `next.config.mjs` was not touched. Option A (npm `pre` scripts: `predev`, `prebuild`, `pretest`, `pretypecheck` run `npm run content`) works. Rendering the MDX in the static build is still unverified (T12).
- **The strict flag is `velite build --strict`.** A missing field or a bad date stops the build with a clear message (`CT-01`, checked by hand).
- **The `#site/content` alias must point at the file** `./.velite/index.js` in `tsconfig.json` (a folder gave `TS2307`), and likewise in `vitest.config.mts`.
- **A security finding, fixed.** Velite 0.4.0 depends on `sharp` ^0.34.5, which `npm audit` flags (2 high, in the bundled image libraries). Velite only uses `sharp` for image fields, which this content does not have, so the practical risk was small, but an unresolved "high" is poor hygiene. Fix: an npm `overrides` entry in `package.json` (`"velite": { "sharp": "^0.35.5" }`) so Velite shares the patched copy Next already uses. After a reinstall, one `sharp` 0.35.5 serves both, and `npm audit` reports 0 vulnerabilities. If Velite is ever upgraded or removed, revisit the override.
- **Blocked install scripts** (`unrs-resolver`, `esbuild`): harmless, because both ship prebuilt binaries and the build, tests and dev server work without approving them.
- **Side effects to know about:** Velite used to create an empty `public/static/` folder on every build, so `output.assets` is now set to `.velite/static` and nothing is written under `public/`. Never turn Velite's `clean` option on. Velite was built against `sharp` 0.34 and runs with 0.35.5 through the override; this is untested for image fields, so test it if one is ever added. The content step runs three times inside `npm run check` (about 1 to 3 seconds each). Calling `vitest` or `tsc` directly (`npx`) skips the `pre` hooks, so run `npm run content` first on a fresh clone.

## Update from the spike, part B (T12, 2026-10-26): the gate passed
- **A case study renders as a page in both the static build and the dev server**, with `next.config.mjs` untouched. `npm run build` writes `out/projects/buriccat/index.html` (one `h1`, one `main`, the body text), `npm run dev` serves `/projects/buriccat/` with 200 and an unknown slug with 404, and `dynamicParams = false` works with `output: 'export'`. The `@next/mdx` fallback is not needed.
- **How the body renders.** Velite's `s.mdx()` gives a function-body string. `MdxContent` runs it with `new Function(code)(runtime)` (Velite's documented way) and calls the result as a plain function. It is a server component, so nothing is evaluated in the browser, and the code is our own content at build time. Calling it directly (not as `<Content />`) is because the React Compiler lint rule `react-hooks/static-components` rejects creating a component during render. MDX with no custom components has no hooks, so this is safe. Custom components passed in through a `components` map would render as normal React elements and may use hooks (a component that needs the browser carries its own `use client`); the call `mdx.default({})` would then need to pass that map. **Content must stay trusted:** MDX `{expressions}` run at build time, so treat anyone else's MDX like code in a review. A cleaner option for later is to build the function once per slug at module scope.
- **The `CaseStudy` type** is derived with `(typeof caseStudies)[number]` in `src/lib/types.ts`. A direct `export type ... from '#site/content'` failed typecheck (TS2305) because the alias points at `.velite/index.js` and `allowJs` makes TypeScript infer from the JavaScript and ignore Velite's `index.d.ts`. The inferred type has the same shape.
