---
description: Look back at what happened and suggest changes to the setup, not the code
argument-hint: [what to focus on]
---
Focus: $ARGUMENTS

Read what actually happened (this session, the plan and the learning notes), not a summary of it. Look in seven places:
1. **Navigation:** did the agent struggle to find a file? Add a pointer.
2. **Automatic checks:** could a hook, lint rule or test have caught a mistake?
3. **Standards:** did a review miss something? Sort it as **mechanical** (a tool can check it, so it becomes a check) or **judgement** (a reader must check it, so it goes in `docs/standards.md`, tagged tool or review).
4. **`CLAUDE.md`:** has it grown too big? Move instructions into the standards or into checks.
5. **Tool economy:** were any commands wastefully expensive?
6. **No-ops:** instructions that change nothing the agent does. Delete them.
7. **Information access:** was something the agent needed missing?

List what you found, worst first. Only suggest: I decide what changes. Change nothing yourself.
