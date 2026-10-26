# ADR 0014: Site header, nav and footer, and where shared components live

Status: Accepted by the human on 2026-10-26, with the recommended options. Raised by the first content story. Only needed if the human wants a header, nav and footer in this story.

## Gap
The new pages (About, Contact, Projects) need links pointing to them, and `A11Y-01` asks for `header`, `nav` and `footer` landmarks, but the interview did not cover them. `docs/spec.md` puts shared pieces in `src/components/global/` and shadcn primitives only in `ui/` (`ST-03`), so page-specific components such as `ExperienceList`, `ProjectCard`, `ProfilePhoto` and `MdxContent` have no agreed home.

## Proposal
- **`SiteHeader`** (with a navigation named "Main" linking to Home, About, Contact, and Projects once it exists) and **`SiteFooter`**, both in `src/components/global/` and added to the root layout. Internal links use `next/link` (`SE-02`). Focus is visible (`A11Y-02`). An optional "Skip to content" link helps keyboard users.
- **The footer** holds only what the human approves, with the recommendation of the name and the year and nothing else.
- **Page-specific components** go in a new folder, `src/components/sections/`, so `global/` stays for what is on every page. This new folder is recorded here, as `ST-01` asks.

## Why
Without navigation the new pages are unreachable. A new, clearly named folder avoids stretching the meaning of `global/` or `ui/`.

## Consequences
- The layout test changes first: its `<body>x</body>` check becomes "the body has a header, the children and a footer, and still no second `main`".
- If `next/link` needs a router in the test environment, a small mock may be needed.
- `docs/spec.md` should list `src/components/sections/` once this is accepted.
- This is a whole-site change, so it is a full-flow task and is reviewed as one.
