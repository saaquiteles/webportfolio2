# webportfolio2

My personal web portfolio: a creative showcase plus a general site (about, projects, contact). It is a static Next.js site built for GitHub Pages.

**Status:** in development. The home, about, contact and projects pages and the case studies are written. The blog, motion and final styling are planned, and the deployment to GitHub Pages is on hold.

## What is in it

| Page | Route |
|---|---|
| Home | `/` |
| About (experience, education, photo) | `/about/` |
| Projects | `/projects/` |
| Case study, one per project | `/projects/[slug]/` |
| Contact (links only, no form) | `/contact/` |

Projects are typed data in `src/data/projects.ts` plus one MDX case study each in `content/projects/`. A test fails if the two disagree. Adding a project means adding those two things and no other code.

## Built with

Next.js (App Router, static export), TypeScript, Tailwind CSS v4, Velite with MDX, Vitest and Testing Library, ESLint.

## Getting started

You need Node 22.12 or a newer 22.x, or Node 24.

```bash
npm install
npm run dev      # start the dev server at http://localhost:3000
npm run check    # type check, lint, tests, hook self-test and the static build
```

`npm run content` turns the MDX files into typed data in `.velite/`. It runs by itself before `dev`, `build`, `test` and `typecheck`. The static site is written to `out/`.

## Folders

| Folder | What lives there |
|---|---|
| `src/app` | Pages and layout |
| `src/components` | `global/` (header, footer) and `sections/` (page parts) |
| `src/data` | Profile, experience and project data |
| `src/lib` | Shared types and small helpers |
| `content/projects` | MDX case studies |
| `docs` | Requirements, spec, standards, glossary and decision records (`docs/adr`) |
| `.claude` | Rules, agents, commands and hooks for the Claude Code workflow |

## How it is built

Every code change is made test first with Claude Code, and each task passes `npm run check`. A second agent reviews each change, and each task ends with a learning note. The rules live in `CLAUDE.md` and `docs/standards.md`.

## Privacy

My resume and original photos are kept in a git-ignored `private/` folder and are never committed. Only the small web copy of the photo is published. A test (`src/lib/privacy.test.ts`) fails if a phone number or an unapproved email address appears in a tracked file.

## Credits

- The agentic workflow was simplified with ideas from [Matt Pocock's skills](https://github.com/mattpocock/skills).
- Credits for the assets used in each project are on its case study page.
