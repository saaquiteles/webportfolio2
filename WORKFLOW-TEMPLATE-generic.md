# Agentic development workflow: a generic, reusable template

Works for any software project and any tech stack (web app, mobile app, backend service, data pipeline, library, CLI, infrastructure code). Nothing here depends on a language, framework or hosting choice; where a tool or language is named, it is only an example. Fill in the `<placeholders>`.

**Prerequisites:** Claude Code (the files live in `.claude/`; another AI tool needs its own equivalents of agents, commands, skills, hooks and permission rules), git, and one scripting runtime for the hooks (any that your machine has; the examples use `node`).

Origin: designed on a retail-bank project (2026-10-23), simplified on 2026-10-26 after running on a portfolio-site scaffold, using ideas from Matt Pocock's agent-skills course (mattpocock/skills), then revised on 2026-10-27 after an outside review (requirement IDs, verification wording and context use), and again on 2026-10-28 after a second one (a spike level, module-level commits and packaging the locks), then a pass to make it stack-agnostic, and finally a pass on 2026-10-30 after the first pilot (a mobile-app frontend story with six tasks, followed by a retro). Status: piloted once; the pilot's lessons are folded in below (module workflow, status block, retro folder, hook config and Windows notes). Treat the numbers (such as "30 lines") as first guesses.

## 1. The idea

Start with a draft of the plan the human and AI have already discussed. The organizer turns that draft into a clear, ordered, functionality-based build plan and gives only concise feedback about gaps, risks and useful improvements. The human approves the organized plan before code changes begin.

Build **one functionality module at a time**. Each module is a small, coherent behaviour that can be verified end to end. In personal mode, define its **happy path** (the expected successful journey) and its **sad paths** (validation failures, errors, empty states, denied access, boundary cases and other relevant failure behaviour) before implementation. Build test-first where practical, review the completed module, and commit only when the module is complete and verified.

**Two modes.** `Mode: personal` (the default, for a solo project) is the flow described in this document: each module covers its happy path and its relevant sad paths. `Mode: team` adds a four-phase plan and a staging gate, so testers can try a working happy path while developers keep building (section 4, "Team mode"). The mode is a line in `CLAUDE.md`, and the organizer asks if it is not stated.

Learning is available without becoming a development gate. When the human runs `/teach` (a skill), it creates an interactive HTML learning file in the learning folder. It explains the actual implementation in beginner-friendly language, shows code snippets and identifies the files touched. It does not pause or add mandatory steps to the build loop.

Locks (hooks) stop dangerous actions. The human approves key decisions and is the only one who pushes. Process follows risk, and every step has to earn its keep (see "Keeping it lean" in section 4).

## 2. Words used here

- **Agent**: a specialised AI helper with its own instructions and tools (a file in `.claude/agents/`).
- **Command**: a saved prompt you run as `/name` (a file in `.claude/commands/`).
- **Skill**: reusable instructions and supporting resources loaded when a capability is invoked (a folder in `.claude/skills/`).
- **Rule**: a short instruction file in `.claude/rules/`. Without a `paths:` line it loads in every session; with one, only when matching files are touched.
- **Hook**: a small script that runs before or after an action and can block it. A lock, not a request.
- **Spec**: the written agreement of what the project must do and how its parts talk. The AI never invents or renames what the spec fixes.
- **Requirement ID**: a number on each requirement (`REQ-03`), so every module, test and learning file can point back to why it exists.
- **Glossary**: the project's words, each with the words to avoid. One word per idea.
- **Contract**: the agreed place a test touches the code, such as a rendered screen or a function. Tests check behaviour there, not internals.
- **Functionality module**: a cohesive piece of user-visible or system behaviour, built and verified as one unit. A module includes its happy path and relevant sad paths.
- **Happy path**: the expected successful journey through a functionality.
- **Mode**: `personal` or `team`, set in `CLAUDE.md`. Team mode adds four phases and a staging gate.
- **Staging gate** (team mode): the checklist that makes the finished happy path ready to hand to testers, with no downtime for testers or developers.
- **Release candidate** (team mode): a tagged commit where the full check passes, built reproducibly for testers.
- **Vertical slice** (team mode): a thin working path through all the layers, built first for the happy path only.
- **Hardening** (team mode): the phase that adds validation, error handling, edge cases and empty states to a working happy path.
- **Sad path**: an expected failure, invalid input, boundary condition, denial, empty state or recovery behaviour.
- **Mutation check**: break the exact line a test protects, watch the test fail, then restore the line. It proves a test that was green on its first run can fail.
- **Fast check / full check**: a targeted test run used while building, and the one command that runs everything (typecheck, lint, all tests, build) before review.
- **Level**: how much process a change gets: spike, short path or full flow. It follows risk, not size (section 4).
- **Status block**: about ten lines at the top of the organized plan (current module, approvals, last check, next action) that carry work across a `/clear` or `/compact`; dated history goes in a Log section at the end of the plan.
- **Interactive learning file**: an HTML file generated by `/teach` on demand. It explains a completed or existing implementation using actual files, snippets and beginner-friendly explanations, and ends with an interactive multiple-choice quiz.
- **Spike**: a throwaway experiment to answer one question. Nothing from it ships as it is.
- **Module commit**: a commit made after a complete functionality module has passed its checks and review. It may contain multiple related implementation and test changes that together complete that module.
- **ADR**: a short note "we chose X because Y", with a status (Proposed until the human accepts it). Write it formally but simply: keep the fixed sections (Status, Gap, Proposal, Why, Consequences, rollback), but use plain words and short sentences, define a term the first time it appears, and state the decision in one sentence near the top. Anyone new to the project should be able to follow it.

## 3. The layers

| Layer | What it is | Where it lives |
|---|---|---|
| 1. Sources of truth | Requirements with IDs, spec, numbered standards (each tagged *tool* or *review*), glossary, ADRs, follow-ups | `docs/` |
| 2. Rules | `CLAUDE.md` plus a few short rule files, scoped by path where possible | `CLAUDE.md`, `.claude/rules/` |
| 3. Agents | organizer, builder, reviewer | `.claude/agents/` |
| 4. Commands and skills | `/start-story`, `/organize`, `/review`, `/retro`, and the `/teach` skill | `.claude/commands/`, `.claude/skills/` |
| 5. Hooks + permissions | Automatic locks and allow/deny lists | `.claude/settings.json`, `.claude/hooks/` |

**Golden rule:** anything that must never happen belongs in layer 5, not layer 2. A rule can be forgotten. A hook cannot. State each rule **once**, and point at it from everywhere else.

**Context rule:** whatever loads every session costs on every turn. Keep it short and load the rest only when it is needed (section 7).

```
CLAUDE.md
docs/      requirements, spec, standards, glossary, follow-ups.md, adr/
.claude/   settings.json, agents/, commands/, skills/, rules/, hooks/, logs/{plans,learning,retro}/
```

## 4. The flow

**Step 0, choose the level** with one question: *can this be undone with `git revert`, and how much breaks if it is wrong?* Say "Flow: `<level>`, because `<one line>`" and wait for approval.

| Level | Use it when | Flow |
|---|---|---|
| **Spike** | A throwaway experiment to learn how something works or whether an idea is feasible. Nothing from it ships as it is | Say "Flow: spike", the question it answers and a cap (at most `<N>` files touched or `<N>` steps, then stop and report the dead end so the human can pivot to a simpler approach; an agent has no clock, so do not use a time box), and wait for approval. No organized plan file and no module commit. Work only in a git-ignored scratch folder inside the workspace (for example `scratch/`) that the full check and the hooks do not pick up; create no branch unless the human asks. No test first, because nothing ships; every other guardrail still applies. Make no change to the real dependency manifest or lockfile; install only inside the scratch folder, or ask. A spike ends with a written answer shown to the human (a few lines in an ADR or `docs/follow-ups.md`), or it was not a spike. The human decides when it ends and approves deleting the code. To use the idea, rebuild it test first at the right level. |
| **Short path** | Easy to undo AND low impact: one area, no visible behaviour change, no full-flow trigger. Rule of thumb: one or two files, about 30 lines of code (docs-only changes can be bigger) | One-line approval, a test first where practical, change, the full check, a quick checklist review in the main session. |
| **Full flow** | Anything else, and always for: hard to undo or high impact (money, health, user data, deletion), security or auth, a schema or public-interface change, more than one area, a new dependency or pattern, personal data | Organize the discussed draft into functionality modules; confirm each module's happy and sad paths, contracts and acceptance criteria; human approves the organized plan. Build one module at a time, test-first, run the full check, review the completed module, then commit that module if the human has authorized committing. Include a rollback and ADRs for hard-to-reverse decisions. Stop and ask when unclear. |

The level follows risk, not size: a one-line change to auth is full flow; a long docs-only rewrite can be the short path. Work on security, auth, migrations or money logic also goes on `docs/follow-ups.md` as **needs experienced review**.

A spike is never a way around the flow. If it touches real data, auth, money or personal data, it is not a spike. If its code is kept, rebuild it test-first at the right level. Exploration is only worth doing when it ends in a written answer.

**Keeping it lean.** Rigor follows risk, not habit.

- **Use the lighter level without guilt.** A copy fix, a style tweak or a trivial refactor belongs on the short path. A short path done properly is not cutting corners.
- **Build by functionality, not arbitrary task fragments.** A module should represent one coherent behaviour and include its successful path plus the relevant failure paths. Split a module only when it is too large to build, test or review safely.
- **Spend understanding where failure is expensive.** Know the contracts (what goes in, what comes out, where it fails) and the risky parts (state, security boundaries, data integrity, money) in depth. Boilerplate, configuration and layout get a concise description.
- **Fail fast.** Run the fast check first. Anything a person has to remember should become a tool check (a test, a linter or a hook).
- **Keep teaching separate from delivery.** `/teach` is on demand and must not block the build, review or commit loop. Do not generate learning files automatically after every module.
- **Prune.** `/retro` records whether each process step caught a real problem or taught something. After about two weeks of use, or about ten modules, a step that did neither is shortened or dropped. The human makes the change; the agent never skips a guardrail on its own. Human approval, tests, the full check, review and hooks are not pruned.

```text
/start-story -> discuss and draft the approach (the draft lives in the conversation, or in a draft file the human names)
-> /organize (organizer structures the draft; concise gap/risk feedback)
-> human approves the organized plan
-> for each functionality module:
     confirm happy path + relevant sad paths + acceptance criteria
     -> builder implements test-first (fast check)
     -> full check
     -> /review (Spec, then Standards)
     -> apply the recommended fixes (ask first about behaviour changes) and re-check
     -> module complete -> human-authorized module commit
-> optional /teach <module-or-topic> -> interactive HTML in learning folder
-> end of story: /review whole <area>, then /retro
```

| Step | What happens |
|---|---|
| `/start-story` | An interview, not a form: numbered questions in rounds, each with a recommended answer ("yes" accepts it). The agent looks up facts itself and asks only decisions. It maps the story to requirement IDs, proposes glossary words and flags where the story, requirements and spec disagree. It also reads the follow-ups list (`docs/follow-ups.md`, tracked, parked items each with when to do it) and says which items the story would finish or touch. No code. It also assigns a short story id (for example `S1`) that is used in plan and learning file names. |
| `/organize` | Send the organizer the draft plan created through discussion. It restructures the draft into ordered, functionality-based modules (in team mode, into four phases with a staging gate between the happy path and hardening). For every module, it identifies the goal, requirement IDs, acceptance criteria, happy path, relevant sad paths, expected files/areas, first tests and dependencies. It gives minimal feedback only: missing paths, unclear criteria, risks, dependencies or a practical recommendation. It must preserve the decisions already agreed, distinguish assumptions from decisions, and ask instead of inventing missing requirements. It saves the organized plan using the plan template and stops for human approval. No code. |
| Build | Work on one approved functionality module at a time. Confirm its happy path and relevant sad paths from the approved plan. Write failing tests first where practical, then implement only what the module needs, using the fast check. Run the full check before review. A test that is green on its first run is shown able to fail with a mutation check where practical (break the exact line it protects, watch it fail, restore the line and show `git diff` is empty). Report real results only. |
| `/review` | Two passes by a fresh, read-only reviewer that reads the diff and the module acceptance criteria itself instead of trusting the builder's report. **Spec:** is anything missing, added without being asked, or done wrong while looking done? **Standards:** the numbered rules. Findings are numbered, marked behaviour change or refactor, and give the file and line and the evidence. The recommended fixes are applied; ask first about behaviour changes and anything outside the module. |
| Module commit | After all the acceptance criteria for the module (in personal mode its happy-path and sad-path criteria; in team mode the paths the plan names), checks and review findings for the module are complete, prepare one commit for the completed module. Do not commit intermediate work, known mistakes, failing states or partially completed modules. The human must explicitly authorize the commit. The commit may include all related files and tests required for that single completed functionality. |
| `/teach` | On demand, after or during development, run the `/teach` skill for a module, feature, file or technical concept. It reads the actual code and creates an interactive HTML learning file in `.claude/logs/learning/`. The file explains concepts ELI5, fundamentals, runtime/code behaviour, real code snippets, files touched, each file's purpose and what changed. It must be self-contained and usable in a browser, with lightweight interactions (for example expandable explanations, tabs or a small knowledge check) where useful. It does not modify application code, add a required step before development continues, or delay the build loop. |
| `/retro` | Looks back at what happened and suggests changes to the *setup*, not the code. Sorts each problem: **mechanical** (a tool can check it, so add a hook, lint rule or test) or **judgement** (a reader must check it, so add it to the standards). Scores the story on six questions: correct (criteria and key failure cases verified?), traceable (requirement to code to evidence?), understood (could I explain the changed files?), debuggable (could I follow a failure?), efficient (mistakes caught early, no dead steps?), safe (did the locks block what they should?). It saves its output in `.claude/logs/retro/<date>-<story-id>-<area>.md`, with a status column per suggestion (todo, done, needs the human, skipped) that is kept up to date as items are done. It only suggests; the human decides. |
| `/explain` | A lightweight conversational explanation of a file, feature or term. For a structured, reusable learning artifact, use `/teach` instead. |

**Never skipped by the agent:** human approval, tests (or an approved alternative check), the full check for the full flow, review, and every guardrail. `/teach` is optional and on demand, not a required delivery checkpoint. A spike skips tests and review only because nothing ships; approval and every guardrail still apply.

**Commits.** Commit only when the human explicitly asks. The unit of commit is a **completed functionality module**, not an individual task or code edit. A module commit is allowed only after its happy path and relevant sad paths are implemented (in team mode, the paths the plan names for it), acceptance criteria are met, checks pass, and review findings are resolved or explicitly accepted by the human. Never commit known mistakes, failing tests, incomplete modules or intermediate work. Use a clear Conventional Commits message (`type(scope): subject`; types `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`, plus `build`, `ci` or `perf` if you use them). The subject is imperative ("add", not "added"), and the body explains why, not how. Mark a breaking change with `!` after the type and a `BREAKING CHANGE:` footer.

- **Before committing, inspect the staged diff and run the module's required checks again.** Confirm the staged changes belong to the completed module and do not contain unrelated work, accidental deletions, secrets, build output, ignored learning files or a nested repo.
- **No automatic commits.** The agent proposes the module commit and message; it runs `git add` and `git commit` only after the human explicitly authorizes it. The human pushes.
- **No AI attribution lines.** Do not add `Co-Authored-By`, "Generated with ..." or similar lines to commit messages or pull request descriptions, unless you want them. If your tool adds one by default, switch that off and put the rule in the project's git rule file, so the human's wish overrides the tool's default.
- **Stage by file path.** `git add -p` is interactive and may not work in an agent shell. When one file holds changes for two commits, build the in-between version of the file, store it with `git hash-object -w <file>`, put it in the index with `git update-index --cacheinfo 100644,<hash>,<path>`, commit, then `git add` the file again for the second commit. Check `git diff --cached` before each commit.
- **A global commit rule can conflict.** If you keep a personal rule such as "every commit is atomic", say in the project's git rule file which one wins here, and whether a commit-splitting skill may be used (for example only to word the message).
- **No commit-splitting skill.** This workflow does not create commits per small edit or per task. It commits once per completed, verified module.

### Team mode: four phases and a staging gate

Use this only when several people work on the project and testers try builds. For a solo project it adds work and no benefit, so stay in personal mode.

The organizer structures the human's discussion into four phases, concise, in bullets and checklists ("not applicable" where a line does not fit, for example an API endpoint on a static site):
- **Phase 1, bare minimum happy path:** the shortest path from the user's action to success, with only the essential UI element, API endpoint and data action. No validation, error handling, edge cases or non-essential styling.
- **Phase 2, vertical slice modules:** a vertical slice is a thin working path through all the layers (frontend, backend, data). Build the happy path only, as ordered, atomic modules, each with its own acceptance criteria and first failing test. A module lists the sad paths it leaves out as "deferred to" a named hardening module.
- **Staging gate** (between phase 2 and phase 3; it is not a phase, see below).
- **Phase 3, hardening:** critical validation rules, specific error scenarios, edge cases and empty states, as modules. Include what the testers found.
- **Phase 4, refinement and polish:** UI and UX enhancements (loading states, feedback banners, animations), the unit and integration tests still required, performance considerations and refactoring.

**Staging gate, so there is no downtime for testers or developers:**
- A **release candidate**: one commit where the full check passes, tagged, and built reproducibly from that tag (by CI or a documented command), never from a developer's working copy.
- A **staging environment** (config, backend, data) separate from development and production, with test data only and secrets from the environment.
- A **tester channel** and the install steps.
- **No downtime for testers:** the previous staged build stays installable until the new one passes its smoke test; a new build goes up beside the old one; backend and data changes stay compatible with the staged build (add first, remove later), or the interface is versioned.
- **No downtime for developers:** development continues on the main line; unfinished work stays off the tagged commit or behind a switch; testers use the tag, not the head of the main line; tester findings enter the plan as hardening modules or bugs, not as interruptions.
- A **tester script** (the happy-path steps), a **known-gaps list** (what hardening has not done yet) and where to report.
- A **rollback** (re-offer the previous staged build) and a **smoke test** the human runs before announcing the build.
- Creating and pushing the tag, running the smoke test, publishing, distributing and deploying are the human's actions (the locks block the agent), and a CI workflow that builds tags is a deploy-workflow change (full flow, with a named rollback). For a project with no testers or staging, write "not applicable" and name the preview check instead.

**Rules in team mode.** A module is complete when the acceptance criteria the plan names for it are met, and the plan says which paths each module covers (a phase 2 module may be happy-path only). The story closes only when hardening has covered the relevant sad paths, or the plan says why one does not apply; every deferred sad path has an owning hardening module, and the whole-area review at the end of the story lists each one with its owner and flags any without an owner or not done; the module reviewer does not flag a sad path the plan gives to a named later module. On a live product, hardening finishes before a release; the main line holds happy-path-only work for a while.

**The levels still apply in team mode.** Step 0 (spike, short path, full flow) measures the size and risk of one change, so it stays. A story uses the four phases only at full flow. A change found by testers goes through the short path unless it meets a full-flow trigger. A spike is still the way to answer a feasibility question before planning, for example whether a reproducible build and a tester channel can work at all. Untested: in a team, the full-flow triggers (a public interface, a data schema, security, the deploy workflow) probably need another person's review, and a fix may have to land on both the tag and the main line.

## 5. The agents

| Role | Job | Tools | Key limits | Model / effort |
|---|---|---|---|---|
| `organizer` | Turn a human-discussed draft into an ordered functionality-based plan (in team mode, four phases and a staging gate) | Read, search, write plan file | Writes only the organized plan file; structures and critiques the draft lightly; does not invent requirements, make decisions or write application code | Use the configured default unless the project explicitly sets one |
| `builder` | Implement one approved functionality module, test first | Read, search, write, bash | Works only in the approved area/module; follows the happy path and sad paths; does not commit | `sonnet-5.5`, medium |
| `reviewer` | Check a completed module against the story, spec and rule IDs; has a whole-area mode | Read, search, read-only git | Never edits or commits; quotes rule IDs; checks the diff itself | `sonnet-5.5`, medium |

Put the standing instructions (report format, must-fix vs nice-to-have, "real results only") **in the agent file**, so each brief shrinks to a few lines of pointers. Standing tooling notes belong there too (for example a workaround for a command that is broken on one operating system): write them once in the agent file, not in every brief. The reviewer is read-only and does not run the checks: the main session runs the typecheck, lint and tests first and puts the results in the brief, and a reviewer's "I did not run it" is not a finding.

| Agent | Report |
|---|---|
| `organizer` | Ordered modules (in team mode, the four phases and the staging gate); requirement IDs; goal and acceptance criteria; happy path; sad paths; expected files/areas; tests and dependencies; concise gaps, risks and recommendations; open questions |
| `builder` | What changed in the module; files changed; happy/sad paths covered; each check with its status; anything unverified; deviations from the approved plan |
| `reviewer` | Numbered findings, each: must-fix or nice-to-have, behaviour change or refactor, file and line, evidence, the fix; then anything left unresolved |

**Status words** (the only ones the builder and reviewer use for checks): **passed**, **failed**, **not run** (and why), **not provable by a test** (and how else it was checked). Anything not covered is **unverified** and is listed in the report. A green build does not prove the feature is right.

Use subagents where a fresh, separate context pays off (the full-flow builder and reviewer); on the short path, stay in the main session. A very large project can split the builder per area. A designer agent is optional.

## 6. Hooks and permissions (the locks)

- **Block git pushes, `reset --hard` and `clean`** in `permissions.deny`, and also block **force-push, `reset --hard` and `clean -f`** in a hook as a second lock.
- **Make commits ask every time:** put `git add` and `git commit` in `permissions.ask`, so a prompt appears whatever mode the session is in, and the human decides when work is committed. Commits are made only when the human asks and only for a completed, verified functionality module (see Commits in section 4). The cost is one prompt per command, and an agent that runs while nobody is at the terminal waits on it; if that matters more than the safety, move the two entries to `allow` and rely on the written rule alone.
- **Block edits outside the workspace** and in the lock files themselves (`settings.json`, `hooks/`), except folders you allow by name in the hook config (for example the agent's own memory folder). The human edits the locks.
- **Protect secrets:** deny reads of your secret files in `permissions.deny` (for example `Read(**/.env)`, key files, credential files), and block shell reads such as `cat .env` in a hook. A hook on the shell does not stop the file-reading tool, so the deny rule is the one that matters.
- **Don't run what nobody has read:** no piped installers (`curl ... | sh`), and no new dependency unless the plan names it.
- **Turn on the tool's sandbox** if your version has one, so the shell can reach only the workspace and the network you allow. Hooks and deny rules catch mistakes; they are speed bumps, not walls.
- **Allow-list** the read-only git commands and your fast and full check commands, or every run prompts.

Lessons that cost time on the first project:

- **A hook that crashes fails open.** Only exit code 2 blocks; any other failure lets the action through. After every hook edit, run it by hand with allowed and blocked inputs, and keep that self-test. Make the self-test compare the exact exit code (0 allowed, 2 blocked) and treat anything else as a failure: a syntax error in a patch to a guard was caught that way.
- **A deny rule matches by prefix, and a compound command is refused if any part matches.** `git push --dry-run` is blocked too, and so was a long command that merely contained it.
- **An editor buffer is not the file.** If a change to a locked file "didn't work", re-read it from disk first. It is often unsaved.
- **An automatic permission check may refuse an action.** Don't route around it; the human can say "retry".
- **The shell's folder can persist** between commands (the session reported its working folder changing more than once). Start each command from the project root, or use absolute paths, or it can end up inside a nested repo.

Not yet seen, but worth adding to the self-test: **try the bypasses, not only the obvious command.** For secrets (shown with a `.env` file): `head .env`, `grep . .env`, `cp .env x.txt`, a one-line interpreter command (`node -e`, `python -c`, `ruby -e` and so on) that opens it. For pushes: `git -C . push`, `sh -c "git push"`. A prefix rule may miss these, so the hook must catch what it can.

**Package the locks once.** Write and test the hooks once, then keep them in a **starter repo** (or a plugin, if your tool bundles hooks, skills, agents and commands) that every new project copies or installs: the hook scripts, their self-test, the `settings.json` skeleton, the rule files, the agent files and the `/organize` and `/teach` command/skill resources.

- **Config, not edits:** keep what differs per project (protected folders, folders outside the workspace the agent may write to such as its own memory folder, nested repos, the check commands), with self-test cases for an allowed folder, a sibling folder, a folder that only starts with the same letters, and a `../` trick out of it in one small config file that the hooks read, not edited into the hook code. Put that file inside the locked path (under `.claude/hooks/`, which the paths hook protects), so an agent cannot weaken the guards by editing it.
- **Versioning:** a `VERSION` file in the starter, copied into each project, and a tag per release. To update a project, diff its hooks against the tagged starter. When you fix a hook inside one project, fix it in the starter too and note it in that project's follow-ups.
- **Backstop:** a plugin can bundle hooks, skills and agents, but do not assume it can ship `permissions.deny` rules (unverified). Keep a copied `settings.json` skeleton as well, and test that the deny rules block what they should.
- **Runtime:** the hooks need a scripting runtime on your machine; say which in the starter's README. The self-test travels with the hooks, and you re-run it after every copy.

## 7. Keeping context small

Cut repetition, not discipline.

- **Know what loads every turn.** `CLAUDE.md` and every rule file without a `paths:` line load in every session, so moving text between them saves nothing. Keep `CLAUDE.md` to the working agreement, the area map, the two check commands, the flow and pointers. Give area rules a `paths:` line (for example `paths: src/api/**`) so they load only when those files are touched. Keep procedures in commands, skills and agent files, which load when used. Check what actually loads with `/memory` and `/context`; path rules have had format quirks, so test one before relying on it.
- **Briefs are pointers, not copies:** module, requirement ID, files, happy/sad paths and first test. Everything standing lives in the agent file or organized plan.
- **Point at the files.** Name the files and the pattern to copy. The agent widens its search only when it finds a dependency or a risk, and says so. No whole-repo survey for a small module.
- **Quiet output:** summary test reporters, focused diffs, the part of a file that matters. Show the full output for a failure or a security-sensitive check.
- **Teach only when useful.** `/teach` is invoked on demand and reads the code directly. Do not preload long interactive learning files into every session or regenerate the same explanation; link to an existing HTML learning file when it already covers the topic.
- **Cost is not context.** Caching can make repeated text cheaper, but it still fills the window. Measure before trimming on a hunch.

## 8. Interactive learning files

Learning is separated from the delivery loop. The human can run `/teach <module, feature, file or concept>` whenever an explanation would be useful. It is a skill that runs directly as `/teach`, and it creates a self-contained interactive HTML file under `.claude/logs/learning/`, for example `<date>-<story-id>-<module-or-topic>.html`.

The skill must inspect the real code and relevant tests before explaining. It must not invent code, file names, execution behaviour or test results. The HTML learning file should include, when relevant:

1. **ELI5 overview:** what the feature does, why it exists, and an everyday analogy before technical detail.
2. **Technical fundamentals:** explain the concepts used, define jargon, and connect each concept to the actual implementation.
3. **Code behaviour:** walk through the real execution flow step by step, including inputs, outputs, important branches, state changes, errors and relevant edge cases.
4. **Code snippets:** show short, real snippets from the project with file paths and explain the important lines. Keep snippets focused rather than copying whole files.
5. **Files touched:** list every file changed for the module, with its purpose/responsibility and a concise description of what changed. Distinguish files changed by the module from related files merely read for context.
6. **Tests and verification:** describe what the tests cover and what they do not prove. Include actual commands/results only when verified from the current project state.
7. **Interactive learning:** use lightweight HTML/CSS/JavaScript interactions where they improve comprehension, such as expandable explanations, tabs for code-flow stages, or a glossary reveal. Keep the page responsive, accessible and usable offline. Do not add external dependencies or require a server.
8. **Recap:** summarize the feature, the key technical concepts and the files worth revisiting.
9. **Quiz:** always end with an interactive multiple-choice quiz (see "Quiz rules" below).

### Quiz rules
- **Shape:** 4 to 6 questions, 3 options each, exactly one correct. Questions come from the real code, tests and flow on the page. Never ask about behaviour you did not verify.
- **A wrong answer** shows a hint written for that specific option and lets the learner try again. The hint nudges in plain words and never gives the answer away.
- **A right answer** shows a short explanation of why, in ELI5 words (an everyday analogy, no undefined jargon), and locks the question.
- **Wording:** every hint and explanation is ELI5. Mix the position of the correct answer across questions.
- **Accessibility:** show right and wrong with text marks (for example "Correct" and "Not quite"), not colour alone. Keep buttons at least 44 px tall and usable from the keyboard.
- **End of quiz:** show a first-try score and a "Start over" button.
- **Offline and no JavaScript:** keep everything inline, and add a plain list of the questions with their answers and explanations so the page still teaches with JavaScript off.
- **Check before saving:** verify every correct answer and explanation against the code and tests.
- **Look:** use your own house style (colours, fonts) if you have one, and keep text contrast at 4.5:1 or better.
- **Scope:** apply this to new pages only. Do not retrofit older learning files.
- **Reuse one pattern:** keep a small `quiz-pattern.html` next to `SKILL.md` (a starter is in the appendix) so every page behaves the same.

The output is an HTML artifact for learning, not application code. Save it only in `.claude/logs/learning/`. Do not change the app, tests, project configuration or dependencies to create it. Do not make `/teach` a prerequisite for the next module, review or commit. If the folder is git-ignored, keep the learning file out of commits.

A minimal learning index (`.claude/logs/learning/INDEX.md`) may list generated HTML files, their topics and links to the concepts they cover. Update it only when `/teach` creates a new artifact. Do not add mandatory learning steps to the development loop.

## 9. Starting a new project

1. **Sources of truth first:** requirements with IDs (`REQ-01`), spec, standards with rule IDs (`ST-01`) each tagged tool or review, the glossary, and an empty `docs/follow-ups.md` for anything parked on purpose (tracked, because interactive learning files are usually git-ignored). On a brand-new project, add a design step that produces the spec and first ADRs.
2. **`CLAUDE.md`:** where the AI may write, no unprompted git writes, the human approves, the `Mode:` line (`personal` or `team`), an area map, the fast and full check commands, the flow, the levels.
3. **Rules:** git, comments, testing and one safety rule for your domain (section 10). Scope area rules with `paths:`.
4. **Agents:** organizer, builder, reviewer, each with narrow limits, a pattern to copy and the report format from section 5.
5. **Commands and skills:** create `/start-story`, `/organize`, `/review` and `/retro`; install the `/teach` skill. Adapt only the area names and check commands.
6. **Hooks and permissions before any agent writes code.** Test the hooks, including the bypasses in section 6. Start from your starter repo if you have one.
7. **Create the organized-plan template and an empty learning index**. Keep `.claude/logs/learning/` available for on-demand HTML artifacts. If you allow spikes, create their folder safely: git-ignored, excluded from the type check, the linter and the test runner, with a test that proves each of those (a rule that says "use a git-ignored scratch folder" is false until the config says so).
8. **Run one small real task** on the short path, then one on the full flow. Write down every step that felt pointless, trim, and run `/retro` with its six questions. Change the template only for problems you actually saw.

## 10. Adapting to your kind of project

Only four things change: the **areas**, the **safety rule**, and the **fast** and **full check** commands. The rows below are examples; pick the closest one or write your own. Anything else project-specific (architecture limits, data-integrity rules, deployment checks) belongs in that project's spec and standards, not in this template.

| Project type | Areas | Safety rule (examples) | Fast check | Full check |
|---|---|---|---|---|
| Web app | frontend, backend, database | Never log personal data. Validate all input. Escape output. | `npx vitest run <file>` | `npm run check` |
| Mobile app | app, backend | No secrets in the bundle. Handle offline and permission states. | `npx jest <file>` | `npm test` |
| Data pipeline | ingest, transform, load | Re-runnable. Never overwrite raw data. Record row counts. | `pytest <file> -q` | `pytest`, `dbt test` |
| Library / CLI | core, docs, examples | Public API changes are breaking and need an ADR. Destructive actions need a flag. | `cargo test <name>`, `go test ./<pkg> -run <Name>` | `cargo test`, `go test ./...` |
| Backend service | api, domain, persistence | Validate input at the boundary. Never log personal data. Migrations must be reversible. | `<test runner> <file or class>` | `<build tool> verify` |
| Infrastructure as code | modules, environments | The agent plans but never applies to a shared environment. No secrets in code or state. | `<tool> validate` | `<tool> plan` plus policy tests |

**Writing your safety rule:** answer four questions. (1) What is the worst thing a mistake could do (lose data, leak data, charge money)? (2) What must always hold? (3) Which changes are hard to undo? (4) Which changes need an experienced reviewer? The answers become the full-flow triggers, the "needs experienced review" items and the lines of the safety rule.

## 11. Lessons from the first real project

- **Check, don't assume.** Newest versions often do not work together (a linter that did not support the newest version of the language). Look up which versions each tool says it works with before pinning.
- **State a standard once and tag it.** *Tool* means a command fails; *review* means only a reader catches it. When a reader catches the same mistake twice, make it a tool check.
- **Re-check agent reports yourself.** They are usually right, and sometimes wrong in small ways (a miscount, an unverified claim). Run the key check again.
- **Run the same check locally and in CI.** The first push is the first real test on another operating system.
- **Agent-file edits take effect on the next turn.** After changing an agent's model or tools, test it in a new turn. Edited and tested in the same turn, an organizer still ran as the old model; the identical check one turn later ran as the new one.
- **Use a light review for tiny changes.** A full review agent on a one-line change is wasted effort.
- **Scripted edits can fail silently.** Backslashes and regexes were lost inside `node -e` and `sed`, and a new test assertion never landed, so its mutation check proved nothing. Make multi-line or backslash edits with the editor tool, and `grep` that a new assertion exists before its mutation check.
- **Run a whole-area review at the end of every story.** It found what no per-task review had looked at (for example, in one project the production build had no error boundary, so an unexpected error would have blanked the app).
- **Whole-area review checklist.** Beyond the code, look at: config excludes (type check, lint, test runner) for scratch, build and private folders; whether a rule file says something a lint rule or the standards contradict; links that appear both in data and in content; and every raw asset path that a framework helper does not cover.
- **Re-read the rule and agent files when an ADR is accepted.** `CLAUDE.md`, a rule file and an agent file all kept saying "the stack is not chosen" after the ADR was accepted.
- **Write ADRs for a reader who is new.** A correct but dense ADR gets skimmed and then ignored. Formal structure with plain wording keeps it readable and still reviewable.
- **Review docs-only changes for facts.** A document claimed a design was approved on the wrong date and the review missed it. For a docs-only module, brief the reviewer: "verify every date, number and name against the plan or the code".
- **Tests that keep docs and data honest.** Cheap guards that caught or closed real gaps: the spec names every field of a data type, links inside content bodies match the data, and bad or missing front matter is rejected.
- **A design-quality hook can flag intended design.** Fix real problems. For a confident false positive, use the narrowest ignore the tool offers and say so. If unsure, ask. The tool may block the agent from changing its own tooling, so the human runs the ignore command.
- **Before the first deploy, check raw asset paths.** A framework's link and asset handling follows the base path, but a plain image tag does not. Put such paths through one small helper. If CI sets the base-path variable on the test step, every test that reads it must set and clear it itself. Prove it with one build with the variable set and a search of the output, then a normal build.
- **No browser means a human pass.** Look-and-feel criteria (tilt feel, wrapping at narrow widths, focus ring on a transformed card) cannot be proven by jsdom tests. Plan the pass: three widths, keyboard only, and Lighthouse on a built site (not the dev server), mobile, performance and accessibility. Save the report as HTML into a git-ignored folder so the agent can read the numbers.
- **A mutation check is cheap and honest.** Breaking one line to watch a new test fail is what turns "green" into "proven".
- **A concrete picture teaches better than another question.** When a concept was missed twice, a two-line diagram or a step-by-step trace worked where asking the question a third time did not.
- **Example, on Windows: Git Bash rewrites a value that starts with `/`.** `NEXT_PUBLIC_BASE_PATH=/site npm run build` becomes a Windows path and the build fails; set `MSYS_NO_PATHCONV=1` first. A "CRLF will be replaced by LF" warning on `git add` is harmless when the repository stores LF.
- **Example, on Windows: check the tool shims and the line endings.** A package manager started through a one-off runner can have a broken shim (run its real entry point with `node` directly, and put a small wrapper on the PATH for scripts that call it). A machine with `core.autocrlf=true` checks out CRLF files, and a repo whose `.gitattributes` says `eol=lf` then fails its format check on files nobody touched (set `core.autocrlf input`).

## 12. Known gaps

- **First pilot, on one story** (a mobile-app frontend, six tasks, 2026-10-28 to 2026-10-30). What felt heavy: a Status block that became a log (addressed above). What earned its keep: the mutation check, the whole-area review, and the hooks with their self-test. Learning is optional and on demand, through `/teach` HTML artifacts. Pilot it on a second story, in a different area, before treating the numbers as settled.
- **Second pilot (a personal portfolio site: styling, 2026-10-27 to 2026-11-09).** 11 code and test commits, 6 modules plus 5 small ones, 0 spikes, two whole-area review rounds. Steps that caught real problems: mutation checks (a test that did not protect its guard, a bound test that read too early, an assertion that never landed), the module review (missing test branches) and the whole-area review (an unignored spike folder, config excludes, a data-versus-content link drift, a standards line that disagreed with lint). Not yet exercised: the organizer on a story with a draft (used once at the end), and `/teach` until late. Retro scores were 4 on most questions and 3 on "understood".
- **Team mode is untested.** The four phases and the staging gate were designed for a team with testers and have not been piloted. Pilot it on a real team story before trusting the staging checklist.
- **Architecture rules are checked only by reading**, unless you add a dependency-boundary tool for your language.
- **One approver:** you approve everything and an AI reviews it, so the two of you can agree on something wrong. Ask an experienced person to look at security, money or data changes early, and at anything marked "needs experienced review".
- **Hooks are not a sandbox.** They catch mistakes, not a determined bypass.
- **Still untested:** the spike level (never used in either pilot) and the starter-repo idea. The on-demand teaching approach is intended to keep learning useful without slowing delivery. The spike is the likeliest to be abused as a way around the flow; watch for it in `/retro`.

## Appendix: fill-in skeletons

### `CLAUDE.md`

```markdown
# <project>
## Working agreement (read first)
- Work ONLY inside this workspace. No git writes unless the human asks; never push.
- Use the words in `docs/glossary.md`; propose new words, add them only after the human's yes.
- The human is <experience level>: explain in plain words (define terms, an everyday example, why before how, a short summary) and get approval before code.
- Mode: personal (or team: four phases and a staging gate, see the template). Build one approved functionality module at a time. Verify its happy path and relevant sad paths, run the full check and review it before committing the completed module.
- Use `/teach` on demand to create an interactive HTML learning file; it is not a required development checkpoint.
## Area map
| Area | Stack | Folder |
|---|---|---|
Fast check: `<targeted test command>` · Full check: `<one command>`
## Fixed (do not change)
<spec files, standards, glossary, shipped code, the locks>
## Flow
<the level question, the level table, the loop from section 4>
```

### `.claude/settings.json` (the locks)

```json
{
  "permissions": {
    "allow": ["Read", "Glob", "Grep", "Bash(git status:*)", "Bash(git diff:*)", "Bash(git log:*)", "Bash(git show:*)", "Bash(<fast check>:*)", "Bash(<full check>:*)"],
    "ask": ["Bash(git add:*)", "Bash(git commit:*)"],
    "deny": ["Bash(git push:*)", "Bash(git reset --hard:*)", "Bash(git clean:*)", "Read(**/.env)", "Read(**/.env.*)"]
  },
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [{ "type": "command", "command": "node .claude/hooks/guard-bash.js" }] },
      { "matcher": "Write|Edit", "hooks": [{ "type": "command", "command": "node .claude/hooks/guard-paths.js" }] }
    ]
  }
}
```

Writing a hook script: it reads a JSON description of the action from stdin (`tool_input.command` for the shell, `tool_input.file_path` for edits), checks it, and calls `exit(2)` with the reason on stderr to block. Any other exit lets the action through, so test it by hand with allowed, blocked and bypass inputs. Use any runtime that your machine has (the example uses `node`; a shell, Python or other script works the same, and on Windows prefer a runtime over shell-specific syntax). Copy the guards from your starter repo (section 6), or from a project that already has them.

### `/start-story` command

```markdown
---
description: Interview me about a story (numbered questions with recommended answers), then restate it. No code.
argument-hint: <story, requirement IDs, or "design" to settle the visual direction>
---
Story: $ARGUMENTS

1. Read `docs/requirements.md`, `docs/spec.md`, `docs/standards.md`, `docs/glossary.md` and `docs/adr/`. Look facts up yourself in the files and the code. Never ask me what the repo can tell you. Also read `docs/follow-ups.md` and say which parked items this story would finish or touch, so they are planned with it and removed from the file when done.
2. Interview me in rounds. Each round asks every question that is ready to answer, numbered, each with your **recommended answer** ("yes" accepts it). Ask only decisions. The next round asks what depended on my earlier answers. Stop when nothing is left to ask.
3. Say where the story, the requirements and the spec disagree.
4. Propose new or fuzzy words for the glossary (term, meaning, words to avoid). Add them to `docs/glossary.md` only after I say yes.
5. Map the story to requirement IDs and give it a short story id (for example `S5`), used in plan and learning file names.
6. Finish by restating the shared understanding in plain words and ask: "Is that our shared understanding?" The restated draft is what `/organize` turns into modules.

If the story is "design": ask about mood, colours, fonts and references, and the open questions in `docs/requirements.md`. If you have a design skill, use it to propose 2 or 3 directions, each with a reason and a reduced-motion fallback. After I pick one, save it to `docs/design.md` and write any spec or requirement gaps as ADRs in `docs/adr/` with `Status: Proposed`.

Do not write code or a plan yet.
```

### `/review` command

```markdown
---
description: Review the completed module (Spec, then Standards), then apply the recommended fixes
argument-hint: [whole <area>]
---
Arguments: $ARGUMENTS
- **Short path:** do a quick checklist in the main session, with no reviewer agent. Spec: does the change do what was asked, and nothing more? Standards: which rule IDs apply, and does `<full check>` pass?
- **Full flow:** use the `reviewer` agent. With no argument it reviews the completed module (`git diff` plus new files, against the module in the organized plan). With `whole <area>` it reviews the whole area folder for drift (see the area map in `CLAUDE.md`).

Brief the `reviewer` with: the module and its acceptance criteria, the result of `<full check>` you already ran (with counts), the red-run evidence (the failing message and the mutation checks), and what the human approved. The reviewer is read-only and does not run the checks; tell it so, because otherwise it reports them as unverified. For a docs-only module, also tell it to verify every date, number and name against the plan or the code.

The review has two passes, Spec then Standards, and ends with "Recommended to apply" and whether the module is ready to commit.

Then apply the recommended fixes unless I say skip:
- A **behaviour change**: write a failing test first, then fix. Ask me first.
- A **refactor**: keep the tests green before and after, and change no test.
- Anything outside the module: ask me first.
Run `<full check>` afterwards and report the real results. Then, if there is a plan (a short-path change has none), update its Status block (current module, modules completed, files changed, last check, open issues, next action) and Log, and tell me the module is ready for my commit. Do not commit unless I ask; do not write a learning file unless I run `/teach`.
```

### `/retro` command

```markdown
---
description: Look back at what happened and suggest changes to the setup, not the code
argument-hint: [story id, and what to focus on]
---
Focus: $ARGUMENTS

Read what actually happened (this session, the organized plan with its Log, the review findings), not a summary of it. Look in seven places:
1. **Navigation:** did the agent struggle to find a file? Add a pointer.
2. **Automatic checks:** could a hook, lint rule or test have caught a mistake?
3. **Standards:** did a review miss something? Sort it as **mechanical** (a tool can check it, so it becomes a check) or **judgement** (a reader must check it, so it goes in `docs/standards.md`, tagged tool or review).
4. **`CLAUDE.md`:** has it grown too big? Move instructions into the standards or into checks.
5. **Tool economy:** were any commands wastefully expensive?
6. **No-ops:** instructions that change nothing the agent does. Delete them.
7. **Information access:** was something the agent needed missing?

Then score the story on six questions: correct (criteria and key failure cases verified?), traceable (requirement to code to evidence?), understood (could the human explain the changed files?), debuggable (could a failure be followed?), efficient (mistakes caught early, no dead steps?), safe (did the locks block what they should?). Count any spikes, and check that each ended in a written answer.

For each process step (organize, the module loop, mutation checks, review, whole-area review, `/teach`), note whether it caught a real problem or taught something. After about two weeks of use, or about ten modules, a step that did neither is a candidate to shorten or drop; the human decides. Human approval, tests, the full check, review and the hooks are not pruned.

Save the result to `.claude/logs/retro/<date>-<story-id>-<area>.md`, worst first, with a status per suggestion (todo, done, needs the human, skipped) that you keep up to date. Only suggest: I decide what changes. Change nothing else yourself.
```

### `/organize` command

```markdown
---
description: Structure a discussed draft into an approved, functionality-based build plan
---
Input: the human's discussion notes or draft plan, the story id, the decisions made, the constraints and the mode (the `Mode:` line in `CLAUDE.md`). If any is missing, return the question to the main session and stop. Do not restart discovery or silently change agreed decisions.
Organize the draft into ordered functionality modules. For each module include:
- Module ID and concise goal
- Requirement IDs
- Acceptance criteria
- Happy path (step-by-step expected success behaviour)
- Relevant sad paths (validation, errors, permissions, empty/boundary states and recovery)
- Expected areas/files (best current estimate; label uncertain paths as estimates)
- First failing test or approved alternative check
- Dependencies and blocked-by relationships
- Risks, assumptions and open questions

Give minimal feedback only: identify material gaps, ambiguous acceptance criteria, missing failure paths, risky assumptions, dependencies and one or two practical recommendations where useful. Check where CI differs from the local run (environment variables set only in CI, the operating system) and list each difference that could break a test or the build. Preserve the draft's intent. Do not invent requirements or make product/architecture decisions; ask the human where a decision is needed.
In team mode, structure the plan as in the team plan template (four phases and a staging gate). Use `.claude/logs/plans/TEMPLATE.md` (personal) or `TEMPLATE-team.md` (team) as the structure and save a story-specific copy under `.claude/logs/plans/<story-id>-plan.md`. Set a clear status block and wait for explicit human approval. Write no code.
```

### Organized plan template (`.claude/logs/plans/TEMPLATE.md`)

```markdown
# Organized plan: <story>
Flow: <level>, because <one line>
Source draft: <conversation / document / notes>

## Status
- Current module: <M1>, <not started | building | in review | done>
- Approval: <pending | approved, date>
- Decisions and constraints: <short list, or ADR links>
- Modules completed: <list, or none>
- Files changed so far: <paths>
- Last full check: <passed | failed: what>
- Open issues: <list, or none>
- Next action: <one line>

## Modules
### M1: <functionality name>
- Requirement: <REQ-03>
- Goal: <one sentence>
- Acceptance criteria:
  - [ ] <observable result>
- Happy path:
  1. <user/system action>
  2. <expected response>
- Sad paths:
  - <condition> -> <expected handling>
- Expected files/areas: <paths or estimates>
- First failing test: <name and contract> (or approved alternative check)
- Dependencies: <module IDs, or none>
- Risks / assumptions / open questions: <items, or none>

### M2: <next functionality>
<repeat module structure>

## Decisions / ADRs / rollback
<only when needed>

## Log
<dated history, newest first: approvals, module progress, check results, review outcomes and commits>
```

### Team mode plan template (`.claude/logs/plans/TEMPLATE-team.md`)

Use this instead of the plan template above when `Mode: team`. Keep the same Status block, Decisions and Log sections. This is the short form: also add `Mode: team` under the Flow line, a risks and spec-sections field per module, and a "not applicable" line for the staging gate.

```markdown
## Phase 1: Bare minimum happy path
- Shortest path, user action to success:
  1. <user action>
  2. <expected result>
- Essential UI element: <name, or not applicable>
- Essential API endpoint: <name, or not applicable>
- Essential data action: <name, or not applicable>
- Excluded on purpose: validation, error handling, edge cases, non-essential styling

## Phase 2: Vertical slice modules (happy path only)
### M1: <atomic module>
- Phase: 2 (happy path only)
- Sad paths deferred to: <phase 3 module ids, or none>
- Requirement: <REQ-03>
- Goal: <one sentence>
- Acceptance criteria:
  - [ ] <observable result>
- Expected files/areas: <paths or estimates>
- First failing test: <name and contract> (or approved alternative check)
- Dependencies: <module IDs, or none>

## Staging gate (the happy path can be handed to testers)
- [ ] Release candidate: full check green, tagged <tag>, built from the tag by <CI or command>. Who: <human>
- [ ] Staging environment separate from development and production, test data only, secrets from the environment
- [ ] Tester channel and install steps: <where>
- [ ] No downtime for testers: the previous staged build stays installable until the new one passes its smoke test; changes stay compatible with the staged build
- [ ] No downtime for developers: work continues on the main line; unfinished work is off the tag or behind a switch; testers use the tag
- [ ] Tester script (happy-path steps), known-gaps list and where to report
- [ ] Rollback: re-offer the previous staged build
- [ ] Smoke test run by the human before announcing

## Phase 3: Validation and edge cases (hardening)
- Validation rules: <input formats, missing data>
- Error scenarios: <network failure, unauthorized access, duplicate entries>
- Edge cases and empty states: <list>
- Tester findings: <added after staging, or none yet>
### M<n>: <hardening module>
- Phase: 3
- Scope: <which validation, errors or edge cases this module covers>
- Acceptance criteria:
  - [ ] <observable result>
- First failing test: <name and contract>

## Phase 4: Refinement and polish
- UI and UX: <loading states, feedback banners, animations>
- Tests still required: <unit and integration>
- Performance and refactoring: <items>
### M<n>: <polish module>
- Phase: 4
- Acceptance criteria:
  - [ ] <observable result>
```

### Module brief (what the main session sends the builder)

```markdown
Module <M1> from `<organized plan>`: <goal>. Requirements: <REQ-03>.
Area: <area>. Expected files: <paths>. Pattern to copy: <path>.
Happy path: <short summary>. Sad paths: <short summary>.
Acceptance criteria: <list>. First test: <name> (or approved alternative check).
```

### The organizer agent

```markdown
---
name: organizer
description: Structures a human-discussed draft into an ordered functionality-based plan.
tools: Read, Glob, Grep, Write
---
Input you expect: the human's discussion (this conversation or a named file), the story id, the decisions made, the constraints and the mode (the `Mode:` line in `CLAUDE.md`). If any of that is missing or thin, ask and stop. Treat the discussion as the source of truth. Do not restart discovery, silently alter decisions or invent requirements. In team mode, structure the plan as in the team plan template (four phases and a staging gate).
Read only the project context needed to understand the draft (requirements, spec, glossary, relevant architecture and follow-ups).
Organize the draft into cohesive functionality modules. Each module must include its goal, requirement IDs, observable acceptance criteria, happy path, relevant sad paths, expected files/areas, first test or approved alternative check, dependencies and risks/open questions.
Give minimal feedback: call out only meaningful gaps, ambiguous criteria, missing failure cases, risky assumptions, dependencies and one or two useful recommendations.
Separate confirmed decisions from assumptions. Ask the human when a product or technical decision is unresolved.
Write only `.claude/logs/plans/<story-id>-plan.md` using the plan template. Do not write or edit application code, tests, configuration or source-of-truth documents.
Stop after presenting the organized plan and concise feedback. Wait for explicit human approval before implementation begins.
```

### The builder agent

```markdown
---
name: builder
description: Implements one approved functionality module, test first.
model: sonnet-5.5
effort: medium
tools: Read, Glob, Grep, Write, Edit, Bash
---
Work ONLY in the approved area and module. Do not begin another module until the current one is complete and reviewed.
Read the organized plan, named files and the pattern first; widen the search only if you find a dependency or a risk, and say so.
Implement every approved happy-path and relevant sad-path acceptance criterion (in team mode, the paths the plan names for this module). Do not add behaviour not in the plan.
Stop and report to the main session before: a behaviour change not in the plan, touching anything fixed, changing scope, or guessing.
Start with ONE failing test at the agreed contract. Watch it fail (`<fast check>`), write only the code it needs, repeat. Run `<full check>` at the end of the module. A test that is green on its first run must be shown able to fail where practical: break the exact line it protects, watch it fail, restore the line and show `git diff` is empty.
Do not commit. A module is ready for review only when its acceptance criteria and checks are complete.
## Areas
<area>: <what it is>, <what is fixed (do not change)>, <the pattern to copy>
## Report (short)
Module: <ID and name>. Changed: <one line per change>. Files: <paths>.
Happy paths covered: <list>. Sad paths covered: <list>.
Checks: <command> -> passed | failed | not run (why) | not provable by a test (how else checked).
Unverified: <list or none>. Deviations from the plan: <list or none>.
Never report a result you did not see.
```

### The reviewer agent

```markdown
---
name: reviewer
description: Reviews a completed functionality module against its plan, spec and standards.
model: sonnet-5.5
effort: medium
tools: Read, Glob, Grep, Bash
---
Read the organized plan, module acceptance criteria, relevant spec and standards, and inspect the actual diff yourself. Do not rely solely on the builder's report.
Review happy-path behaviour, every relevant sad path (in team mode, only the paths the plan names for this module; check at the end of the story that hardening covered the rest), validation, authorization, state changes, error handling, regression risk and scope control.
Make no edits and no commits. The main session runs checks and supplies their real results; do not claim to have run checks.
Report numbered findings. Each finding must state severity (must-fix or nice-to-have), behaviour change or refactor, file and line, evidence, why it matters, and a recommended fix.
Flag for the human, rather than recommending, any behaviour change outside the approved module. End with unresolved issues and whether the module is ready to commit.
```

### `/teach` skill

One file: `.claude/skills/teach/SKILL.md`. A skill can be run directly as `/teach <module, feature, file or concept>`, so no separate command file is needed. If your tool lets you mark a skill as manual-only, do that, so it runs only when the human asks for it.

```markdown
---
name: teach
description: Explains real project code for a beginner and creates a self-contained interactive HTML learning file. Run as /teach followed by a module, feature, file or technical concept. Use only when the human asks for an explanation or a learning file.
---
# Teach

The topic is the module, feature, file or technical concept the human names after `/teach`. Explain it using the actual repository as the source of truth. Do not block or delay development.

## Required workflow
1. Identify the topic and its relevant implementation files. Read the relevant tests and call sites so the explanation follows real execution, not just one isolated file. If an existing learning artifact already explains the topic, link to it, or update it only when the implementation has materially changed.
2. Determine which files were changed for the requested module from the organized plan, git diff/history or the human's supplied file list. Clearly distinguish changed files from related files read for context.
3. Explain in this order:
   - ELI5: what it does, why it exists and an everyday analogy.
   - Fundamentals: define each technical concept in simple language.
   - Behaviour: trace the real execution flow, inputs, outputs, branches, state changes and failure handling.
   - Code snippets: short real snippets with file paths and line references when available.
   - Files: each touched file's responsibility, purpose and exact change.
   - Verification: tests and checks actually observed, plus what they do not prove.
   - Recap: key idea, concepts and files to revisit.
   - Quiz: an interactive multiple-choice quiz of 4 to 6 questions (see the quiz rules below), as the last section.
4. Generate a self-contained HTML page with embedded CSS and JavaScript. Use semantic HTML, responsive layout, accessible controls and no external libraries, CDN assets or network requirements.
5. Add useful interactions only when they aid learning (for example, expandable explanations, tabs for flow stages, or glossary reveals). Keep interactions simple and reliable. The quiz is always included (see the quiz rules below).
6. Save the artifact under `.claude/logs/learning/` using `<date>-<story-id>-<module-or-topic>.html`. Update `INDEX.md` with the title, topic, module and relative file path.
7. Report the created path and a short outline of what the page covers.

## Quiz rules
- Build the quiz from `.claude/skills/teach/quiz-pattern.html`. Do not invent a different quiz mechanism.
- 4 to 6 questions, 3 options each, exactly one correct, drawn from the real code, tests and flow on the page.
- Wrong answer: show the hint written for that option and let the learner try again. The hint nudges in ELI5 words and never reveals the answer.
- Right answer: show a short ELI5 explanation of why, and lock the question.
- Mix the position of the correct answer. Show right and wrong with text, not colour alone. Buttons at least 44 px tall and keyboard accessible.
- Finish with a first-try score and a Start over button.
- Check every correct answer and explanation against the code and tests before saving.

## Guardrails
- Never fabricate code, file changes, line numbers, runtime behaviour, test results or requirements.
- If the source does not establish something, label it unknown or ask.
- Do not edit application code, tests, dependencies, project configuration or the organized plan.
- Do not make learning a required step before continuing development or committing a completed module.
- Keep the HTML file in the learning folder; do not stage or commit it when that folder is git-ignored.
```

### Quiz pattern (`quiz-pattern.html`)

Keep this next to `SKILL.md`. Copy the section and the two scripts into each learning page, fill the JSON, and style `.quiz` with your own CSS (bordered fieldsets, 44 px option buttons, a struck-through disabled wrong option, a highlighted right option).

```html
<section class="quiz" id="quiz" aria-labelledby="quiz-h">
<h3 id="quiz-h">Quiz: check yourself</h3>
<p class="hint">Pick an answer. If it is not right, you get a hint and can try again. When you get it right, you get a simple explanation.</p>
<div id="quiz-root"></div>
<p class="score" id="quiz-score" aria-live="polite"></p>
<button type="button" id="quiz-reset">Start over</button>
<noscript><p>The quiz needs JavaScript. Here are the answers with their explanations:</p><ol><li>Question one: answer and why.</li></ol></noscript>
</section>
<script type="application/json" id="quiz-data">
[
 {"q":"Question text?",
  "options":[
   {"text":"Wrong option","hint":"A kid-friendly nudge that does not give the answer away."},
   {"text":"Right option"},
   {"text":"Another wrong option","hint":"Another nudge."}],
  "answer":1,
  "why":"A simple ELI5 explanation of why the answer is right."}
]
</script>

<!--JS: paste before </body> -->
<script>
(function(){
var root=document.getElementById('quiz-root'),sc=document.getElementById('quiz-score'),rs=document.getElementById('quiz-reset'),el=document.getElementById('quiz-data');
if(!root||!el)return;
var qs=JSON.parse(el.textContent),done,first;
function build(){
root.textContent='';sc.textContent='';done=0;first=0;
qs.forEach(function(q,i){
var f=document.createElement('fieldset'),l=document.createElement('legend'),o=document.createElement('div'),fb=document.createElement('p'),tries=0,fin=false;
l.textContent=(i+1)+'. '+q.q;o.className='opts';fb.className='fb';fb.setAttribute('role','status');
q.options.forEach(function(op,j){
var b=document.createElement('button');b.type='button';b.className='opt';b.textContent=op.text;
b.addEventListener('click',function(){
if(fin||b.disabled)return;tries++;
if(j===q.answer){fin=true;b.classList.add('right');
o.querySelectorAll('button').forEach(function(x){x.disabled=true});
fb.className='fb good';fb.textContent='✓ Correct! '+q.why;
done++;if(tries===1)first++;
if(done===qs.length)sc.textContent='All done. First-try answers: '+first+' of '+qs.length+'.';
}else{b.classList.add('wrong');b.disabled=true;
fb.className='fb bad';fb.textContent='✗ Not quite. Hint: '+(op.hint||'Look at the code again.');}
});
o.appendChild(b);
});
f.appendChild(l);f.appendChild(o);f.appendChild(fb);root.appendChild(f);
});
}
rs.addEventListener('click',build);build();
})();
</script>
```

### Learning index (`.claude/logs/learning/INDEX.md`)

```markdown
# Learning library

| Topic | Module | What it covers | HTML file |
|---|---|---|---|
| <dependency injection> | <M2> | <plain-language overview and code flow> | <2026-11-02-S12-M2-dependency-injection.html> |
```

### Rule files (`.claude/rules/`)

Short summaries of the working rules. Where a rule file and `docs/standards.md` differ, the standards win. Adapt only the placeholders.

**`git.md`**

```markdown
# Git
- Commit only when the human explicitly asks. Never push, force-push, `reset --hard` or `clean -f` unless asked in that moment.
- The unit of commit is a **completed functionality module**: happy path and relevant sad paths done (in team mode the plan says which paths a module covers), acceptance criteria met, `<full check>` passing, review findings resolved or accepted by the human. One commit per module, in Conventional Commits format (`type(scope): subject`), imperative, explaining why. A short-path change is its own commit. Never commit intermediate work, failing tests or a half-finished module. <If you keep a global commit rule, say here which one wins in this project and whether a commit-splitting skill may be used.>
- Before committing, inspect the staged diff and run the full check again. The staged files must belong to the module: no unrelated work, secrets, build output or nested repo.
- The agent proposes the commit and its message; it runs `git add` and `git commit` only when the human says to. Stage by file path (interactive `git add -p` may not work in an agent shell).
- No AI attribution in commit messages or pull request descriptions: no `Co-Authored-By` line and no "Generated with ..." line. The human's wish overrides the tool's default.
- Start every shell command from the project root. The shell's folder can persist between commands, and a `git` command run inside a nested repository would act on the wrong project.
```

**`comments.md`**

```markdown
# Comments
- Keep comments to a minimum. Names, structure and tests explain the code.
- Comment only the important parts, and only where the code truly needs it: the why when it is not obvious (a browser quirk, a build workaround, a trade-off). Never comment what the code already says.
- Put longer reasons in the commit message, an ADR or the docs.
- Tool directives that need comment syntax (a lint suppression with its reason, a type-check pragma) and `TODO(human)` placeholders in content are fine.
- No commented-out code, no TODOs without a name.
```

**`testing.md`**

```markdown
# Testing
- Failing test first where practical, and watch it fail before writing code. If a test first makes no sense for a module (a pure layout tweak, a config file), the plan names the alternative check and the human approves it with the plan, never the builder alone.
- Test behaviour through the contract, not internals. Name the contracts here: <a rendered component, an API response, a schema, a helper function, a config object>.
- Every module covers its happy path and its relevant sad paths (invalid or missing data, empty state, boundary, denied or failed case), or says why a sad path does not apply. (In team mode the plan says which paths each module covers, and the story must cover its relevant sad paths in the hardening phase before it closes.)
- Fast check: `<fast check>`. Full check: `<full check>`. The production build is a test.
- Report real results only, with the status words **passed**, **failed**, **not run** (and why) or **not provable by a test** (and how else it was checked).
- The red run must fail for the stated reason: quote the failing message in the report. A syntax error or a missing import is not a red for the behaviour under test.
- A test that passes on its first run (a guard, a branch test) needs a mutation check: break the exact line it protects, watch it fail, restore the line and show `git diff` is empty. Confirm a new assertion exists (`grep`) before the mutation check.
```

**`shell.md`**

```markdown
# Shell and edits
- Edit files with the editor tool. For multi-line text use a quoted heredoc (<<'EOF'), so the shell does not expand backticks or dollar signs.
- No regexes, backslashes, backticks or dollar signs inside an inline `<runtime> -e` or `sed` command; use the editor tool instead. <Note any runtime that does not work on this machine.>
- After a scripted edit, check `git diff` shows it landed. A silent no-op makes a "red" test run meaningless.
- Delete specific files (`rm file`, `rmdir dir`). Recursive force-delete is blocked by a hook.
```

### `<domain>-safety.md`

```markdown
# <Domain> safety
- <the worst-case mistake, as a rule: "Never ...">
- <what must always hold: "Always validate ...">
- Never hardcode secrets; never read real secret files (for example `.env`).
- When requirements are unclear or conflict, stop and ask instead of guessing.
```
