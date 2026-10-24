---
description: Read-only review of the current change, or a whole area
argument-hint: [whole <app|ui|content>]
---
Use the `reviewer` agent. Arguments: $ARGUMENTS
- No argument: review the current change (`git diff`) against the story, spec and rule IDs.
- `whole <area>`: review the whole area folder for drift (see the area map in `CLAUDE.md`).
Findings are numbered, quote rule IDs, and are tagged [behaviour change] or [refactor]. Do not edit anything.
