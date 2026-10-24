# ADR draft 0005: Tailwind v4, configured in CSS

Status: Draft (the human decides). Raised by T5.

## Gap
`docs/spec.md` says only "Tailwind CSS". The architecture notes this project started from list a `tailwind.config.ts`. Tailwind v4 has no such file by default: it is configured in the CSS.

## Proposal
Use Tailwind v4 (installed: `tailwindcss` and `@tailwindcss/postcss` 4.3.3, dev dependencies). `src/app/globals.css` holds `@import "tailwindcss";`, and `postcss.config.mjs` runs the plugin. The theme tokens from `docs/design.md` (`paper`, `surface`, `ink`, `tomato`, `blueprint`) go in an `@theme` block in `globals.css`, not in a config file (`ST-05`). Update the spec line to say "Tailwind CSS v4 (CSS-first, no `tailwind.config.ts`)".

## Why
v4 is the current major version. The tokens are plain CSS variables, so components and tests can read them without a build step. `postcss` is not installed separately: `@tailwindcss/postcss` already brings it.

## Consequences
- The tokens were deliberately left out of the scaffold. They arrive in the design story, and the contrast ratios in `docs/design.md` must be re-checked when they are wired up.
- Until then the page has the Tailwind reset and no theme, so headings look plain. That is expected.
- Later work that expects a `tailwind.config.ts` (plugins written for v3) needs the v4 equivalents.
