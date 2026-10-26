# ADR 0012: The Project shape: cover image and drift

Status: Accepted by the human on 2026-10-26, with the recommended options. Raised by the first content story.

## Gap
1. `docs/spec.md` requires `Project.cover` (a path under `/public`), but there is no image yet for either project, and the shape has no field for the image's `alt` text, which `A11Y-04` needs.
2. Spec requirement R-08 says adding a project is one MDX file plus one data entry. The two repeat `slug`, `title`, `summary` and `tags`, so they can drift apart.

## Proposal
**Cover.**
- (a) make it optional: `cover?: { src: string; alt: string }`, and render no image when it is absent;
- (b) supply a Buriccat screenshot or the logo now.
- **Recommendation: (a).** No image exists yet, and screenshots are a later, optional step. A card with no image is fine.

**Drift.**
- (a) keep both the data entry and the MDX frontmatter, as R-08 says, and add a test that fails on any mismatch (same slug, title, summary and tags; `year` equals the year of `date`; every case study has a Project and the reverse);
- (b) make the MDX frontmatter the only source and drop `projects.ts`, which changes R-08 and the spec;
- (c) keep only the fields that are not in the frontmatter in `projects.ts` and join them by slug.
- **Recommendation: (a) now.** It needs no requirement change, and a test catches drift. Revisit (b) later.

## Why
A required field with nothing to fill it forces a fake value, which is worse than an honest "no image". A test that compares the two sources makes the duplication safe instead of risky.

## Consequences
- `docs/spec.md` should show `cover` as optional with an `alt`.
- The drift test lives in `src/data/projects.test.ts` and fails the full check if the two sources disagree.
- The Project shape lives in `src/lib/types.ts` (`TS-02`).
