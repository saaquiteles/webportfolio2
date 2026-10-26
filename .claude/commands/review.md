---
description: Review the current change (Spec, then Standards), then apply the recommended fixes
argument-hint: [whole <app|ui|content>]
---
Arguments: $ARGUMENTS
- **Short path:** do a quick checklist in the main session, with no reviewer agent. Spec: does the change do what was asked, and nothing more? Standards: which rule IDs apply, and does `npm run check` pass?
- **Full flow:** use the `reviewer` agent. With no argument it reviews the current change (`git diff` plus new files). With `whole <area>` it reviews the whole area folder for drift (see the area map in `CLAUDE.md`).

The review has two passes, Spec then Standards, and ends with "Recommended to apply".

Then apply the recommended fixes unless I say skip:
- A **behaviour change**: write a failing test first, then fix. Ask me first.
- A **refactor**: keep the tests green before and after, and change no test.
- Anything outside the task: ask me first.
Run `npm run check` afterwards and report the real results. Then write the learning note.
