# Agentic development workflow: a generic, reusable template

Works for any software project (web app, mobile app, API, data pipeline, library, CLI). Nothing here depends on a domain such as banking. Fill in the `<placeholders>` for your project.

Origin: designed on the retail-bank project (2026-10-23). Status: designed and wired there, **not yet proven on a real story**. Treat the numbers (such as "30 lines") as first guesses.

## 1. The idea in one paragraph
Don't ask the AI to "build the app". Give it the requirements and rules, make it plan, approve the plan, then let a specialised agent build **one small, tested step at a time** while you check each step. Locks (hooks) stop dangerous actions. The human approves the key decisions and is the only one who commits.

## 2. Words used here
- **Agent**: a specialised AI helper with its own instructions and tools, defined in a file in `.claude/agents/`.
- **Command**: a saved prompt you run as `/name` (a file in `.claude/commands/`).
- **Rule**: a short instruction file in `.claude/rules/` that every session reads.
- **Hook**: a small script that runs automatically before or after an action and can block it. A lock, not a request.
- **Spec**: the written agreement of what the project must do and how its parts talk (requirements, interfaces, data shapes). The AI must never invent or rename things the spec fixes.
- **TDD (test-driven development)**: write a failing test first, then just enough code to pass it.
- **ADR (Architecture Decision Record)**: a short note saying "we chose X because Y".
- **Refactor**: tidying code without changing what it does.
- **Seam**: the place a test goes through (for example "the public HTTP endpoint" or "the use-case function"), with outside things faked.

## 3. The five layers
| Layer | What it is | Where it lives | Why it exists |
|---|---|---|---|
| 1. Sources of truth | Requirements, spec, coding standards with rule IDs, ADRs, glossary | A docs folder or repo | The AI follows these instead of guessing |
| 2. Rules | Short summaries of the standards, plus working rules (git, comments, testing, safety, learning) | `CLAUDE.md`, `.claude/rules/` | Read every session, so behaviour stays consistent |
| 3. Agents | A planner, a builder per area, a test-writer, a reviewer | `.claude/agents/` | Each has narrow limits and one job |
| 4. Commands | The steps of the flow | `.claude/commands/` | One command per step |
| 5. Hooks + permissions | Automatic locks and allow/deny lists | `.claude/settings.json`, `.claude/hooks/` | Enforcement that doesn't depend on the AI remembering |

**Golden rule:** anything that must never happen belongs in layer 5, not layer 2. A rule can be forgotten. A hook cannot.

## 4. Folder layout
```
CLAUDE.md                       # working agreement, area map, flow, flow levels
.claude/
  settings.json                 # permissions + hook wiring
  agents/                       # planner, reviewer, builders, test-writer
  commands/                     # start-story, plan, test, review, apply-review,
                                #   checkpoint, fix, explain, report
  skills/                       # optional checklists (new-endpoint, new-screen, ...)
  rules/                        # git, comments, testing, learning, <domain>-safety,
                                #   <language>-standards
  hooks/                        # guard-bash, guard-paths, track, remind-tests
  logs/
    plans/                      # saved plans (template + one per task)
    learning/                   # learning notes (template + one per task)
    adr-drafts/                 # decisions to hand to whoever owns the spec
    work-reports/               # reports and talk tracks
  checkpoints/                  # local patch files (safety net)
```

## 5. The flow
### Step 0: choose the level (before any work)
The AI says **"Flow: <level>, because <reasons>"** and waits for approval. The **highest level any trigger hits wins**. If unsure, go one level up. The human can move a task up any time. Moving it down gets one warning, then the AI follows.

| Level | Use it when | Flow |
|---|---|---|
| **1. Short path** | ALL true: one area, one or two files, under about 30 lines, no change to behaviour that users or other systems see (or an obvious local bug) | 1-2 sentence approval, one test first, change, `/test`, short learning note (Draft), `/review`, `/checkpoint` |
| **2. Full flow** | Anything that is not 1 or 3 | The full loop |
| **3. Full flow, extra care** | ANY true: touches something hard to undo or high-impact (money, health, user data, deletion); security or access control; a data-schema change; a public interface or the spec; messaging or concurrency; more than one area; a new dependency or pattern; personal data | The full loop plus: seams confirmed in writing, idempotency (a repeat has no extra effect) and rollback named in the plan, `/apply-review` for every must-fix, a whole-repo review at the end of the task, an ADR draft for new decisions, stop and ask when requirements are unclear |

### The full loop
```
/start-story -> /plan -> (human approves) -> build ONE small task, test-first
  -> /test -> draft learning note -> /review
  -> /apply-review (only the findings the human picks; skip if nothing found)
  -> /test -> final learning note -> /checkpoint -> next task

End of each story: /review whole <area> for every area the story changed
```

| Step | What happens | Who |
|---|---|---|
| `/start-story` | Read story + requirements, restate, ask questions. No code. | Main session |
| `/plan` | State the level. Planner makes small ordered tasks, names the agent, proposes test seams, flags new decisions. Saved to `logs/plans/`. | `planner`, then main session saves |
| Approval | Hard stop. Nothing is built before it. | **Human** |
| Build | Failing test first, then just enough code, repeat. | The area's builder |
| `/test` | Run the tests (and any type check or linter). Report real results only. | Main session |
| Draft note | Beginner learning note, `Status: Draft`. | Builder |
| `/review` | Read-only check against story, spec and rule IDs. Findings numbered and marked behaviour change or refactor. | `reviewer` |
| `/apply-review` | Fix only the chosen findings. Behaviour change: failing test first. Refactor: tests green before and after, with no test changed. | Builder, with approval |
| Final note | Add "What the review changed", set `Status: Final`. | Main session |
| `/checkpoint` | Save `git diff` patches locally (no git writes). | Main session |
| `/review whole` | Check whole feature folders for drift (layer breaks, wrong placement, repetition, missing tests). | `reviewer` |

**Never skipped at any level:** human approval, a test first, `/test`, a learning note (short at Level 1), `/review`, every guardrail.

## 6. The agents (roles to recreate)
| Role | Job | Tools | Key limits |
|---|---|---|---|
| `planner` | Turn a story into small ordered tasks and name the builder | Read-only | Never writes. Lists a question instead of guessing. |
| `reviewer` | Check changes against story, spec and rule IDs. Has a whole-repo mode. | Read, search, read-only git | Never edits. Quotes rule IDs. |
| One builder per area | Implement one approved task. An "area" is a repo, service, module, package or layer: whatever you can fence in. | Read, search, write, bash | "Work ONLY in this area". Lists what is fixed (spec, shipped code, docs). Knows the pattern to copy. Follows the flow level in its brief. |
| `test-writer` | Tests only | Read, write, bash | No production code unless asked |
| `designer` (optional) | Presentation layer only | Read, write, bash | Hands anything else to the builder |

**Agent file shape:** front matter (`name`, `description`, `tools`), then "what this area is", "fixed (do not change)", "how to build X" (start with the first failing test, then a checklist of what a finished piece contains), "flow level", "learning note".

**One person, one repo?** Use one builder per layer instead (for example `api-dev`, `ui-dev`, `data-dev`). If the project is tiny, one builder plus planner and reviewer is enough.

## 7. Hooks and permissions (the locks)
- **Block git writes** (`commit`, `push`, `add`, `reset`, `checkout`, `rebase`, `merge`, `pull`) in both `permissions.deny` and a hook. Block write tools of remote services too.
- **Block edits outside the workspace** and inside read-only folders.
- **Protect secrets:** deny reading real `.env` files.
- **Track and remind:** note code edits and test runs. On stop, remind the human if code changed since the last test run.
- **Allow list** for safe read-only commands (`git status/diff/log/show`, the test command, the type check).

`settings.json` shape (fill in your commands):
```json
{
  "permissions": {
    "allow": ["Read", "Glob", "Grep", "Bash(git status:*)", "Bash(git diff:*)",
              "Bash(git log:*)", "Bash(git show:*)", "Bash(<test command>:*)"],
    "deny":  ["Bash(git commit:*)", "Bash(git push:*)", "Bash(git add:*)",
              "Bash(git reset:*)", "Bash(git checkout:*)", "Read(**/.env)"]
  },
  "hooks": {
    "PreToolUse":  [{ "matcher": "Bash",                "hooks": [{ "type": "command", "command": "node .claude/hooks/guard-bash.js" }] },
                    { "matcher": "Write|Edit",           "hooks": [{ "type": "command", "command": "node .claude/hooks/guard-paths.js" }] }],
    "PostToolUse": [{ "matcher": "Write|Edit|Bash",      "hooks": [{ "type": "command", "command": "node .claude/hooks/track.js" }] }],
    "Stop":        [{ "hooks": [{ "type": "command", "command": "node .claude/hooks/remind-tests.js" }] }]
  }
}
```
Easiest way to get the hook scripts: copy `.claude/hooks/` from the retail-bank workspace and adjust the path and command lists.

## 8. Learning notes (why they exist)
The human's job is to learn the product, not only ship it. One note per task, in two stages (Draft after tests pass, Final after review). Sections: what was built, why this way, key terms, follow the flow through the files, what the tests prove, what the review changed, 3 likely questions. Every term is defined in plain words with an everyday example. Short at Level 1.

## 9. Starting a new project: step by step
1. **Write the sources of truth first:** requirements, the spec (interfaces, data shapes, names), coding standards with rule IDs (numbered like `ST-01`, so reviews can point at them). On a brand-new project nobody has done this for you, so spend time here or add a `/design` step that produces the spec and first ADRs before any story starts.
2. **Create `CLAUDE.md`:** where the AI may write, no git writes, the human approves, an area map with the test command per area, the flow, the flow levels.
3. **Copy the generic rules** (git, comments, testing, learning) and write one rule for your domain's risks (see section 10).
4. **Write one builder per area,** then the planner, reviewer and test-writer. Give each narrow limits and a "pattern to copy".
5. **Copy the commands.** They are generic: change only the area names, paths and test commands.
6. **Add hooks and permissions before any agent writes code.**
7. **Run one small real task** at Level 1, then one at the full flow. Write down every step that felt pointless or broke, and trim.

## 10. Adapting to your kind of project
Only three things change: the **areas**, the **safety rule** and the **test command**.

| Project type | Areas (one builder each) | Domain-safety rule (examples) | Test command (examples) |
|---|---|---|---|
| Web app (front + back) | frontend, backend, database | Never log personal data. Validate all input. Escape output. | `npm test`, `pytest`, `./mvnw test` |
| Mobile app | app, backend | No secrets in the app bundle. Handle offline and permission states. | `npm test`, `xcodebuild test` |
| Data pipeline | ingest, transform, load | Pipelines are re-runnable (idempotent). Never overwrite raw data. Record row counts. | `pytest`, `dbt test` |
| Library / SDK | core, docs, examples | Public API changes are breaking: need an ADR. Keep backward compatibility. | `pytest`, `cargo test`, `go test ./...` |
| CLI tool | commands, core | Destructive actions need a confirmation flag. Never print secrets. | `pytest`, `go test ./...` |
| Healthcare / legal / finance | per system | Treat personal and regulated data as Level 3. Audit trail for changes. | per stack |

**Writing your safety rule:** answer three questions. (1) What is the worst thing a mistake could do here (lose data, leak data, charge money, hurt someone)? (2) What must always hold (always validate, always repeatable, never log X)? (3) Which changes are hard to undo? The answers become the "ANY true" triggers for Level 3 and the lines of `<domain>-safety.md`.

**Other things to change:** the glossary words (your product's terms), the "shipped code, do not touch" list, any design system or tooling, and the language standards file (replace Java or TypeScript with yours).

## 11. Fill-in skeletons
### `CLAUDE.md`
```markdown
# <project>

## Working agreement (read first)
- Work ONLY inside this workspace. Never write outside it.
- Never run git write commands. The human decides when to commit.
- Requirements come from `<docs folder>`. Read them before coding.
- The human is <experience level>: explain plans in plain language and get approval before writing code.
- Explain everything as if to a beginner (define terms, everyday example, why before how, a short summary at the end).
- After each task passes its tests, write a learning note (see `.claude/rules/learning.md`).

## Area map
| Area | Stack | Test command |
|---|---|---|
| <area> | <stack> | `<command>` |

## Agents
`planner` (read-only), builders: <names>, helpers: `test-writer`, `reviewer` (read-only).

## Fixed (do not change)
<spec files, shipped code, read-only folders, glossary words>

## Flow
<the loop from section 5> + <the three levels table>

## Standards
<where the numbered rules live; the originals win over the summaries>
```

### A builder agent
```markdown
---
name: <area>-dev
description: Implements one approved task in <area> (<stack>). Use for <what>.
tools: Read, Glob, Grep, Write, Edit, Bash
---
You work ONLY in `<area folder>`, one approved task at a time.

## What this area is
<2-3 sentences>

## Fixed (do not change)
- <spec / shipped code / read-only folder>

## How to build <a unit>
Start with ONE failing test (<where the pattern lives>). Watch it fail, write only the code that test needs, repeat one test at a time. Run `<test command>` at the end.
A finished <unit> has: <checklist>.

## Flow level
If your brief names a flow level (see "Choosing the flow" in `CLAUDE.md`), follow it. Level 1: keep the change tiny and write a short learning note. Level 3: confirm the test seams with the user in writing before any test, and name idempotency and rollback in your report.

## Learning note (required)
When the task's tests pass, write the draft learning note as described in `.claude/rules/learning.md` (`Status: Draft`). Mention the file in your report.
```

### `.claude/rules/<domain>-safety.md`
```markdown
# <Domain> safety
- <the worst-case mistake, stated as a rule: "Never ...">
- <what must always hold: "Always validate ...", "Operations must be repeatable ...">
- Never hardcode secrets. Use environment variables; never read real `.env` files.
- When requirements are unclear or conflict, stop and ask instead of guessing.
```

### `/plan` command (core idea)
```markdown
---
description: Pick a flow level, then produce a small plan and wait for approval
---
First pick the flow level using "Choosing the flow" in CLAUDE.md. Say "Flow: <level>, because <reasons>" and list the triggers you checked, including the ones that did not apply.
- Level 1: no plan file. Say in 2-3 lines what changes, in which file, and which test comes first. Stop and wait for approval.
- Level 2: use the planner agent, save the plan to `.claude/logs/plans/`, stop and wait for approval.
- Level 3: as Level 2, plus seams confirmed in writing, idempotency and rollback named, a whole-repo review at the end, an ADR draft if a decision is new.
If unsure between two levels, take the higher one. Do not write code until approved.
```

## 12. Known gaps (honest list)
- **Architecture rules are checked only by the AI reading them.** Add automatic checks (a dependency-boundary tool for your language: ArchUnit, dependency-cruiser, import-linter) so a broken rule fails the build. If you don't own the repo, agree this with the owner first.
- **No CI** (a server that runs tests on every push), so "tests pass" means "passed locally".
- **End-to-end checks may not be automated.** If "done" is defined by an API collection or UI test script, run it with a command-line runner so "done" is a real result.
- **Rules repeat in many places.** Keep each rule in one file, and have agents point at it instead of copying it.
- **One approver.** A junior approver plus an AI reviewer can agree on something wrong. Make sure an experienced person reviews early.
- **Untested.** The Level 1 / 2 / 3 limits are a first guess. Adjust after real use.
- **Not covered:** a docs reviewer (the cheap version is one line in `/start-story`: "flag where the story, requirements and spec disagree"), and a design step for brand-new projects with no spec.

## 13. Example: how retail-bank maps onto this template
| Template | retail-bank |
|---|---|
| Areas | 4 Spring Boot repos (our-bank, txn-service, other-bank, clearing-house) + 1 Expo app |
| Spec | `retail-bank-docs/architecture/` (API contract, data model, events, flows) |
| Standards | LS, TS, RN, TR rules in `retail-bank-docs/coding-standards/` |
| Safety rule | `banking-safety.md` (money is `BigDecimal`, no PII in logs, idempotent money moves) |
| "Shipped, do not touch" | The Login module and each repo's `docs/` folder |
| Extras | Approved UI design ("Ube & Banig"), Impeccable design skill, `ui-designer-fe` |
