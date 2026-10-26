# Requirements (DRAFT: the human must review and edit)

## Purpose
A personal web portfolio that works as a **creative showcase** (visual first, heavy motion) and a **general personal site** (about, projects, blog).

## Audience
Recruiters, collaborators and clients who land on the site for under a minute, plus readers of the blog.

## Must have
- R-01 Home page with a strong visual first impression and a clear one-line statement of who I am.
- R-02 Projects index and one case-study page per project (written in MDX).
- R-03 Blog index and one page per post (written in MDX).
- R-04 About page, including experience history.
- R-05 Contact: email link and social links. No server-side form.
- R-06 Animated page transitions and scroll-driven motion on the showcase pages.
- R-07 Works on phone, tablet and desktop.
- R-08 Adding a project or a post means adding one file (and one data entry for projects). No code changes.
- R-09 Deploys to GitHub Pages automatically when `main` is pushed.

## Should have
- R-10 Light and dark theme.
- R-11 RSS feed for the blog.
- R-12 Open Graph images and page titles for sharing.

## Quality bar
- Motion respects `prefers-reduced-motion` (see `A11Y-03`).
- Keyboard navigable, readable contrast, semantic HTML (see `A11Y-*`).
- Lighthouse performance and accessibility of 90 or more on the home page (first guess, adjust after the first build).

## Out of scope (for now)
Comments, a CMS, user accounts, a server-side contact form, analytics.

## Open questions for the human
- Name, tagline, and the real list of projects and posts?
- Custom domain, or `<user>.github.io/<repo>` (which needs a `basePath`)?
- Visual direction (mood, colours, fonts)? Run `/start-story design` to settle this before building pages.
