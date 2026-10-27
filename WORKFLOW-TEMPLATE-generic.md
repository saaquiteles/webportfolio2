# Agentic development workflow: a generic, reusable template

Works for any software project (web app, mobile app, API, data pipeline, library, CLI). Fill in the `<placeholders>`.

Origin: designed on a retail-bank project (2026-10-23), then simplified on 2026-10-26 after running on a portfolio-site scaffold, using ideas from Matt Pocock's agent-skills course (mattpocock/skills). Status: the first version ran a whole story; **this simpler version has not been piloted yet**. Treat the numbers (such as "30 lines") as first guesses.

## 1. The idea
Don't ask the AI to "build the app". Write down what you want in words you both share, make it plan, approve the plan, then let one builder do **one small, test-first step at a time** while a reviewer checks each step. Locks (hooks) stop dangerous actions. The human approves the key decisions and is the only one who pushes.

## 2. Words used here
- **Agent**: a specialised AI helper with its own instructions and tools (a file in `.claude/agents/`).
- **Command**: a saved prompt you run as `/name` (a file in `.claude/commands/`).
- **Rule**: a short instruction file in `.claude/rules/` that every session reads.
- **Hook**: a small script that runs before or after an action and can block it. A lock, not a request.
- **Spec**: the written agreement of what the project must do and how its parts talk. The AI never invents or renames what the spec fixes.
- **Glossary**: the project's words, each with the words to avoid. One word per idea.
- **Contract**: the agreed place a test touches the code, such as a rendered screen or a function. Tests check behaviour there, not internals.
- **Vertical slice**: a task that works end to end when it is finished, like one finished slice of cake instead of a whole layer of sponge.
- **TDD**: write a failing test first, then just enough code to pass it.
- **ADR**: a short note "we chose X because Y", with a status (Proposed until the human accepts it).

## 3. The layers
| Layer | What it is | Where it lives |
|---|---|---|
| 1. Sources of truth | Requirements, spec, numbered standards (each tagged *tool* or *review*), glossary, ADRs | `docs/` |
| 2. Rules | `CLAUDE.md` plus a few short rule files | `CLAUDE.md`, `.claude/rules/` |
| 3. Agents | planner, builder, reviewer | `.claude/agents/` |
| 4. Commands | `/start-story`, `/plan`, `/test`, `/review`, `/retro`, `/explain` | `.claude/commands/` |
| 5. Hooks + permissions | Automatic locks and allow/deny lists | `.claude/settings.json`, `.claude/hooks/` |

**Golden rule:** anything that must never happen belongs in layer 5, not layer 2. A rule can be forgotten. A hook cannot. State each rule **once**, and point at it from everywhere else.

```
CLAUDE.md
docs/      requirements, spec, standards, glossary, adr/
.claude/   settings.json, agents/, commands/, rules/, hooks/, logs/{plans,learning}/
```

## 4. The flow
**Step 0, choose the level** with one question: *can this be undone with `git revert`, and how much breaks if it is wrong?* Say "Flow: <level>, because <one line>" and wait for approval. If unsure, take the full flow.

| Level | Use it when | Flow |
|---|---|---|
| **Short path** | Easy to undo AND small: one area, one or two files, about 30 lines, no visible behaviour change | One-line approval, a test first, change, the check, a short learning note, a quick checklist review in the main session |
| **Full flow** | Anything else, and always for: hard to undo or high impact (money, health, user data, deletion), security, a schema or public-interface change, more than one area, a new dependency or pattern, personal data | The full loop, plus contracts confirmed in writing, a rollback named in the plan, a whole-area review at the end, an ADR for each new decision, and a stop to ask when unclear |

```
/start-story -> /plan -> (human approves)
-> per task: build test-first -> /test -> /review (Spec, then Standards) -> apply the recommended fixes
   -> learning note -> /clear -> next task
End of each story: /review whole <area>, then /retro
```
| Step | What happens |
|---|---|
| `/start-story` | An interview, not a form: numbered questions in rounds, each with a recommended answer ("yes" accepts it). The agent looks up facts itself and asks only decisions. It proposes glossary words and flags where the story, requirements and spec disagree. It also reads the follow-ups list (`docs/follow-ups.md`, tracked, parked items each with when to do it) and says which items the story would finish or touch. No code. |
| `/plan` | State the level. Small ordered tasks, each a **vertical slice** that works end to end: task, first failing test, acceptance criteria, blocked by. Optional sections only when needed: contracts, ADRs, out of scope, rollback. Hard stop for approval. |
| Build | One task at a time. Failing test first, then just enough code, one test at a time. |
| `/test` | One command that runs everything (typecheck, lint, tests, build). Report real results only. |
| `/review` | Two passes by a fresh, read-only reviewer. **Spec:** is anything missing, added without being asked, or done wrong while looking done? **Standards:** the numbered rules. Findings are numbered and marked behaviour change or refactor. The recommended fixes are applied; ask first about behaviour changes and anything outside the task. |
| Note | One learning note, written after the review. |
| `/retro` | Looks back at what happened and suggests changes to the *setup*, not the code. Sorts each problem: **mechanical** (a tool can check it, so add a hook, lint rule or test) or **judgement** (a reader must check it, so add it to the standards). Also flags a bloated `CLAUDE.md` and instructions that change nothing. It only suggests; the human decides. |
| `/explain` | Explains a file, feature or term as if to a beginner. Changes nothing. |

**Never skipped:** human approval, a test first, the full check, a learning note, a review, every guardrail.

## 5. The agents
| Role | Job | Tools | Key limits |
|---|---|---|---|
| `planner` | Turn a story into small ordered tasks | Read-only | Lists a question instead of guessing |
| `builder` | Implement one approved task, test first. One section per area (frontend, backend, ...) | Read, search, write, bash | Works only in the area; lists what is fixed (spec, shipped code, docs) |
| `reviewer` | Check changes against the story, spec and rule IDs; has a whole-area mode | Read, search, read-only git | Never edits; quotes rule IDs |

Put the standing instructions (report format, must-fix vs nice-to-have, "real results only") **in the agent file**, so each brief shrinks to one paragraph. A very large project can split the builder per area. A designer agent is optional.

## 6. Hooks and permissions (the locks)
- **Block git pushes** in `permissions.deny`, and **force-push, `reset --hard` and `clean -f`** in a hook. Allow commits only when the human asks.
- **Block edits outside the workspace** and in the lock files themselves (`settings.json`, `hooks/`). The human edits those.
- **Protect secrets:** deny `Read(**/.env)` in `permissions.deny`, and block shell reads such as `cat .env` in a hook. A hook on the shell does not stop the file-reading tool, so the deny rule is the one that matters.
- **Allow-list** the read-only git commands and your one check command, or every run prompts.

Lessons that cost time on the first project:
- **A hook that crashes fails open.** Only exit code 2 blocks; any other failure lets the action through. After every hook edit, run it by hand with allowed and blocked inputs, and keep that self-test.
- **A deny rule matches by prefix, and a compound command is refused if any part matches.** `git push --dry-run` is blocked too, and so was a long command that merely contained it.
- **An editor buffer is not the file.** If a change to a locked file "didn't work", re-read it from disk first. It is often unsaved.
- **An automatic permission check may refuse an action.** Don't route around it; the human can say "retry".
- **The shell's folder can persist** between commands (the session reported its working folder changing more than once). Start each command from the project root, or use absolute paths, or it can end up inside a nested repo.

## 7. Learning notes
The human's job is to learn the product, not only ship it. One note per task, written **once, after the review**, about 40 lines: who did what, what was built, why this way, key terms (each in plain words with an everyday example), follow the flow through the files, what the tests prove (the red result, the green result, and what is **not** proven), what the review changed, 3 likely questions, a two-line summary. Short on the short path.

## 8. Starting a new project
1. **Sources of truth first:** requirements, spec, standards with rule IDs (`ST-01`) each tagged tool or review, the glossary, and an empty `docs/follow-ups.md` for anything parked on purpose (tracked, because learning notes are usually git-ignored). On a brand-new project, add a design step that produces the spec and first ADRs.
2. **`CLAUDE.md`:** where the AI may write, no unprompted git writes, the human approves, an area map, the one check command, the flow, the levels.
3. **Rules:** git, comments, testing, learning, and one safety rule for your domain (section 9).
4. **Agents:** planner, builder, reviewer, each with narrow limits and a pattern to copy.
5. **Commands:** change only the area names and the check command.
6. **Hooks and permissions before any agent writes code.** Test the hooks.
7. **Run one small real task** on the short path, then one on the full flow. Write down every step that felt pointless, trim, and run `/retro`.

## 9. Adapting to your kind of project
Only three things change: the **areas**, the **safety rule** and the **check command**.

| Project type | Areas | Safety rule (examples) | Check command |
|---|---|---|---|
| Web app | frontend, backend, database | Never log personal data. Validate all input. Escape output. | `npm run check` |
| Mobile app | app, backend | No secrets in the bundle. Handle offline and permission states. | `npm test` |
| Data pipeline | ingest, transform, load | Re-runnable. Never overwrite raw data. Record row counts. | `pytest`, `dbt test` |
| Library / CLI | core, docs, examples | Public API changes are breaking and need an ADR. Destructive actions need a flag. | `cargo test`, `go test ./...` |

**Writing your safety rule:** answer three questions. (1) What is the worst thing a mistake could do (lose data, leak data, charge money)? (2) What must always hold? (3) Which changes are hard to undo? The answers become the full-flow triggers and the lines of the safety rule.

## 10. Lessons from the first real project
- **Check, don't assume.** Newest versions often do not work together (a linter that did not support the newest TypeScript). Look up which versions each tool says it works with before pinning.
- **State a standard once and tag it.** *Tool* means a command fails; *review* means only a reader catches it. When a reader catches the same mistake twice, make it a tool check.
- **Re-check agent reports yourself.** They are usually right, and sometimes wrong in small ways (a miscount, an unverified claim). Run the key check again.
- **Run the same check locally and in CI.** The first push is the first real test on another operating system.
- **Agent-file edits take effect on the next turn.** After changing an agent's model or tools, test it in a new turn. Edited and tested in the same turn, a planner still ran as the old model; the identical check one turn later ran as the new one.
- **Use a light review for tiny changes.** A full review agent on a one-line change is wasted effort.
- **Never commit a repo inside a repo.** Ignore it or move it.

## 11. Known gaps
- **Untested:** this simpler version has not run on a real story yet. Pilot it, then adjust.
- **Architecture rules are checked only by reading**, unless you add a dependency-boundary tool for your language.
- **One approver:** a junior approver and an AI reviewer can agree on something wrong. Get an experienced person to review early.

## Appendix: fill-in skeletons
### `CLAUDE.md`
```markdown
# <project>
## Working agreement (read first)
- Work ONLY inside this workspace. No git writes unless the human asks; never push.
- Use the words in `docs/glossary.md`; propose new words, add them only after the human's yes.
- The human is <experience level>: explain in plain words (define terms, an everyday example, why before how, a short summary) and get approval before code.
- After each task passes its checks and review, write a learning note.
## Area map
| Area | Stack | Folder |
Full check: `<one command>`
## Fixed (do not change)
<spec files, standards, glossary, shipped code, the locks>
## Flow
<the level question, the two-level table, the loop from section 4>
```
### `.claude/settings.json` (the locks)
```json
{
  "permissions": {
    "allow": ["Read", "Glob", "Grep", "Bash(git status:*)", "Bash(git diff:*)", "Bash(git log:*)", "Bash(<check command>:*)"],
    "deny": ["Bash(git push:*)", "Read(**/.env)"]
  },
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [{ "type": "command", "command": "node .claude/hooks/guard-bash.js" }] },
      { "matcher": "Write|Edit", "hooks": [{ "type": "command", "command": "node .claude/hooks/guard-paths.js" }] }
    ]
  }
}
```
Writing a hook script: it reads a JSON description of the action from stdin (`tool_input.command` for the shell, `tool_input.file_path` for edits), checks it, and calls `exit(2)` with the reason on stderr to block. Any other exit lets the action through, so test it by hand with allowed and blocked inputs. Copy the guards from a project that already has them.

### `/plan` command
```markdown
---
description: Pick a level, then produce a small plan and wait for approval
---
Ask the level question (can this be undone with `git revert`, and how much breaks if it is wrong?). Say "Flow: <level>, because <one line>" and name any full-flow trigger that applied.
- Short path: no plan file. Say in 2-3 lines what changes, in which file, and which test comes first. Wait for approval.
- Full flow: use the planner agent, save the plan from `plans/TEMPLATE.md`, add contracts and a rollback, and wait for approval.
If unsure, take the full flow. Write no code until approved.
```

### The builder agent
```markdown
---
name: builder
description: Implements one approved task, test first. Use for <what>.
tools: Read, Glob, Grep, Write, Edit, Bash
---
Work ONLY in the area named in the brief, one approved task at a time.
## Areas
<area>: <what it is>, <what is fixed (do not change)>, <the pattern to copy>
## How to build a unit
Start with ONE failing test at the agreed contract. Watch it fail, write only the code it needs, repeat. Run `<check command>` at the end.
A finished unit has: <checklist>.
```
### `<domain>-safety.md`
```markdown
# <Domain> safety
- <the worst-case mistake, as a rule: "Never ...">
- <what must always hold: "Always validate ...">
- Never hardcode secrets; never read real `.env` files.
- When requirements are unclear or conflict, stop and ask instead of guessing.
```
