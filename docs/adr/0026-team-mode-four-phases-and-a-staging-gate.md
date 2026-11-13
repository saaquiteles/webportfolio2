# ADR 0026: A team mode with four phases and a staging gate

Status: Accepted by the human on 2026-11-10. Raised on 2026-11-10, when the human refined the organizer agent.

## Decision
Keep the personal workflow as it is, and add an optional team mode where the plan has four phases (bare minimum happy path, vertical slice modules, hardening, polish) with a staging gate after the happy path.

## Gap
The human wants a way to build the full happy path first, hand it to testers, and keep developing with no downtime for testers or developers. That needs several people, a tester channel and a staging environment. For a personal project it adds work and no benefit, so it should not apply there.

## Proposal
- **Two modes.** `CLAUDE.md` has a `Mode:` line, `personal` or `team`. This project is `personal`.
- **Personal mode (unchanged).** Each module covers its happy path and its relevant sad paths. There are no phases and no staging gate. The plan uses `.claude/logs/plans/TEMPLATE.md`.
- **Team mode.** The plan uses `.claude/logs/plans/TEMPLATE-team.md`, with four phases:
  1. the bare minimum happy path;
  2. vertical slice modules, atomic and happy path only (a vertical slice is a thin working path through all the layers);
  3. hardening (validation, errors, edge cases, empty states);
  4. polish (UI and UX, remaining tests, performance, refactoring).
  A module covers the paths the plan names, so a phase 2 module may be happy-path only. Every sad path a module leaves out is listed on it as "deferred to" a named hardening module. The story closes only when phase 3 has covered the relevant sad paths, and the end-of-story review lists each deferred sad path with its owner and flags any without one.
- **Staging gate (team mode, after phase 2).** A checklist: a tagged release candidate built reproducibly; a staging environment apart from development and production; a tester channel; no downtime for testers (the previous staged build stays installable until the new one passes its smoke test); no downtime for developers (work continues on the main line and testers use the tag); a tester script and known-gaps list; a rollback; and a smoke test. Creating and pushing the tag, running the smoke test, publishing, distributing and deploying remain the human's actions, and a CI workflow that builds tags is a deploy-workflow change (full flow, with a named rollback).
- **The organizer** reads the mode and asks if it is not stated. It also asks for the human's discussion if it is missing.
- **Unchanged in both modes:** a test first where practical, mutation checks, the full check, an automatic review of every module, and one commit per module with the human's approval.

## Why
Testers can only find real problems in a working flow, so team mode builds the happy path first. A solo developer is the only tester, so the same split just delays the hard cases. Keeping both modes lets one workflow serve both kinds of project.

## Consequences
- In team mode, the main line holds happy-path-only features for a while. That is fine when nothing is deployed. On a live product, hardening must finish before a release.
- Already changed by the agent (tracked: `CLAUDE.md`, `WORKFLOW-TEMPLATE-generic.md` and this ADR; the rest are git-ignored and local-only): `.claude/agents/organizer.md`, `.claude/logs/plans/TEMPLATE-team.md` (new), `.claude/commands/organize.md`, `CLAUDE.md` (the `Mode:` line), `.claude/rules/git.md`, `.claude/rules/testing.md`, the builder and reviewer agents, and `WORKFLOW-TEMPLATE-generic.md`. Plans S4 to S6 keep their layout.
- Lines for the human to paste into `docs/glossary.md` (the "Functionality module" row says a module covers its happy path and relevant sad paths; in team mode the plan names the paths, so you may add "(in team mode, the paths the plan names)" to that row):
  - `| Staging gate | In team mode, the checklist that makes the finished happy path ready to hand to testers, with no downtime for testers or developers. | release checklist |`
  - `| Release candidate | A tagged commit where the full check passes, built reproducibly for testers. | latest build |`
  - `| Mode | The line in CLAUDE.md that says how plans are structured: personal (ordered modules) or team (four phases and a staging gate). | setting |`
  - `| Vertical slice | In team mode, a thin working path through all the layers (for example screen, server and data), built first for the happy path only. | spike |`
  - `| Hardening | In team mode, the phase that adds validation, error handling, edge cases and empty states to a working happy path. | bug fixing |`
- Rollback: the tracked files revert with `git revert` of the commit. The `.claude/` files are local-only, so edit them back by hand: remove the `Mode:` line and the team template, and keep only the 'Personal mode' section of `organizer.md`. Personal projects are not affected either way.
