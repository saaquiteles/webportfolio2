# ADR 0011: Profile data and the About shapes

Status: Accepted by the human on 2026-10-26, with the recommended options. Raised by the first content story.

## Gap
`docs/spec.md` fixes the `Experience` shape (`role`, `org`, `start`, `end?`, `summary`) but has nowhere for the person's name, headline, tagline and contact links, and no place for education, a certification or the Japan site visits. `ST-01` asks for an ADR for a new file such as `src/data/profile.ts`.

## Proposal
- **`src/data/profile.ts`** holds one `Profile` record: `{ name, headline, tagline, email, links: { linkedin, github }, photo?: { src, alt } }`. The home page, the contact page, the contact links and the page metadata all read from it, so a published string lives in one place.
- **Education and the "Also" items.** Two options:
  - (a) add `kind: 'work' | 'education' | 'certification' | 'other'` to `Experience`;
  - (b) keep `Experience` for roles only and add separate lists in `src/data/experience.ts`: `Education { degree, school, start, end? }` and `Highlight { title, org, date, summary? }`.
- **Recommendation: (b).** The glossary defines an Experience entry as "one role", so (a) would stretch the word, and (b) needs no new file. It needs two glossary words (for example "Education entry" and "Highlight"), which the human accepts.
- **Dates are stored as `YYYY-MM` strings** and parsed directly (no `Date` object is built), so no date shifts by a month in another time zone.

## Why
One `Profile` record means a typo or a change is made once, and a test can assert the exact approved strings. Keeping each type to one meaning keeps the glossary honest.

## Consequences
- `docs/spec.md` should list `profile.ts`, the new types and the `YYYY-MM` rule once this is accepted.
- The shared types go in `src/lib/types.ts` (`TS-02`).
- Everything in `Profile` is public by design. Nothing about the address or phone goes in it (ADR 0010).
