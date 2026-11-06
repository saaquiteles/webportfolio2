// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { pageLoaders, renderEveryVariant } from './render-pages';

describe('page landmarks', () => {
  it('finds the pages to check', () => {
    expect(Object.keys(pageLoaders).length).toBeGreaterThanOrEqual(5);
  });

  it('give every page exactly one main landmark, with the skip-link id', async () => {
    for (const [path, load] of Object.entries(pageLoaders)) {
      for (const markup of await renderEveryVariant(load)) {
        expect(markup.match(/<main[\s>]/g), path).toHaveLength(1);
        expect(markup, path).toMatch(/<main\b[^>]*\sid="main-content"/);
      }
    }
  });
});
