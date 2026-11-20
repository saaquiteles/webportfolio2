# ADR 0027: Home holds the project index, so the Projects page goes

Status: Proposed. Raised on 2026-11-20, when the human saw that the Projects column on Home and the Projects tab show the same cards.

## Decision
Show every project on Home, and remove the `/projects/` page and its tab. Case studies stay at `/projects/[slug]/`.

## Gap
`docs/spec.md` lists `/projects/` as the "Project index". Home also shows the featured projects, and today all three projects are featured. So both pages show the same three cards, and the Projects tab only adds a click. The picked-up project overlay (story S7) also needs one home, not two.

## Proposal
- **Home shows all projects**, in the order of `src/data/projects.ts`, each with the Pick up button. Home is the single project index.
- **Remove `/projects/`** (page, tests and the tab). The main navigation becomes Home, About, Contact.
- **Keep `/projects/[slug]/`.** Every case study keeps its own address, so it can be shared and bookmarked. The overlay's "Read the full case study" link and the card's title link still lead there.
- **Spec change for the human to make** in `docs/spec.md`, in the Routes table: remove the row `/projects/` (Project index) and change the Home row to "Home / showcase and project index". Requirement R-02 ("Projects index and one case-study page per project") is still met: the index is on Home.
- **The `featured` field stays** in the `Project` shape, because the spec fixes the data shapes. Nothing reads it after this change. Removing it is a later, separate spec change.

## Why
One place for projects means one list to keep right and one place where the pickup is tuned. A separate index page earns its place only when the list is long. With three projects it is a duplicate.

## Consequences
- Nothing is deployed yet, so no live link to `/projects/` breaks.
- If the list grows past about six projects, a Projects index can come back, and `featured` can decide what Home shows.
- Home gets heavier: the pickup code loads there too. The Lighthouse baseline for Home (and the earlier `/projects/` baseline of 88) is compared again at the end of S7.
- Plans, retros and learning notes that mention the Projects page keep their text as history.
- Changes made by the agent after the human approves this ADR (in the S7 plan, chunk 2): `src/app/page.tsx`, `src/components/global/SiteHeader.tsx`, the Projects page and its tests removed, tests updated, and the line about the shared grid in `docs/design.md`.
- Not changed by the agent: `docs/spec.md` (the human owns it).
