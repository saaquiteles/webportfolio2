# Plan: first real content
Flow: full flow, because the story publishes personal data to a public repo, spans the app, ui and content areas, adds a dependency (Velite) and changes the spec's data shapes.
Door and blast radius: two-way in git until the first push, one-way after it, because public history keeps every version. What breaks if it is wrong: (1) personal data leaks and cannot be taken back once pushed; (2) the new dependency can break every check (typecheck, test, build); (3) a header or footer in the layout shows on every page. Deploy is off for now, so no live site can break.
Status: Approved by the human on 2026-10-26 (the plan, ADRs 0001 and 0010 to 0015, and all 13 answers as recommended)
Planned by: the `planner` agent, model `claude-opus-5-5` (the `opus` alias). Written for the pilot (W8) so the plan's defects can be counted while building.

In plain words: we swap the placeholders for the approved real text, one page at a time. First comes a safety test that fails if a phone number or an unapproved email gets into the code. Then Home, About and Contact. Last come the projects, which need the MDX tool. A small trial task (a "spike") checks that tool works before anything else depends on it.

Order note (main session): T11 and T12 do not depend on T2 to T10, so run them right after T1. If Velite fails, ADR 0013 changes and so might `next.config.mjs`, and it is better to learn that first. The task numbers stay as they are.

Approval note: approving this plan also confirms the contracts listed below (`CLAUDE.md` asks for contracts in writing before the first test). Say so if you want to change one.

## Tasks
Each task is a vertical slice: it works end to end when it is done. Every task below is full flow; the tag says why.
| # | Task | First failing test | Acceptance criteria | Blocked by |
|---|---|---|---|---|
| T1 | Privacy guard [new pattern] (about 45 lines, over target: one test file) | `src/lib/privacy.test.ts`: "flags a phone-like string and an unapproved email" fails because the detector does not exist yet. The fake values are built at runtime, for example `'09' + '0'.repeat(9)`, a plus sign followed by the Philippine country code and a made-up `name@example` address, so the test's own source never matches its patterns. | Scans every text file that is tracked or not yet ignored (`git ls-files --cached --others --exclude-standard`; Q13) and skips binary files. Flags (a) Philippine mobile patterns: `09` plus nine digits, with or without spaces, dots or dashes, the Philippine country code with or without a plus sign, followed by `9` and nine digits, and the plus-sign form on its own; (b) any email other than `seanargieq@gmail.com`. Also checks `.gitignore` still has `/private/` (ADR 0010). The real phone number and address appear nowhere in the test. The current tree passes. | Plan approved; ADR 0015 accepted |
| T2 | Home: real name, headline, tagline [personal data] (about 30 lines) | Update `src/app/page.test.tsx` first: replace "marks the headline as a TODO(human) placeholder" with "h1 is `I build full-stack apps with Spring Boot and React.`" plus "shows the tagline `Programmer/Analyst · Spring Boot, React and React Three Fiber · Metro Manila`" and "shows the name `Sean Argie A. Quiteles`". | Text comes from one `Profile` record in `src/data/profile.ts`, with its type in `src/lib/types.ts` (`TS-02`). The tests assert the exact approved strings, so any change to published text has to be deliberate. One `h1` and one `main` (`A11Y-01`). The page only composes (`ST-04`). No colours (`ST-05`). T1 still passes. | T1; ADR 0011 accepted |
| T3 | Contact links on Home [personal data] (about 35 lines) | `src/components/sections/ContactLinks.test.tsx`: renders three links, `mailto:seanargieq@gmail.com`, `https://linkedin.com/in/saaquiteles` and `https://github.com/saaquiteles`. Fails: the component does not exist. Then a page test: Home shows those links. | Typed props interface (`TS-03`). Data read from `Profile`. External links are plain `<a>`, because `SE-02` covers internal links only. Each link has a descriptive name, and the email address is shown as visible text. Reachable by keyboard (`A11Y-02`). | T2 |
| T4 | Site title and description [personal data] (about 10 lines) | `src/app/layout.test.tsx`: "title equals the profile name and has no `TODO(human)`"; "description equals the headline". | `metadata` reads from `Profile`. `lang="en"` and the "no second main" test still pass. | T2 |
| T5 | About page with Experience entries (role, organisation, summary) [personal data] (about 40 lines, over target) | `src/components/sections/ExperienceList.test.tsx`: renders one item per Experience entry with its role and organisation. Then `src/app/about/page.test.tsx`: one `h1`, a `main`, an `h2` "Experience". | Route `/about/` (spec). `src/data/experience.ts` holds 2 entries: HTD Programmer/Analyst at Vertere Global Solutions, and Software Developer Intern at Bridge360. Each summary uses the resume's wording, adds no new numbers and names no clients (see Q6). The human reads the text before commit. Type in `types.ts` (`TS-02`). Thin page (`ST-04`). Landmarks (`A11Y-01`). | T2; ADR 0011 accepted |
| T6 | Date ranges on Experience entries (about 30 lines) | `src/lib/dates.test.ts`: `formatMonth('2026-06')` gives `Jun 2026`. Fails: the helper does not exist. Then ExperienceList shows `Jun 2026 – Present` and `May 2025 – Jul 2025`, and a data test checks every date is `YYYY-MM`. (Changed after review: no `formatMonthRange`.) | Dates are stored as `YYYY-MM` (ADR 0011) and parsed directly, so no date shifts by one month in other time zones. Rendered inside `<time dateTime>`. | T5 |
| T7 | Education and the "Also" section on About [personal data] (about 40 lines, over target) | About page test: `h2` "Education" shows `BS Computer Engineering`, `Mapúa University` and `Aug 2018 – Jan 2026`; `h2` "Also" shows the DataCamp Associate Data Engineer item (Aug 2026) and the Japan site visits item (Nov 2024). | Shapes as chosen in ADR 0011. The Japan item uses only resume wording, kept short. Headings stay in order: one `h1`, then `h2`s (`A11Y-01`). | T6; ADR 0011 accepted |
| T8 | Photo placeholder on About [personal data, the image comes later] (about 30 lines) | `src/components/sections/ProfilePhoto.test.tsx`: without a photo it renders no `img` and shows a `TODO(human): photo` placeholder; given `{ src, alt }` it renders an `img` with that `alt`. | Optional `photo?: { src; alt }` on `Profile`, left empty for now. When an image arrives it follows ADR 0010 (about 800 px wide, under about 200 KB, metadata stripped, in `public/images/`) and has meaningful alt text (`A11Y-04`). A plain `img` is fine because `images.unoptimized` is set (spec). | T5; ADR 0010 accepted |
| T9 | Contact page [personal data] (about 20 lines) | `src/app/contact/page.test.tsx`: one `h1` "Contact", a `main`, and the three contact links. Fails: the route does not exist. | Route `/contact/` (spec). Reuses `ContactLinks`. No form (R-05, `SE-01`). No invented intro text. | T3 |
| T10 | Shared header, nav and footer, only if the human says yes to Q1 [whole-site accessibility] (about 45 lines, over target) | Update `layout.test.tsx` first: its current `<body>x</body>` assertion becomes "body has `<header`, the children and `<footer`, and still no `<main`". Then `SiteHeader.test.tsx`: a `navigation` named "Main" with links to `/`, `/about/` and `/contact/`. | Links through `next/link` (`SE-02`). Landmarks `header`, `nav` and `footer` (`A11Y-01`). Visible focus (`A11Y-02`). Files in `src/components/global/` (spec). The footer holds only what Q1 approves. | T5, T9; Q1; ADR 0014 accepted |
| T11 | Velite spike, part A: content becomes typed data [new dependency, schema] (about 50 lines plus the lockfile, over target) | `src/lib/content.test.ts`: "the case-study collection contains `buriccat` with title, slug, summary, date and tags". Fails: Velite and the content do not exist yet. | Installs `velite@^0.4.0`. `velite.config.ts` has a collection whose fields match the spec's project frontmatter exactly (`title`, `slug`, `summary`, `date`, `tags`, plus the body). Adds a minimal `content/projects/buriccat.mdx`. `.velite/` is git-ignored and lint-ignored. The `#site/content` alias is set in both `tsconfig.json` and `vitest.config.mts`. Velite runs before `typecheck`, `test` and `build` (ADR 0013), so `npm run check` passes on a clean checkout. CT-01 red check: a broken frontmatter makes `npm run build` fail (verify a strict mode exists in 0.4.0). `npm ci` output is checked for blocked install scripts (esbuild, sharp). `next.config.mjs` is not touched. | ADR 0001 and ADR 0013 accepted |
| T12 | Velite spike, part B: `/projects/[slug]/` renders the MDX body in the static build [new pattern]. This is the decision gate. (about 40 lines, over target) | `src/app/projects/[slug]/page.test.tsx`: `generateStaticParams()` returns `[{ slug: 'buriccat' }]`; rendering the page with `params` set to `buriccat` shows `h1` = the title and a paragraph from the MDX body. | `dynamicParams = false` (spec: every dynamic route has `generateStaticParams`). An `MdxContent` component renders the compiled body. `npm run build` writes `out/projects/buriccat/index.html` with `trailingSlash`, and `npm run dev` (Turbopack) serves the page; both checked by hand and recorded in the learning note (`TE-03`). If either fails: stop, record it in ADR 0013, ask the human about the `@next/mdx` fallback. | T11 |
| T13 | `Project` data and a drift test [schema] (about 40 lines, over target) | `src/data/projects.test.ts`: "every Project has a case study with the same slug, title, summary and tags, and `year` equals the year of `date`, and every case study has a Project, and every case study has a unique slug". Fails: `projects.ts` does not exist. | `Project` type in `types.ts` with the cover choice from ADR 0012 (`TS-02`). One entry: `buriccat`, repo `https://github.com/saaquiteles/baccarat`, no `live` link. Also a guard test that renders every case study and asserts exactly one `h1` (a `#` in an MDX body would add a second; `A11Y-01`), from the T12 review. | T12; ADR 0012 accepted |
| T14 | Projects index with ProjectCard (about 40 lines, over target) | `ProjectCard.test.tsx`: the title links to `/projects/buriccat/`, the summary and tags show, the repo link is external, and no `img` appears when there is no cover. Then `src/app/projects/page.test.tsx`: one `h1` "Projects" and one card per Project. | Internal link through `next/link` (`SE-02`). If T10 is done, a "Projects" link is added to the nav. Thin page (`ST-04`). | T13 (and T10 if it is done) |
| T15 | Buriccat case study text and credits [personal data, third-party credits] (about 35 lines, mostly MDX) | Case-study page test for `buriccat`: an `h2` "Credits" with links to `https://kenney.nl` and `https://soundcloud.com/pinkbananamusic/casino-jazz-1`, each marked CC0; also the Claude chip models, the Gemini (Google) logo and the browser's speech synthesis. | The text uses only facts the human gave: a fun project to try React Three Fiber; React 19, Vite, React Three Fiber, GSAP, Vitest; 111 tests; repo link only, no demo. An optional `TODO(human)` line on how Claude was used on the code. The MDX body starts at `##`, so the page keeps one `h1` (`A11Y-01`). The human reviews the text before commit. | T13 |
| T16 | Portfolio project as a content-only addition (proves R-08) [personal data, credit] (about 30 lines: one MDX file plus one data entry) | Case-study page test for the new slug (see Q10): it renders and credits Matt Pocock's skills with a link. Fails: the file does not exist. | The diff touches only `content/projects/` and `src/data/projects.ts`, so adding a project needs no code change (R-08). The drift test passes with 3 entries (the thesis was added first). No company material and no training content. The credit link is checked before publishing. | T14 |

End of story: `/review whole app`, `/review whole ui`, `/review whole content`, then `/retro`. Before the first push, the human reads the whole diff since `origin/main`, because that push is the one-way step.

## Contracts
The human confirms each contract in writing before that task's first test (approving this plan does it).
- T1: a test that reads the files on disk and `.gitignore` and checks their text against the patterns. It checks files, not internals (`TE-02`).
- T2: render `Home` and check the `h1` text, the tagline and the name.
- T3: render `ContactLinks` and check each link's accessible name and `href`; render `Home` and find the same links.
- T4: import `metadata` from `src/app/layout.tsx` and check `title` and `description`.
- T5: render `ExperienceList` with the real entries and check role and organisation per item; render the About page and check one `h1`, a `main` and the "Experience" heading.
- T6: call the helper `formatMonthRange` with sample dates; render `ExperienceList` and find the `<time>` text.
- T7: render the About page and check the "Education" and "Also" sections and their items.
- T8: render `ProfilePhoto` with and without a photo and check the `img` and its `alt`, or the placeholder.
- T9: render the Contact page and check `h1`, `main` and the links.
- T10: render `RootLayout` to static markup and check header, footer and no `main`; render `SiteHeader` and check the nav's name and links. Risk: if `next/link` needs a router in jsdom, the test may need a small mock; say so in the learning note.
- T11: import the generated collection through `#site/content` and check the `buriccat` record. The CT-01 check is a by-hand red build with a broken frontmatter.
- T12: call `generateStaticParams()`; `render(await Page({ params: Promise.resolve({ slug: 'buriccat' }) }))` and check the `h1` and the body text. The build output is checked by hand.
- T13: import `projects` and the generated collection and compare them field by field.
- T14: render `ProjectCard` and check its link, summary, tags and that there is no `img`; render the Projects index and count the cards.
- T15 and T16: render the case-study page for the slug and check the Credits heading and its links.

## Decisions (ADRs)
Written to `docs/adr/` with `Status: Proposed`. Prerequisites the human still has to accept: ADR 0001 (Velite) before T11, and ADR 0010 (private folder and `public/images/`) before T8. ADR 0006 already expects `velite.config.ts` to arrive with this story.
- **ADR 0011:** Profile data and the About shapes (spec gap 1).
- **ADR 0012:** The Project shape: cover image and drift (spec gaps 2 and 3).
- **ADR 0013:** How Velite runs and how MDX renders (follows ADR 0001).
- **ADR 0014:** Site header, nav and footer, and where shared components live (spec gap 4; only if Q1 is yes).
- **ADR 0015:** Privacy guard test.

## Out of scope
- Design tokens, fonts and any styling (the next story; `ST-05` means no hard-coded colours meanwhile).
- Motion and wrappers.
- The blog (R-03, R-11).
- Featured projects on Home.
- Per-page titles and Open Graph images (R-12).
- Dark theme.
- Screenshots and a live demo for Buriccat.
- The real photo file.
- Deploy and `basePath`.
- A resume download (never).
- Any text not drawn from the resume or the human's own statements.

## Rollback
- **Publishing text (T2 to T9, T15, T16).** Before the push: `git revert` the commit, or fix it in a new commit. After the push: public history keeps it; only a history rewrite plus a force push, done by the human, removes it, and copies may already exist. So the real protection comes before the push: the T1 guard, the human reading every text before commit, and reading the full diff since `origin/main` before pushing.
- **The new dependency (T11).** `npm uninstall velite`, then revert the commit. That covers `package.json`, the lockfile, `velite.config.ts`, the scripts, `tsconfig.json`, `vitest.config.mts`, `.gitignore` and the eslint ignore. Delete `.velite/`. Then decide between `@next/mdx` and plain markdown.
- **A `next.config.mjs` change** (only if ADR 0013 falls back to option B or `@next/mdx`). One commit, which the config test protects. `git revert` restores it. Pages is off, so nothing live breaks.
- **Layout change (T10).** One commit, reverted with `git revert`. The layout test shows the earlier shape.
- **Schema or shape changes (T11, T13).** Revert the commit. CT-01 makes the build fail loudly if content and schema disagree.

## Questions
1. Header, nav and footer (spec gap 4): the interview did not cover them. Should T10 be in this story? If yes, what goes in the footer? Without T10, About, Contact and Projects have no links pointing to them.
2. Where do page-specific components such as `ExperienceList` and `ProjectCard` go: `src/components/global/`, or a new folder (which needs an ADR, `ST-01`)?
3. Glossary words for the new types, if ADR 0011 option (b) is chosen: for example "Education entry" and "Highlight".
4. The project cover: optional with an alt field, or supply an image now?
5. Drift: the test-based option, or one source now?
6. Does the resume's "training in agentic development" bullet count as training content that must stay out? Should Bridge360 keep the resume's "100% successful integration" and "reducing troubleshooting time" claims?
7. "Mapúa" or "Mapua"? "Inc." in organisation names? The UNIX Administration specialization?
8. Name placement on Home.
9. Should About start with a short intro drawn from the resume's professional summary? The plan leaves it out.
10. The portfolio case study: which slug, and the links to the public repos (`https://github.com/saaquiteles/webportfolio2` and `https://github.com/mattpocock/skills`).
11. The `date` and `year` for both projects.
12. `featured` (required by the spec) for both?
13. Should the privacy guard also scan `docs/` and the tracked plans, or all tracked files?

## Answers (approved by the human, 2026-10-26: "yes to all", the recommended option for each)
1. T10 is in this story. The footer holds only the name and the year.
2. Page-specific components go in a new folder, `src/components/sections/` (ADR 0014). `SiteHeader` and `SiteFooter` stay in `src/components/global/`.
3. Glossary words "Education entry" and "Highlight" are added (done).
4. `Project.cover` is optional, with an `alt` (ADR 0012). No image for now.
5. Drift between `projects.ts` and the MDX frontmatter is caught by a test (T13).
6. The Vertere "training in agentic development" line stays short and generic, with no course material. Bridge360's claims are kept as the resume words them.
7. Spelling "Mapúa" with the accent. No "Inc." in organisation names. The UNIX Administration specialization is included.
8. The name is a small line above the `h1`. The site title is the name alone.
9. About opens with a short intro drawn from the resume's professional summary. The human reviews it. (Adds a short text to T5.)
10. The portfolio case study has the slug `portfolio` and links `https://github.com/saaquiteles/webportfolio2` and `https://github.com/mattpocock/skills` (both checked public).
11. Dates: Buriccat `2026-08`, the portfolio `2026-10` (the months the repos were created).
12. `featured: true` for both projects.
13. The privacy guard scans every tracked text file, plus files not yet ignored (T1 acceptance updated).

ADR 0013 is accepted with option A (npm `pre` scripts), still subject to the spike (T11 and T12) proving it.

Status: Approved

## Amendment, 2026-10-26: the thesis is the first project (approved by the human, "yes to all, name the co-authors")
- New project `cockatiel-recognition` (the thesis paper), listed first in `src/data/projects.ts`; `buriccat` second. Added to T13, with its case study (`content/projects/cockatiel-recognition.mdx`) and its credits (the text is approved before commit, as in T15). Date `2025-10` (publisher record: 13 Oct 2025).
- `Project.links` gains an optional `paper` (ADR 0016, Proposed). The "source code soon" line is left out.
- The case study names the two co-authors, as the publisher lists them.
- Tags: python, opencv, pytorch, raspberry-pi, cnn, squeezenet. `featured: true`.
- T13 tests now cover two projects: drift, unique slugs, one `h1` each, and the order (thesis first).
