// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { caseStudies } from '#site/content';
import RootLayout from './layout';
import { pageLoaders, renderEveryVariant } from './render-pages';

const PLACEHOLDER = 'TODO(human)';

describe('placeholders', () => {
  it('finds the pages to check', () => {
    expect(Object.keys(pageLoaders).length).toBeGreaterThanOrEqual(5);
  });

  it('are not present in any rendered page', async () => {
    for (const [path, load] of Object.entries(pageLoaders)) {
      for (const markup of await renderEveryVariant(load)) {
        expect(markup, path).not.toContain(PLACEHOLDER);
      }
    }
  });

  it('are checked for every case study, so an empty list cannot pass silently', async () => {
    const [, load] = Object.entries(pageLoaders).find(([path]) => path.includes('[slug]'))!;

    expect(await renderEveryVariant(load)).toHaveLength(caseStudies.length);
    expect(caseStudies.length).toBeGreaterThan(0);
  });

  it('are not present in the shared header and footer', () => {
    expect(renderToStaticMarkup(<RootLayout>x</RootLayout>)).not.toContain(PLACEHOLDER);
  });
});
