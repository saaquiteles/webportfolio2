# Coding standards (numbered so reviews can cite them)

Each rule ends with how it is enforced:
- **[tool]** a command fails if the rule is broken, so nobody has to remember it.
- **[review]** only a reader can catch it, so the reviewer checks it.
- **[tool + review]** a tool catches part of it, a reader the rest.

A mistake that a reader catches twice should become a tool check. See "Candidates to automate" at the end.

## TypeScript (TS)
- TS-01 `strict` mode on. No `any`; use `unknown` and narrow. [tool] tsc strict mode (`npm run typecheck`) and the eslint rule `no-explicit-any` (`npm run lint`).
- TS-02 Data shapes from `docs/spec.md` are typed once in `src/lib/types.ts` and imported, never redefined. [review]
- TS-03 Components are function components with a typed props interface. [review]
- TS-04 No unused exports, no commented-out code. [review] eslint only warns on unused local variables, not on unused exports or commented-out code.

## Structure (ST)
- ST-01 Files live where `docs/spec.md` says. A new folder needs an ADR. [review]
- ST-02 Only `src/components/animations/` imports `framer-motion`. [review]
- ST-03 Only `src/components/ui/` holds shadcn primitives; do not hand-edit them beyond theme tokens. [review]
- ST-04 Pages stay thin: fetch content, compose components. [review]
- ST-05 Colours, spacing and fonts come from Tailwind theme tokens, not hard-coded values. [review]

## Accessibility (A11Y)
- A11Y-01 Semantic landmarks (`header`, `nav`, `main`, `footer`) and one `h1` per page. [tool + review] The page and layout tests check one `h1`, one `main`, `lang="en"` and no second `main`. Header, nav and footer are review only.
- A11Y-02 Every interactive element is reachable and operable by keyboard with a visible focus ring. [review]
- A11Y-03 Every animation checks `prefers-reduced-motion` and falls back to no motion or a simple fade. [review]
- A11Y-04 Images have meaningful `alt` text (empty `alt` only if decorative). [tool + review] The eslint rule `jsx-a11y/alt-text` is only a warning, so it never fails a build.
- A11Y-05 Text contrast meets WCAG AA. [review]

## Content (CT)
- CT-01 Content frontmatter matches the schema; the build fails on a mismatch. [tool] The build, once the content layer exists.
- CT-02 Posts with `draft: true` never appear in a production build. [tool] Tests, once the content layer exists.
- CT-03 Images referenced from MDX live in `public/` and are optimised before commit. [review]

## Testing (TE)
- TE-01 A failing test comes first. [review] The learning note shows the red result.
- TE-02 Test behaviour through the contract (rendered component, content schema), not internals. [review]
- TE-03 A broken static export is a failed test: `npm run build` must pass. [tool] The build.

## Static export (SE)
- SE-01 No server-only features (see the list in `docs/spec.md`). [tool + review] The static build fails on most of them, such as API routes and server actions. A reader catches the rest.
- SE-02 Internal links go through `next/link` so `basePath` is applied. [tool] The eslint rule `@next/next/no-html-link-for-pages` is an error. Checked here: an `<a href="/">` in `src/app` fails lint.

## Candidates to automate
Rules that are review-only today but could become a tool check. Each is a full-flow decision, because it adds a rule or a dependency.
- ST-02: eslint `no-restricted-imports` for `framer-motion` outside `animations/`.
- ST-05: a lint rule against hard-coded colours and arbitrary Tailwind values.
- TS-04: a tool such as `knip` for unused exports.
- A11Y-04: promote `jsx-a11y/alt-text` from warn to error once there are images.
