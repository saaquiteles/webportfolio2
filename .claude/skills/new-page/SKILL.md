---
name: new-page
description: Checklist for adding a route/page. Use when adding or restructuring a page.
---
1. The route must exist in `docs/spec.md`. If not, draft an ADR first.
2. Page file in `src/app/<route>/page.tsx`, thin (`ST-04`), one `h1` and landmarks (`A11Y-01`).
3. `generateStaticParams` for dynamic routes. Links via `next/link` (`SE-02`).
4. Page metadata (title, description, Open Graph).
5. Test that renders the page; then `npm run build`.
