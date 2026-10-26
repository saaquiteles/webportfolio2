# ADR 0010: Where personal source files and images live

Status: Accepted by the human on 2026-10-26, with the recommended options. Raised by the first content story.

## Gap
The portfolio needs the human's resume and photos as source material, but the repo is public and a resume contains a home address, a phone number and an email. `docs/spec.md` fixes `public/` but says nothing about where private source files go, and `ST-01` says a new folder needs an ADR.

## Proposal
Two folders with opposite jobs:
- **`private/`** (new, git-ignored by the single line `/private/`): the resume (`private/resume.md`) and full-size original photos (`private/photos/`). Nothing in it is ever committed or published. Agents may read it, and publish only what the human approves in the `/start-story` interview.
- **`public/images/`** (new, tracked): only the small web versions of images that are meant to be published.

Rules for a published photo:
- One plain, professional photo of the human alone (no other people's faces).
- Pre-sized to about 800 px wide, WebP or JPEG, under about 200 KB, because the static export does not resize images (`images.unoptimized`).
- Camera and location metadata stripped before it is added.
- Meaningful `alt` text (`A11Y-04`).
- Only the web version is committed; the original stays in `private/photos/`.

## Why
One folder ignore rule is safer than one rule per file: the human already had to rewrite a per-file rule once after renaming the resume, and a forgotten rule publishes personal data. Once something is pushed to a public repo it stays in git history even if it is deleted later, so the protection has to come before the first commit.

## Consequences
- The resume is not in the repo, so a fresh clone does not have it. That is intended.
- `private/` is a new top-level folder, recorded here as `ST-01` asks. The spec's folder layout should list `private/` and `public/images/` once this is accepted.
- A possible later hardening is an automatic check that `git ls-files private` is empty, so a leak fails the build. Not added now.
