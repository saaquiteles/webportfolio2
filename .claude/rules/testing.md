# Testing
- Failing test first (`TE-01`), and watch it fail before writing code.
- Test behaviour through the contract, not internals (`TE-02`). Contracts here: a rendered component, the content schema, a helper function, a config object.
- Full check: `npm run check` (typecheck, lint, tests, hook self-test, build). The static build is a test (`TE-03`).
- Report real results only. If something fails or was not run, say so.
- On the short path, one test first still applies.
