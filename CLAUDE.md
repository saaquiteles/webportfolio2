# Web Portfolio

A personal portfolio: a motion-heavy creative showcase plus a general site (about, projects, blog). Static export hosted on GitHub Pages.

## Working agreement (read first)
- Work ONLY inside this workspace. Never write outside it.
- Git writes (commit, add, etc.) only when the human explicitly asks. Never push, force-push or `reset --hard` unprompted.
- Requirements come from `docs/`. Read `docs/requirements.md` and `docs/spec.md` before coding.
- The human is learning: explain plans in plain language and get approval before writing code.
- Explain everything as if to a beginner (define terms, everyday example, why before how, a short summary at the end).
- After each task passes its tests, write a learning note (see `.claude/rules/learning.md`).
- Anything that must never happen is a hook, not a rule. See `.claude/settings.json`.

## Area map
| Area | Stack | Folder | Test command |
|---|---|---|---|
| app | Next.js App Router, static export, GitHub Actions, root tooling (owner proposed in ADR draft 0006) | `src/app`, `public/`, `next.config.mjs`, `.github/`, root config files (`package.json`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.mts`, `postcss.config.mjs`, `.gitignore`) | `npm run typecheck && npm run lint && npm test && npm run build` |
| ui | Tailwind, shadcn/Radix, Framer Motion | `src/components` | `npm test` |
| content | MDX via Velite, typed data | `content/`, `src/data`, `src/lib` | `npm test` |

Full check before saying "done": `npm run typecheck && npm run lint && npm test && npm run build`. The build is the real proof, because a static export fails on anything that needs a server.

## Agents
`planner` (read-only), builders: `app-dev`, `ui-dev`, `content-dev`, `designer` (presentation only), helpers: `test-writer`, `reviewer` (read-only).

## Fixed (do not change)
- `docs/requirements.md`, `docs/spec.md`, `docs/standards.md`, `docs/glossary.md`: the human owns these. Propose changes as an ADR draft in `.claude/logs/adr-drafts/`.
- `.claude/settings.json` and `.claude/hooks/`: the locks. Never loosen them.
- Names fixed by the spec (routes, data shapes, content frontmatter fields).

## Flow
Step 0: say "Flow: <level>, because <reasons>" and wait for approval. Highest triggered level wins; if unsure, go one up.

| Level | Use it when | Flow |
|---|---|---|
| 1. Short path | ALL true: one area, one or two files, under about 30 lines, no visible behaviour change (or an obvious local bug, a copy fix, a style tweak) | 1-2 sentence approval, one test first, change, `/test`, short learning note, `/review` |
| 2. Full flow | Anything that is not 1 or 3 | The full loop |
| 3. Full flow, extra care | ANY true: changes `next.config.mjs`, the deploy workflow or `basePath`; a new dependency or pattern; a change to the spec or content schema; more than one area; personal data (contact details, photos of people); anything affecting accessibility of the whole site | Full loop plus seams confirmed in writing, rollback named in the plan, `/apply-review` for every must-fix, whole-area review at the end, ADR draft for new decisions, stop and ask when unclear |

Full loop:
```
/start-story -> /plan -> (human approves) -> build ONE small task, test-first
  -> /test -> draft learning note -> /review
  -> /apply-review (only the findings the human picks)
  -> /test -> final learning note -> next task
End of each story: /review whole <area> for every area the story changed
```
Never skipped: human approval, a test first, `/test`, a learning note, `/review`, every guardrail.

## Standards
Numbered rules live in `docs/standards.md` (IDs like `TS-01`, `A11Y-02`). Rule files in `.claude/rules/` are summaries; the originals win.
