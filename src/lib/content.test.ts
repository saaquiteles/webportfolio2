// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { caseStudies } from '#site/content';

describe('case-study collection', () => {
  it('contains buriccat with title, slug, summary, date and tags', () => {
    const buriccat = caseStudies.find((study) => study.slug === 'buriccat');

    expect(buriccat).toBeDefined();
    expect(buriccat?.title).toMatch(/\S/);
    expect(buriccat?.slug).toBe('buriccat');
    expect(buriccat?.summary).toMatch(/\S/);
    expect(buriccat?.date).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
    expect(Array.isArray(buriccat?.tags)).toBe(true);
    expect(buriccat?.tags.length).toBeGreaterThan(0);
    expect(buriccat?.tags.every((tag) => typeof tag === 'string' && tag.length > 0)).toBe(true);
    expect(buriccat?.body).toMatch(/\S/);
  });
});
