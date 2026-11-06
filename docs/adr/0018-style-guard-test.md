# ADR 0018: A test that fails on hard-coded colours and arbitrary Tailwind values (ST-05)

Status: Accepted by the human on 2026-10-27, with the recommended options (including `--color-*: initial`). Raised by the styling story plan.

## Gap
`ST-05` says colours, spacing and fonts come from theme tokens, but it is review-only, so a stray `#fff` or `p-[13px]` passes `npm run check`. The standards list "a lint rule against hard-coded colours" as a candidate to automate. A second gap: `A11Y-05` (contrast) has no tool check, and `A11Y-04` and its candidate line in `docs/standards.md` still say the alt-text lint rule is only a warning, though `eslint.config.mjs` now sets it to an error.

## Proposal
- **A test, not an eslint plugin** (the same style as the privacy guard): `src/lib/style-guard.ts` exports `findStyleIssues(text)`, and `src/lib/style-guard.test.ts` scans the non-test `.ts`, `.tsx`, `.css` and `.mdx` files under `src/` and `content/` (from `git ls-files`, plus untracked files that are not ignored). Each finding prints the file and the match.
- **It flags:** a hex colour, an arbitrary value (`<utility>-[...]`, such as `p-[13px]` or `bg-[#fff]`) and an arbitrary property (`[mask-type:alpha]`).
- **It allows:** arbitrary variants such as `aria-[current=page]:underline` and `data-[...]:`, because they hold no design value; `#main-content`; HTML entities such as `&#169;`.
- **Exempt:** `src/app/globals.css` (where the tokens live) and test files (fixtures may be literal).
- **Optional addition:** also flag `rgb()`, `hsl()` and `oklch()` outside `globals.css`.
- **Contrast:** `src/app/tokens.test.ts` computes the WCAG ratio of every text and background token pair in `globals.css`.
- **Default palette:** put `--color-*: initial;` in the `@theme` block so Tailwind's default colours do not exist and only the Lab Notebook tokens can be used. Recommended.

## Why
A rule a reader must remember is weaker than a test that runs on every check, and this project already turned the privacy and placeholder rules into tests the same way.

## Consequences
Lines for the human to paste into `docs/standards.md`:
- Replace the `ST-05` line with: `- ST-05 Colours, spacing and fonts come from Tailwind theme tokens, not hard-coded values. [tool + review] \`src/lib/style-guard.test.ts\` fails on a hex colour or an arbitrary Tailwind value (like \`p-[13px]\`) outside \`src/app/globals.css\`. A reader catches the rest (inline \`style\`, named CSS colours).`
- Replace the `A11Y-05` line with: `- A11Y-05 Text contrast meets WCAG AA. [tool + review] \`src/app/tokens.test.ts\` computes the WCAG ratio of each text and background token pair in \`globals.css\`. A reader checks text over images and the grid on real screens.`
- Replace the `A11Y-04` line with: `- A11Y-04 Images have meaningful \`alt\` text (empty \`alt\` only if decorative). [tool + review] The eslint rule \`jsx-a11y/alt-text\` is an error, so a missing \`alt\` fails the check. A reader judges whether the text is meaningful.`
- Delete from "Candidates to automate" the `ST-05` line and the `A11Y-04` line.
- Rollback: revert the commit that adds the test. For a false alarm, narrow the pattern test first instead.
