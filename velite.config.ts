import { defineCollection, defineConfig, s } from 'velite';

const caseStudy = defineCollection({
  name: 'CaseStudy',
  pattern: 'projects/**/*.mdx',
  schema: s.object({
    title: s.string().min(1),
    slug: s.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase words joined by hyphens'),
    summary: s.string().min(1),
    // Dates are stored as YYYY-MM strings, not full dates (ADR 0011).
    date: s.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'date must be YYYY-MM'),
    tags: s.array(s.string().min(1)),
    body: s.mdx(),
  }).strict(),
});

export default defineConfig({
  root: 'content',
  // Assets default to public/static, so keep them under .velite and never write into public/.
  output: { data: '.velite', assets: '.velite/static' },
  collections: { caseStudies: caseStudy },
});
