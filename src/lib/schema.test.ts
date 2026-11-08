// @vitest-environment node
import { describe, expect, it } from 'vitest';
import config from '../../velite.config';

const frontmatter = {
  title: 'A project',
  slug: 'a-project',
  summary: 'What it is.',
  date: '2026-10',
  tags: ['one'],
};

const schema = config.collections!.caseStudies.schema.omit({ body: true });

describe('case-study frontmatter schema', () => {
  it('accepts valid frontmatter', () => {
    expect(schema.safeParse(frontmatter).success).toBe(true);
  });

  it.each(['Bad Slug!', 'UPPER', 'under_score', '-leading', 'trailing-', 'double--dash', ''])(
    'rejects the slug %j',
    (slug) => {
      expect(schema.safeParse({ ...frontmatter, slug }).success).toBe(false);
    },
  );

  it('rejects an unknown field such as a mistyped tags key', () => {
    expect(schema.safeParse({ ...frontmatter, tag: ['one'] }).success).toBe(false);
  });

  it.each(['title', 'summary', 'date'])('rejects frontmatter missing %s', (field) => {
    const rest: Record<string, unknown> = { ...frontmatter };
    delete rest[field];
    expect(schema.safeParse(rest).success).toBe(false);
  });

  it.each(['2026-13', '2026-1', '26-10', ''])('rejects the date %j', (date) => {
    expect(schema.safeParse({ ...frontmatter, date }).success).toBe(false);
  });
});
