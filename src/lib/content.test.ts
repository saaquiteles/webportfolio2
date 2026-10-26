// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { caseStudies } from '#site/content';

describe('case-study collection', () => {
  it('contains the three case studies', () => {
    expect(caseStudies.map((study) => study.slug).sort()).toEqual([
      'buriccat',
      'cockatiel-recognition',
      'portfolio',
    ]);
  });

  it.each(caseStudies.map((study) => [study.slug, study] as const))(
    '%s has a title, summary, YYYY-MM date, tags and a body',
    (_slug, study) => {
      expect(study.title).toMatch(/\S/);
      expect(study.summary).toMatch(/\S/);
      expect(study.date).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
      expect(study.tags.length).toBeGreaterThan(0);
      expect(study.tags.every((tag) => typeof tag === 'string' && tag.length > 0)).toBe(true);
      expect(study.body).toMatch(/\S/);
    },
  );
});
