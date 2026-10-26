# ADR 0007: CI gate before deploy, and how Pages is deployed

Status: Accepted by the human on 2026-10-26. Raised by T7.

## Gap
`docs/spec.md` says only "GitHub Actions + Pages", and requirement R-09 says deploy on a push to `main`. Nothing says the checks must pass first.

## Proposal
`.github/workflows/deploy.yml` has two jobs.
- **`build`:** checkout, Node 24 with the npm cache, `npm ci`, `npm run check` (see the amendment), then upload `out/` as the Pages artifact. A failing check stops the run, so a broken push never replaces the live site.
- **`deploy`:** `needs: build`, environment `github-pages`, publishes the artifact.

Decisions inside it:
- **Triggers:** push to `main` and a manual "Run workflow" button only (amended: the push trigger is paused, see the amendment at the end). No pull-request runs, because the project has one author. Add them later if that changes.
- **Permissions:** only `contents: read` at the top. `pages: write` and `id-token: write` are set inside `deploy`, the only job that publishes.
- **Base path:** `NEXT_PUBLIC_BASE_PATH` comes from a repo variable, on the build step only. Unset means no prefix (`user.github.io` or a custom domain). Set it to `/<repo>` for a project page.
- **`actions/configure-pages` is deliberately omitted.** It mainly tells frameworks the base URL, which the variable already does. The cost is that enabling Pages is manual (Settings, Pages, Source: GitHub Actions).
- **Pinned by major tag:** `checkout@v7`, `setup-node@v7`, `upload-pages-artifact@v5`, `deploy-pages@v5` (the latest majors when this was written). Full commit hashes are stricter but need manual updates. Dependabot's `github-actions` ecosystem could automate updates later. Neither was added.
- **`.nojekyll`:** `upload-pages-artifact` excludes hidden files unless `include-hidden-files: true`, so `out/.nojekyll` is not uploaded. That is harmless: Jekyll only runs for branch deploys, not for the Actions source. The input was left at its default, because `true` would also publish any future dot-folder in `out/`. The spec line is still met in `public/`.
- **Concurrency:** group `pages`, `cancel-in-progress: false`, so a running deploy finishes and a newer push waits.

## Why
Checks before publishing is the cheapest way to keep a broken build off the live site. Least privilege keeps a job that installs packages from holding a deploy key it does not need.

## Consequences
- **First-run traps:** Pages must be enabled by hand; the `github-pages` environment only accepts deploys from the default branch, so a manual run from another branch is rejected; a project page with the variable unset builds and deploys but every `_next/` file returns 404.
- **Re-running an old run** rebuilds with the variable's current value, not its old one.
- **Unit test of the YAML** (amended): `src/lib/repo-hygiene.test.ts` pins the paused trigger and the `npm run check` step. Originally there was no unit test (`TE-02`), and the proof of the rest is the clean local run of the same sequence plus the first real push (`TE-03`). A one-off schema linter, `@action-validator/cli` 0.6.0 (last updated February 2024, so its schema may lag), was run from a scratch folder and passed; it was not added to the project.
- Rollback: re-run the last good run, or revert the commit and push. A failed build never replaces the live site.

## Amendment, 2026-10-26 (human decision after `/review whole app`)
- **Push trigger paused.** Deploying is on hold and Pages is off, so every push produced a red run. The workflow now starts only by hand (`workflow_dispatch`). When deploying resumes, re-add `push:` with `branches: [main]` under `on:`. Requirement R-09 (deploy on push) holds again from that moment.
- **The build job runs `npm run check`** (typecheck, lint, tests, hook self-test, build) with `NEXT_PUBLIC_BASE_PATH` set, so CI runs exactly what a developer runs. Its build writes the `out/` that is uploaded.
- **Trap found and fixed:** the hook self-test case "a file outside the workspace is blocked" used a Windows path (`C:/Users/...`), which Linux treats as a relative path, so it would have failed on the runner. The human changed it to the project's parent folder (`path.resolve(root, '..', ...)`), which is outside the workspace on every system.
- Rollback: `git revert` of the commit that made this change.
