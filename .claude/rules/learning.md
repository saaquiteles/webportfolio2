# Learning notes
One note per task in `.claude/logs/learning/`, named `YYYY-MM-DD-<task>.md`, from `TEMPLATE.md`. Write it once, after the review, with `Status: Final`.
- Sections: who did what (about six bullets in total), what was built, why this way, key terms, follow the flow through the files, what the tests prove (Red, Green and Not proven), what the review changed, 3 likely questions, and a two-line summary.
- Define every term in plain words with an everyday example. About 40 lines; shorter for a short-path task.
- When a later task corrects a claim in an earlier note, add a one-line correction to the earlier note, so no finished note stays wrong.
- Add anything parked for later (a deferred fix, a stale-prone fact) to `docs/follow-ups.md`, which git tracks. Learning notes are git-ignored, so a follow-up that lives only in a note is invisible.
