# Testing
- Failing test first (`TE-01`), and watch it fail before writing code.
- Test behaviour through the seam, not internals (`TE-02`). Seams here: a rendered component, the content schema, a helper function.
- Full check: `npm run typecheck && npm run lint && npm test && npm run build`. The static build is a test (`TE-03`).
- Report real results only. If something fails or was not run, say so.
- At Level 1, one test first still applies.
