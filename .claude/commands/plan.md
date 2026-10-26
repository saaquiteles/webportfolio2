---
description: Pick the level, then make a small plan and wait for approval
---
Ask the level question from "Flow" in `CLAUDE.md`: can this be undone with `git revert`, and how much breaks if it is wrong? Say "Flow: <level>, because <one line>".
- **Short path:** no plan file. Say in 2 or 3 lines what changes, in which file, and which test comes first. Wait for approval.
- **Full flow:** use the `planner` agent and save the plan from `.claude/logs/plans/TEMPLATE.md`. Include the contracts and a rollback, and write any new decision as an ADR in `docs/adr/` with `Status: Proposed`. Wait for approval.
If unsure, take the full flow. Do not write code until approved.
