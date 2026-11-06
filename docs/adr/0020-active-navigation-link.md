# ADR 0020: The active navigation link, and the first client component

Status: Accepted by the human on 2026-10-27. Raised by the styling story plan.

## Gap
The header should mark the current page with `aria-current="page"` (a parked follow-up and an accessibility basic). A layout cannot know which page is showing, so the check has to happen in the browser. Every component so far is a server component.

## Proposal
Add `src/components/global/NavLink.tsx`, a small `'use client'` component. It reads `usePathname()` from `next/navigation`, trims a trailing slash, and sets `aria-current="page"` on an exact match. `SiteHeader` stays a server component and uses it. Links still go through `next/link` (`SE-02`). On a case-study page (`/projects/<slug>/`), Projects is not marked as the current page, because it is not that page.

## Why
It is the smallest way to get a correct `aria-current`, and the static export still works: React renders the component at build time and the value is fixed into the HTML for each page, then kept correct by hydration.

## Consequences
- It is the first `'use client'` component, a new pattern. Tests mock `next/navigation`.
- The node-environment layout and placeholder tests render the header without a router; `usePathname` returns null there, so no link is current (checked in T7; `SiteHeader.test.tsx` covers the null case directly).
- The built HTML for each page is checked by hand once (`out/about/index.html` has `aria-current="page"` on About only).
- Rollback: revert the commit; the header goes back to a server component without `aria-current`.
