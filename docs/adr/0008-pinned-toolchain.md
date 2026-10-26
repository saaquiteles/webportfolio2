# ADR 0008: Pinned toolchain and linting

Status: Proposed (the human decides). Raised by T0 to T7.

## Gap
`docs/spec.md` lists tools but no versions, and several of the latest versions do not work together yet.

## Proposal
- **Node:** CI runs Node 24, the version used locally. `engines.node` is `^22.12.0 || ^24.0.0`, which is what Vitest 5 supports (Next needs 20.9 or newer).
- **Packages:** `package-lock.json` is committed and CI uses `npm ci`. Versions use caret ranges, except TypeScript.
- **TypeScript is pinned to `~6.0.3`, not 7.** `typescript-eslint` 8.72 only supports versions below 6.1.0, so TypeScript 7 would break linting. Revisit when `typescript-eslint` supports 7.
- **`@types/node` is `^24`**, to match the Node 24 runtime.
- **Vite 8 is a direct dev dependency**, because `@vitejs/plugin-react` 6 needs it and Vitest accepts it.
- **ESLint 10 with a flat config** (`eslint.config.mjs`) and `eslint-config-next` 16.4.3, which already includes `typescript-eslint`. The script is `eslint .`: `next lint` does not exist in Next 16. No Prettier.
- **Hooks:** the locked `.claude/hooks/*.js` files are CommonJS, so only the `no-require-imports` rule is turned off for them. They are still linted.
- **`@typescript-eslint/no-explicit-any` is pinned to `error`** with a why-comment (`TS-01`), even though the preset already sets it.

## Why
Each pin has a reason that was found by checking, not guessed. The goal is that `npm ci` plus the four scripts pass on a fresh checkout.

## Consequences
- **ESLint 10 against three plugins that list support only up to ESLint 9** (`eslint-plugin-import`, `jsx-a11y`, `react`). `npm ls` marks ESLint 10 "invalid" and `npm ci` prints "overriding peer dependency" warnings. Lint works and `npm ci --dry-run` passes. If a plugin update crashes, pin `eslint@^9`.
- **npm blocks the `unrs-resolver` install script** (`allowScripts`). Harmless: the platform binaries are prebuilt and lint passes without it, on a clean Windows install and expected the same on the Linux runner.
- **Accessibility rules are warnings only.** `jsx-a11y/alt-text` and `@next/next/no-img-element` come from the preset as warnings, so they never fail lint or CI. Promote `jsx-a11y/alt-text` to `error` in the ui story if `A11Y-04` should block a build.
- **`TS-04`** (unused exports, commented-out code) is checked in review only. A tool such as `knip` could automate it, but a new dependency is a full-flow decision and needs its own ADR.
- **Vitest runs with globals off**, so tests import `describe`, `it`, `expect` and `vi` explicitly. The default test environment is jsdom, and `// @vitest-environment node` is used per file where no DOM is needed (`layout.test.tsx`, `next.config.test.ts`).
