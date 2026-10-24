---
description: Pick a flow level, then produce a small plan and wait for approval
---
First pick the flow level using "Flow" in `CLAUDE.md`. Say "Flow: <level>, because <reasons>" and list the triggers you checked, including the ones that did not apply.
- Level 1: no plan file. Say in 2-3 lines what changes, in which file, and which test comes first. Stop and wait for approval.
- Level 2: use the `planner` agent, save the plan to `.claude/logs/plans/` (from `TEMPLATE.md`), stop and wait for approval.
- Level 3: as Level 2, plus seams confirmed in writing, rollback named, a whole-area review at the end, and an ADR draft if a decision is new.
If unsure between two levels, take the higher one. Do not write code until approved.
