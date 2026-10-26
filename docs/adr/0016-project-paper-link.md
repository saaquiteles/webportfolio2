# ADR 0016: A paper link on Project

Status: Proposed (the human decides). Raised when the thesis paper became the first project.

## Gap
`docs/spec.md` fixes `Project.links` as `{ live?: string; repo?: string }`. The thesis project has a published paper (`https://ebooks.iospress.nl/doi/10.3233/ATDE251126`), which is neither a live demo nor a code repository, and its code is not published yet.

## Proposal
- **(a) Add an optional `paper?: string` to `links`**: `{ live?, repo?, paper? }`. The new field is optional, so existing projects need no change.
- **(b) Put the paper link under `live`.** Needs no change, but "live" would then mean something else, which the glossary's one-word-one-meaning rule avoids.
- **Recommendation: (a).** The human said yes to it on 2026-10-26.

## Why
A field name that says what it holds keeps the data honest, and a card can later label the link "Paper" without guessing.

## Consequences
- `docs/spec.md` should show `links?: { live?, repo?, paper? }` once this is accepted.
- The `Project` type in `src/lib/types.ts` gets the new optional field (`TS-02`).
- Project order is the order of the list in `src/data/projects.ts` (the thesis first), not a new field.
- The published paper's authors are named on the case study: Darryl Angelo O. Narvaez, Sean Argie A. Quiteles and Cyrel O. Manlises (as listed by the publisher; the human approved naming the co-authors).
