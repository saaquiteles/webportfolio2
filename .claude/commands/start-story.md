---
description: Interview me about a story (numbered questions with recommended answers), then restate it. No code.
argument-hint: <story, requirement IDs, or "design" to settle the visual direction>
---
Story: $ARGUMENTS

1. Read `docs/requirements.md`, `docs/spec.md`, `docs/standards.md`, `docs/glossary.md` and `docs/adr/`. Look facts up yourself in the files and the code. Never ask me what the repo can tell you.
2. Interview me in rounds. Each round asks every question that is ready to answer, numbered, each with your **recommended answer** ("yes" accepts it). Ask only decisions. The next round asks what depended on my earlier answers. Stop when nothing is left to ask.
3. Say where the story, the requirements and the spec disagree.
4. Propose new or fuzzy words for the glossary (term, meaning, words to avoid). Add them to `docs/glossary.md` only after I say yes.
5. Finish by restating the shared understanding in plain words and ask: "Is that our shared understanding?"

If the story is "design": ask about mood, colours, fonts and references, and the open questions in `docs/requirements.md`. Use the `impeccable` skill to propose 2 or 3 directions, each with a reason and a reduced-motion fallback. After I pick one, save it to `docs/design.md` and write any spec or requirement gaps as ADRs in `docs/adr/` with `Status: Proposed`.

Do not write code or a plan yet.
