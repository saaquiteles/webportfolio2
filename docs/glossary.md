# Glossary

The human owns this file. During `/start-story` the agent may propose new words; they are added only after the human says yes. The AI uses these words exactly, and the review checks that code, tests and notes use them.

## Product words
| Term | Meaning | Avoid |
|---|---|---|
| Showcase | The visual, motion-heavy pages (home and case studies). | gallery |
| Project | One portfolio piece: a record in `src/data/projects.ts` (once created) plus its case study. | work, item |
| Experience entry | One role, with its organisation and dates, in the experience history (`src/data/experience.ts`, once created). | job, position |
| Education entry | One degree or course of study, with its school and dates, in `src/data/experience.ts` (once created). | schooling |
| Highlight | One short item in the "Also" section of About, such as a certification or a site visit, with a date. | extra, achievement item |
| Case study | One MDX page describing a single project. | project page |
| Post | One MDX blog page. | article, entry |
| Draft | A post with `draft: true`. It never appears in a production build. | unpublished, hidden |
| Placeholder | Text marked `TODO(human)` that stands in for a fact only the human can supply. | dummy text, lorem ipsum |
| Lab Notebook | The chosen visual direction in `docs/design.md`: warm paper, graph-paper grid, sticker-like labels. | style, skin |
| Design token | A named colour, font or spacing value defined once in the Tailwind theme (`src/app/globals.css`, once wired up) and reused everywhere. | magic value, hard-coded colour |
| Wrapper | A small component in `src/components/animations/` that adds motion to its children. | animation helper |
| Reduced motion | An OS setting asking sites to avoid animation. Every animation must respect it. | no-animation mode |

## Workflow words
| Term | Meaning | Avoid |
|---|---|---|
| Contract | The agreed place where a test touches the code (a rendered component, the content schema, a helper function, a config object). Tests check behaviour there, not what is inside, like testing a vending machine by pressing its buttons instead of opening the back. | seam |
| ADR | A short note saying "we chose X because Y". Lives in `docs/adr/` with a Status (Proposed until the human accepts it). | decision doc |
| Short path | The light flow for a small change that is easy to undo: one area, one or two files, about 30 lines, no visible behaviour change. | Level 1 |
| Full flow | The whole loop for everything else, and always for a change that is hard to undo or reaches wide (config, deploy, new dependency, schema, personal data). | Level 2, Level 3 |
| Vertical slice | A task that works end to end when it is finished, like one finished slice of cake instead of a whole layer of sponge. | layer-by-layer task |

## Tool words (for learning)
| Term | Meaning | Avoid |
|---|---|---|
| Static export | Next.js builds plain HTML/CSS/JS into `out/`, with no server needed. | |
| basePath | URL prefix needed when the site lives at `user.github.io/repo`. | |
| Frontmatter | The block of fields at the top of an MDX file (title, date, tags). | |
| Velite | The tool that turns MDX files into typed data at build time. | |
