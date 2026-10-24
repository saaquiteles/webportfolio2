# ADR draft 0009: Add a .gitattributes file for line endings

Status: Draft (the human decides). Raised by the T1 review.

## Gap
The project is developed on Windows, where git may convert line endings to CRLF depending on each machine's `core.autocrlf` setting. Nothing in the repo fixes this.

## Why it matters
- Diffs can fill with line-ending noise.
- The GitHub Actions runner is Linux. Scripts with CRLF endings, such as the Node hook scripts in `.claude/hooks` or any future shell script, can fail with `\r` errors.
- Results differ between machines.

## What was checked (T7 review)
There is no CRLF in the repo today: `package-lock.json`, the four `.claude/hooks/*.js` files and `eslint.config.mjs` contain no carriage returns. So nothing can break on CRLF right now. The risk is for the future: on a Windows checkout with `core.autocrlf=true`, git converts files in the working tree only, while the repository and CI keep the committed bytes, so the problem only appears if a CRLF file is committed.

## Proposal
Add a root `.gitattributes` containing `* text=auto eol=lf`. Text files are stored and checked out with LF endings. If a narrower change is preferred, use `*.sh text eol=lf` only.

## Consequences
New file at the repo root, so it needs an owner (see ADR draft 0006). Add it before the first commit, so files are not committed with CRLF endings first. If files are already committed, run a one-time renormalise (`git add --renormalize .`), which is a git write the human runs. Level 3 when applied, because it affects every file.
