# Spec (DRAFT: fixes names and shapes the AI must not invent or rename)

## Stack
Next.js (App Router) with `output: 'export'`, TypeScript (strict), Tailwind CSS, shadcn/ui + Radix, Framer Motion, MDX via Velite (see `docs/adr/0001-content-layer.md`), Vitest + Testing Library, GitHub Actions + Pages.

## Static export constraints (the build fails on these)
- No API routes, middleware, server actions, or anything that needs a running server.
- `images.unoptimized: true`. Use plain `<img>` or `next/image` with `unoptimized`.
- Every dynamic route exports `generateStaticParams`.
- `trailingSlash: true`, and an empty `public/.nojekyll` so GitHub Pages serves `_next/`.
- Project-page hosting (`user.github.io/repo`) needs `basePath` and `assetPrefix`, set from one env var `NEXT_PUBLIC_BASE_PATH`.

## Routes
| Route | Purpose |
|---|---|
| `/` | Home / showcase |
| `/projects/` | Project index |
| `/projects/[slug]/` | Case study |
| `/blog/` | Post index |
| `/blog/[slug]/` | Post |
| `/about/` | About and experience |
| `/contact/` | Contact links |

## Folder layout
```
content/blog/*.mdx        content/projects/*.mdx
src/app/                  src/components/{animations,ui,global,sections}/
src/data/{profile,projects,experience}.ts
src/lib/
public/, public/images/   (web-sized images only)
private/                  (git-ignored: resume and original photos, ADR 0010)
.github/workflows/deploy.yml
```

## Data shapes
`Project` (in `src/data/projects.ts`): `slug`, `title`, `summary`, `year`, `tags: string[]`, `cover?: { src: string; alt: string }` (path under `/public`; optional, ADR 0012), `links?: { live?: string; repo?: string; paper?: string }` (`paper`: ADR 0016), `featured: boolean`. The list order is the display order.

MDX frontmatter, project: `title`, `slug`, `summary`, `date`, `tags`. Blog post: `title`, `slug`, `summary`, `date`, `tags`, `draft?: boolean`.

`Experience` (in `src/data/experience.ts`): `role`, `org`, `start`, `end?`, `summary`. The same file holds `Education` (`degree`, `school`, `start`, `end?`) and `Highlight` (`title`, `org`, `date`, `summary?`).

`Profile` (in `src/data/profile.ts`): `name`, `headline`, `tagline`, `intro`, `email`, `links: { linkedin, github }`, `photo?: { src, alt }`. Everything in it is public.

Dates in data and frontmatter are `YYYY-MM` strings (ADR 0011). Shared types live in `src/lib/types.ts`.

## Animation components (in `src/components/animations/`)
Wrappers are the only place that imports `framer-motion`; pages use the wrappers. Each wrapper honours reduced motion.
