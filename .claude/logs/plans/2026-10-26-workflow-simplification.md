# Plan: simplify the agentic workflow (using ideas from agentic-workflow-matt)
Flow: Level 3, because it rewrites `CLAUDE.md` and the flow itself, edits human-owned docs, and removes agents, commands and hooks.
Status: Approved by the human on 2026-10-26 ("All recommended", all eight decisions, plus "I still want to learn: apply my learning method").

Door and blast radius: two-way door (every step is committed to git and can be reverted). Blast radius: the workflow files only; no site code changes.
Contract (what proves it works): there is no unit test for workflow files. The proof is (1) a search finds no leftover old words, (2) `npm run typecheck && npm run lint && npm test && npm run build` still passes, and (3) a pilot on the next real story (Phase 5).

## Progress (updated 2026-10-26)
| Task | State | Learning note |
|---|---|---|
| W1 housekeeping | done | `2026-10-26-w1-housekeeping.md` |
| W2 glossary, contract rename, standards tags | done | `2026-10-26-w2-glossary-and-standards.md` |
| W3 templates, `CLAUDE.md`, `npm run check` | done | `2026-10-26-w3-templates-and-claude-md.md` |
| W4 template shrink, ADRs into `docs/adr/` | done | `2026-10-26-w4-template-and-adrs.md` |
| W5 one builder, two-pass review, `/retro` | done | `2026-10-26-w5-agents-and-commands.md` |
| W6 locked files | waiting for the human (the self-test is drafted and passes) | none yet |
| W7 first `/retro` | done (suggestions waiting for the human) | `2026-10-26-w7-first-retro.md` |
| W8 pilot on the next real story | not started | none yet |
| Follow-ups (human's yes) | done: 3 glossary words, `requirements.md` pointer, retro items 4 and 5; the human disabled the deploy workflow | `2026-10-26-w9-followups.md` |
Nothing is committed yet; the human asks for the commits after reviewing.

## Decisions (all approved)
D1 two levels, chosen by the door-and-blast-radius test. D2 one `builder` plus `reviewer` and `planner`. D3 glossary option B (agent proposes, human says yes) plus cleanup and the "seam" to "contract" rename. D4 ADRs straight into `docs/adr/` with `Status: Proposed`. D5 add `npm run check`. D6 drop the soft hooks `track.js` and `remind-tests.js` (the human deletes them). D7 `/review` applies the recommended set by default and asks only for behaviour changes and anything outside the task. D8 one learning note per task after the review, about 40 lines, every section kept.

## Learning method (the human's requirement, applies to every task)
Beginner explanations (define each term, an everyday example, why before how, a short summary at the end). One note per task in `.claude/logs/learning/`, with Who did what (about six bullets), What was built, Why, Key terms, Follow the flow, What the tests prove (and what they do not), What the review changed, 3 likely questions. Short-path tasks get an inline checklist review in the main session, not a reviewer agent.

## Tasks
| # | Task | First failing check | Acceptance criteria | Blocked by |
|---|---|---|---|---|
| W1 | Phase 0: ignore the nested `agentic-workflow-matt/` repo; update local `main` and delete the local `dev` branch | `git check-ignore -q agentic-workflow-matt` exits 1 (not ignored) | folder ignored; `git status` no longer lists it; local `main` equals `origin/main`; `dev` gone locally | none |
| W2 | 1.1 to 1.3: rebuild `docs/glossary.md`; rename seam to contract; add the "Enforced by" column to `docs/standards.md` | search finds "seam" in 3 docs and 4 agent or command files; glossary has no Avoid column | glossary has Product, Workflow and Tool sections, an Avoid column and 7 new terms (project, draft, placeholder, Lab Notebook, design token, contract, ADR); no live "seam" in files that survive (the rest go in W3 and W5); every standard says tool or review, as a short tag with the detail after | W1 |
| W3 | 1.4 to 1.7: new plan and learning templates, `rules/learning.md`, `CLAUDE.md` (two levels, `npm run check`, glossary line, ADR location, `/clear`), delete `rules/typescript-standards.md`; add the `check` script to `package.json` (moved here from W5 so `CLAUDE.md` is true) | search finds "Level 2", "Draft" and the duplicated full-check command | templates match D8 and the four-column plan; the learning template keeps a place for the failing (red) result, because `TE-01` points at it; `CLAUDE.md`, `/plan` and the planner say "ADR", not "ADR draft"; `CLAUDE.md` states the check once; the duplicate rule file is gone | W2 |
| W4 | 1.8: shrink `WORKFLOW-TEMPLATE-generic.md`; 1.9: move ADR drafts into `docs/adr/` and delete `adr-drafts/` and `work-reports/` | the template is about 18 KB and mentions retail-bank; ADRs sit in `logs/adr-drafts/` | template about one page plus appendix; ADRs 0002 to 0009 in `docs/adr/` as Proposed; old folders gone | W3 |
| W5 | Phase 2: `builder` agent, reviewer and planner updates, commands rewritten or merged (the `check` script moved to W3) | `.claude/agents/builder.md` does not exist | 3 agents and 6 commands; `npm run check` passes | W4 |
| W6 | Phase 3: the human edits the locked files: add `Bash(npm run check:*)` to the allow-list (without it every `npm run check` prompts), remove the `PostToolUse` and `Stop` hook entries, delete `track.js`, `remind-tests.js` and `state.json`, move the drafted hook self-test from `.claude/logs/guards.test.mjs` to `.claude/hooks/guards.test.mjs` (27 checks, all passing; it uses Node's built-in test runner, no new dependency), then tell me so I add `node --test .claude/hooks/guards.test.mjs` to `npm run check`; optional: put `Read(**/.env)` and `Read(**/.env.*)` back in `permissions.deny` (the W4 review found a shell hook does not stop the file-reading tool, so today nothing blocks a `Read` of a real `.env`) | n/a | `settings.json` and hooks as in the plan | W5 |
| W7 | Phase 4: first `/retro` on the scaffold story | `/retro` does not exist until W5 | a worst-first list; the human decides what changes | W5 |
| W8 | Phase 5: pilot on the next real story (design tokens and fonts) | n/a | about three approval stops; friction written down | W6, W7 |

## W5 hit list (from the W3 review: where old files contradict the new `CLAUDE.md`)
- `commands/plan.md`: three levels, "ADR draft", the planner only for Level 2.
- `agents/planner.md`: names the four old builders, says "ADR draft", lacks the door-and-blast line and the four-column format.
- `agents/app-dev.md`, `content-dev.md`, `ui-dev.md`, `designer.md`, `test-writer.md`: replaced by one `builder` (they also say "Level N", "seam" and "Status: Draft").
- `commands/apply-review.md`: the human picks findings; the new rule applies the recommended set, so merge it into `/review`.
- `commands/design.md` (also says "ADR drafts in adr-drafts"), `fix.md`, `report.md`, `test.md`: merged or deleted; `/test` should say `npm run check`.
- `skills/new-blog-post` and `new-project-entry`: say "Run `/test`"; update the wording if `/test` changes.
- `commands/review.md`: add the Spec-then-Standards pass; add `/retro`.
- After W5, remove the "(`/retro` and the two-pass `/review` are being added…)" line from `CLAUDE.md`.
- Left as history: the 2026-10-24 learning notes and plan.

## Out of scope
Any site code, the deploy workflow, the GitHub-side clean-up (the human does it), and the real content (waiting for the resume).

## Rollback
Every task is committed separately, so `git revert <commit>` undoes it. The old template and agents stay in git history. Nothing is deleted outside git.

## Questions
None open. The human's yes is already given for the human-owned docs (glossary, `standards.md`, `WORKFLOW-TEMPLATE-generic.md`) and for `CLAUDE.md`.

Status: Approved
