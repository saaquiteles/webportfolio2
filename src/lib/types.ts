import type { caseStudies } from '#site/content';

// The alias resolves to index.js, so TypeScript infers the type from the data instead of using Velite's index.d.ts.
export type CaseStudy = (typeof caseStudies)[number];

export interface Profile {
  name: string;
  headline: string;
  tagline: string;
}
