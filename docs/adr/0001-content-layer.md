# ADR-0001: Use Velite, not Contentlayer, for MDX content

Status: Accepted by the human on 2026-10-26, with the recommended options

## Decision
Use Velite to turn `content/**/*.mdx` into typed data.

## Why
Contentlayer is no longer actively maintained and has compatibility problems with newer Next.js versions. Velite does the same job (typed frontmatter, MDX compile) and is maintained. Check this is still true when the project is scaffolded.

## Consequences
The content schema lives in `velite.config.ts`. Schema changes are full flow.
