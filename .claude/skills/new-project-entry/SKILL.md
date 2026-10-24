---
name: new-project-entry
description: Checklist for adding a portfolio project (data entry plus MDX case study). Use when adding or editing a project.
---
1. Add a `Project` entry to `src/data/projects.ts` (shape in `docs/spec.md`). Unique `slug`.
2. Add `content/projects/<slug>.mdx` with frontmatter matching the schema.
3. Put the cover image in `public/` with meaningful `alt` text (`A11Y-04`).
4. Use `TODO(human)` for any fact you do not have.
5. Run `/test`; the build must pass.
