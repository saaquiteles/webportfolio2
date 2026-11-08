# Web Portfolio

A personal portfolio: a motion-heavy creative showcase plus a general site (about, projects, blog). Static export for GitHub Pages; deploying is on hold for now.

## Working agreement (read first)
- Work ONLY inside this workspace. Never write outside it, except this project's Claude memory folder, which the hook allows.
- Git writes (commit, add, etc.) only when the human explicitly asks. Never push, force-push or `reset --hard` unprompted. Commits follow `.claude/rules/git.md`: one commit per completed module (overriding the global atomic-commit rule here), no AI attribution lines.
- Requirements come from `docs/`. Read `docs/requirements.md` and `docs/spec.md` before coding.
- Use the words in `docs/glossary.md` exactly. Propose new or fuzzy words; add them only after the human says yes.
- The human is learning: explain plans in plain language and get approval before writing code. Explain as if to a beginner (define terms, everyday example, why before how, a short summary at the end).
- Build one approved functionality module at a time. Verify its happy path and relevant sad paths, run the full check and review it before the human commits the completed module.
- Learning is on demand: the human runs `/teach` to get an interactive HTML learning file (see `.claude/rules/learning.md`). It is never a required step in the build loop.
- Anything that must never happen is a hook, not a rule. See `.claude/settings.json`.
- `.claude/` is git-ignored and exists only on this machine, so `git revert` cannot undo a change there.

## Area map
| Area | Stack | Folder |
|---|---|---|
| app | Next.js App Router, static export, GitHub Actions, root tooling (owner proposed in ADR 0006) | `src/app`, `public/`, `next.config.mjs`, `.github/`, root config files (`package.json`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.mts`, `vitest.next-font-google.ts`, `postcss.config.mjs`, `.gitignore`, `.gitattributes`) |
| ui | Tailwind, shadcn/Radix, Framer Motion | `src/components` |
| content | MDX via Velite, typed data | `content/`, `src/data`, `src/lib` |

Fast check: `npx vitest run <file>` (run `npm run content` first). Full check before saying "done": `npm run check` (typecheck, lint, tests, hook self-test, build). The build is the real proof, because a static export fails on anything that needs a server. The content step (`npm run content`, which creates `.velite/`) runs automatically before typecheck, tests and build; if you call `vitest` or `tsc` directly, run it first.

Agents live in `.claude/agents/` (organizer, builder, reviewer), commands in `.claude/commands/`, the `/teach` skill and the page, blog and project checklists in `.claude/skills/`, short rule summaries in `.claude/rules/`, plans in `.claude/logs/plans/`, retros in `.claude/logs/retro/`, learning files in `.claude/logs/learning/`.

## Fixed (do not change)
- `docs/requirements.md`, `docs/spec.md`, `docs/standards.md`: the human owns these. Propose changes as an ADR in `docs/adr/` with `Status: Proposed`.
- `docs/glossary.md`: the human owns it. The agent proposes words and adds them only after the human's yes.
- `.claude/settings.json` and `.claude/hooks/`: the locks, edited only by the human.
- Names fixed by the spec (routes, data shapes, content frontmatter fields).

## Flow
Step 0: choose the level with one question: can this be undone with `git revert`, and how much breaks if it is wrong? Say "Flow: <level>, because <one line>" and wait for approval. If unsure, take full flow.

| Level | Use it when | Flow |
|---|---|---|
| Spike | A throwaway experiment to answer one question; nothing from it ships | Say "Flow: spike", the question and a cap (files or steps). Work only in a git-ignored scratch folder (`scratch/`), no branch, no change to `package.json` or the lockfile. It ends with a written answer shown to the human (an ADR or `docs/follow-ups.md`); the human decides when it ends and approves deleting the code. All guardrails apply. Never for real data, personal data or the live site. |
| Short path | Easy to undo AND small: one area, one or two files, about 30 lines, no visible behaviour change (a copy fix, a style tweak, an obvious local bug) | One-line approval, a test first, change, `npm run check`, quick checklist review in the main session, its own commit when the human asks |
| Full flow | Anything else, and always when it is hard to undo or reaches wide: changes to `next.config.mjs`, the deploy workflow or `basePath`; a new dependency or pattern; a change to the spec or content schema; more than one area; personal data (contact details, photos of people); whole-site accessibility | The module loop below, plus contracts confirmed in writing, a rollback named in the plan, a whole-area review at the end, an ADR (`Status: Proposed`) for any new decision, and a stop to ask whenever something is unclear |

Module loop (full flow):
```
/start-story -> discuss and draft the approach -> /organize (organizer structures the draft into modules; concise gap and risk feedback)
-> the human approves the organized plan
-> for each functionality module:
     confirm happy path + relevant sad paths + acceptance criteria
     -> builder implements test-first (fast check), mutation check for a test that was green first time
     -> `npm run check`
     -> /review (Spec, then Standards), run automatically
     -> apply the recommended fixes (ask first about behaviour changes) and re-check
     -> update the plan's Status block and Log; module complete -> the human asks for the commit
-> optional /teach <module-or-topic>
-> end of the story: /review whole <area>, then /retro
```
When the context is getting full (the status line says "compact soon") or at a story boundary, first update the plan's Status block, then the human runs /clear or /compact. Before the first push the human reads `npm run publish-review` (the diff of all public text) and `docs/follow-ups.md`.

Never skipped by the agent: human approval, a test first (or the alternative check approved in the plan), the full check, a review, every guardrail. `/teach` is optional. The human may shorten the learning steps after a `/retro`; the guardrails and approvals stay.

## Standards
Numbered rules live in `docs/standards.md` (IDs like `TS-01`, `A11Y-02`), each tagged tool or review. Short rule files in `.claude/rules/` cover git, shell and edits, comments, testing, learning and portfolio safety; where a rule file and `docs/standards.md` differ, the standards win.
