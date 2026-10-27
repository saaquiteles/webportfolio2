# Web Portfolio

A personal portfolio: a motion-heavy creative showcase plus a general site (about, projects, blog). Static export for GitHub Pages; deploying is on hold for now.

## Working agreement (read first)
- Work ONLY inside this workspace. Never write outside it, except this project's Claude memory folder, which the hook allows.
- Git writes (commit, add, etc.) only when the human explicitly asks. Never push, force-push or `reset --hard` unprompted.
- Requirements come from `docs/`. Read `docs/requirements.md` and `docs/spec.md` before coding.
- Use the words in `docs/glossary.md` exactly. Propose new or fuzzy words; add them only after the human says yes.
- The human is learning: explain plans in plain language and get approval before writing code.
- Explain everything as if to a beginner (define terms, everyday example, why before how, a short summary at the end).
- After each task passes its checks and review, write a learning note (see `.claude/rules/learning.md`).
- Anything that must never happen is a hook, not a rule. See `.claude/settings.json`.

## Area map
| Area | Stack | Folder |
|---|---|---|
| app | Next.js App Router, static export, GitHub Actions, root tooling (owner proposed in ADR 0006) | `src/app`, `public/`, `next.config.mjs`, `.github/`, root config files (`package.json`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.mts`, `postcss.config.mjs`, `.gitignore`, `.gitattributes`) |
| ui | Tailwind, shadcn/Radix, Framer Motion | `src/components` |
| content | MDX via Velite, typed data | `content/`, `src/data`, `src/lib` |

Full check before saying "done": `npm run check` (typecheck, lint, tests, hook self-test, build). The build is the real proof, because a static export fails on anything that needs a server. The content step (`npm run content`, which creates `.velite/`) runs automatically before typecheck, tests and build; if you call `vitest` or `tsc` directly, run it first.

Agents live in `.claude/agents/`, commands in `.claude/commands/`, short rule summaries in `.claude/rules/`.

## Fixed (do not change)
- `docs/requirements.md`, `docs/spec.md`, `docs/standards.md`: the human owns these. Propose changes as an ADR in `docs/adr/` with `Status: Proposed`.
- `docs/glossary.md`: the human owns it. The agent proposes words and adds them only after the human's yes.
- `.claude/settings.json` and `.claude/hooks/`: the locks, edited only by the human.
- Names fixed by the spec (routes, data shapes, content frontmatter fields).

## Flow
Step 0: choose the level with one question: can this be undone with `git revert`, and how much breaks if it is wrong? Say "Flow: <level>, because <one line>" and wait for approval. If unsure, take full flow.

| Level | Use it when | Flow |
|---|---|---|
| Short path | Easy to undo AND small: one area, one or two files, about 30 lines, no visible behaviour change (a copy fix, a style tweak, an obvious local bug) | One-line approval, one test first, change, `npm run check`, short learning note, quick checklist review in the main session |
| Full flow | Anything else, and always when it is hard to undo or reaches wide: changes to `next.config.mjs`, the deploy workflow or `basePath`; a new dependency or pattern; a change to the spec or content schema; more than one area; personal data (contact details, photos of people); whole-site accessibility | The full loop below, plus contracts confirmed in writing before the first test, a rollback named in the plan, a whole-area review at the end, an ADR (`Status: Proposed`) for any new decision, and a stop to ask whenever something is unclear |

Full loop:
```
/start-story -> /plan -> (human approves)
-> per task: build test-first -> `npm run check` -> /review (Spec, then Standards) -> apply the recommended fixes
   -> learning note -> next task (at a story boundary, or when the status line says "compact soon", first write the next step and the approvals into the plan file, then the human runs /clear or /compact)
End of each story: /review whole <area>, then /retro. Before the first push the human reads `npm run publish-review` (the diff of all public text) and `docs/follow-ups.md`.
```
After `/review`, apply the recommended fixes unless the human says skip. Ask first about behaviour changes and anything outside the task.

Never skipped: human approval, a test first, the full check, a learning note, a review, every guardrail.

## Standards
Numbered rules live in `docs/standards.md` (IDs like `TS-01`, `A11Y-02`), each tagged tool or review. Short rule files in `.claude/rules/` cover git, shell and edits, comments, testing, learning and portfolio safety; where a rule file and `docs/standards.md` differ, the standards win.
