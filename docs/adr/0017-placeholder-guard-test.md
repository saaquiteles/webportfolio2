# ADR 0017: A test that fails on a placeholder in any rendered page

Status: Accepted by the human on 2026-10-26 ("yes to both"). Raised by the T8 review.

## Gap
Placeholders (`TODO(human)`) are allowed while content is missing, but nothing stops one from reaching a published page. Today only the layout metadata test and a few page tests look for it, so a new page or component could ship a placeholder unnoticed.

## Proposal
One test, `src/app/placeholders.test.tsx`, finds every `page.tsx` under `src/app` by itself, renders each page (every case study too, through `generateStaticParams`), and fails if any output contains `TODO(human)`. It also checks the layout's header and footer.

## Why
A rule asking people to remember is weaker than a test that runs on every `npm run check`. Finding pages automatically means a new page is covered without anyone updating a list.

## Consequences
- A placeholder can still live in a component's own code (`ProfilePhoto` shows one when there is no photo), but it can no longer reach a rendered page without failing the check.
- When a page truly needs a placeholder, the check fails on purpose: fill it in or discuss it first.
- It renders to strings in the node environment, so it does not depend on the browser test setup.
