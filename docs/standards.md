# Coding standards (numbered so reviews can cite them)

## TypeScript (TS)
- TS-01 `strict` mode on. No `any`; use `unknown` and narrow.
- TS-02 Data shapes from `docs/spec.md` are typed once in `src/lib/types.ts` and imported, never redefined.
- TS-03 Components are function components with a typed props interface.
- TS-04 No unused exports, no commented-out code.

## Structure (ST)
- ST-01 Files live where `docs/spec.md` says. A new folder needs an ADR draft.
- ST-02 Only `src/components/animations/` imports `framer-motion`.
- ST-03 Only `src/components/ui/` holds shadcn primitives; do not hand-edit them beyond theme tokens.
- ST-04 Pages stay thin: fetch content, compose components.
- ST-05 Colours, spacing and fonts come from Tailwind theme tokens, not hard-coded values.

## Accessibility (A11Y)
- A11Y-01 Semantic landmarks (`header`, `nav`, `main`, `footer`) and one `h1` per page.
- A11Y-02 Every interactive element is reachable and operable by keyboard with a visible focus ring.
- A11Y-03 Every animation checks `prefers-reduced-motion` and falls back to no motion or a simple fade.
- A11Y-04 Images have meaningful `alt` text (empty `alt` only if decorative).
- A11Y-05 Text contrast meets WCAG AA.

## Content (CT)
- CT-01 Content frontmatter matches the schema; the build fails on a mismatch.
- CT-02 Posts with `draft: true` never appear in a production build.
- CT-03 Images referenced from MDX live in `public/` and are optimised before commit.

## Testing (TE)
- TE-01 A failing test comes first.
- TE-02 Test behaviour through the seam (rendered component, content schema), not internals.
- TE-03 A broken static export is a failed test: `npm run build` must pass.

## Static export (SE)
- SE-01 No server-only features (see the list in `docs/spec.md`).
- SE-02 Internal links go through `next/link` so `basePath` is applied.
