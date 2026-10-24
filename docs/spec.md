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
src/app/                  src/components/{animations,ui,global}/
src/data/projects.ts      src/data/experience.ts
src/lib/
public/                   .github/workflows/deploy.yml
```

## Data shapes
`Project` (in `src/data/projects.ts`): `slug`, `title`, `summary`, `year`, `tags: string[]`, `cover` (path under `/public`), `links?: { live?: string; repo?: string }`, `featured: boolean`.

MDX frontmatter, project: `title`, `slug`, `summary`, `date`, `tags`. Blog post: `title`, `slug`, `summary`, `date`, `tags`, `draft?: boolean`.

`Experience` (in `src/data/experience.ts`): `role`, `org`, `start`, `end?`, `summary`.

## Animation components (in `src/components/animations/`)
Wrappers are the only place that imports `framer-motion`; pages use the wrappers. Each wrapper honours reduced motion.
