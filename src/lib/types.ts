import type { caseStudies } from '#site/content';

// The alias resolves to index.js, so TypeScript infers the type from the data instead of using Velite's index.d.ts.
export type CaseStudy = (typeof caseStudies)[number];

export interface Profile {
  name: string;
  headline: string;
  tagline: string;
  intro: string;
  email: string;
  links: { linkedin: string; github: string };
}

export interface Experience {
  role: string;
  org: string;
  start: string;
  end?: string;
  summary: string;
}

export interface Education {
  degree: string;
  school: string;
  start: string;
  end?: string;
}

export interface Highlight {
  title: string;
  org: string;
  date: string;
  summary?: string;
}
