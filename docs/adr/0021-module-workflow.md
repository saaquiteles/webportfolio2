# ADR 0021: Update the human's files and the public text to match the new way of working

Status: Accepted on 2026-11-09 (the human decided). Raised on 2026-11-08, when the project started following `WORKFLOW-TEMPLATE-generic.md`. The README and the portfolio case study were updated on 2026-11-08, and `docs/standards.md` TE-01 and the glossary rows were pasted on 2026-11-09.

Decision in one sentence: change four places that still describe the old way of working, and add the new words the workflow uses to the glossary.

## Gap
The project now builds in **functionality modules**. A module is one complete piece of behaviour, built and checked as a unit. Three things changed:
- Work is done in modules, not in tasks.
- No learning note is written after each task. Learning is on demand, through the `/teach` command.
- One commit is made per finished module.

Four places that the agent does not own still describe the old way:
1. The "How it is built" sentence in `README.md`.
2. The portfolio case study, `content/projects/portfolio.mdx`.
3. Rule `TE-01` in `docs/standards.md`.
4. The "Vertical slice" row in `docs/glossary.md`.

The README and the case study are public text. Right now they say something that is no longer true.

## Proposal
Replace those four places with the text below, and add the new glossary words. The human edits `docs/standards.md` and `docs/glossary.md`. The README and the case study are the human's published text, so the agent changes them only after the human says yes.

## Why
A rule or a public sentence that describes a process the project no longer follows will mislead the next reader and the next review.

## Consequences
Lines for the human to paste:

- `README.md`, "How it is built". Replace the sentence with: `Every code change is made test first with Claude Code, in small functionality modules. Each module passes \`npm run check\`, and a second agent reviews it before it is committed. The rules live in \`CLAUDE.md\` and \`docs/standards.md\`.`
- `content/projects/portfolio.mdx`, line 19. Replace with: `Every code change is made test first with Claude Code. An automated check runs the type check, lint, tests and the static build, and a second agent reviews each finished piece of functionality before it is committed.`
- `docs/standards.md`. Replace the `TE-01` line with: `- TE-01 A failing test comes first, where practical. [review] The builder's report quotes the red result, and a test that was green on its first run is shown able to fail (a mutation check).`
- `docs/glossary.md`. Replace the "Vertical slice" row, and add these rows:
  - `| Functionality module | One coherent piece of behaviour, built and verified as a unit, with its happy path and relevant sad paths. | task, ticket |`
  - `| Happy path | The expected successful journey through a functionality. | normal case |`
  - `| Sad path | An expected failure: invalid input, an error, an empty state, a denied case or a boundary. | edge case (when it means a failure) |`
  - `| Mutation check | Break the exact line a test protects, watch the test fail, then restore the line. | sanity check |`
  - `| Module commit | The single commit made after a functionality module has passed its checks and review. | task commit |`
  - `| Spike | A throwaway experiment that answers one question; nothing from it ships. | prototype |`

Until the human pastes the `TE-01` line, `docs/standards.md` and `.claude/rules/testing.md` disagree. The rule file allows a failing test "where practical", and the standards do not.

Rollback: revert the commit that makes these edits. Nothing else depends on them.
