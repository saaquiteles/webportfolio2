// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import RootLayout, { metadata } from './layout';

describe('RootLayout', () => {
  it('has a non-empty page title', () => {
    const { title } = metadata;
    if (typeof title !== 'string') throw new Error('title must be a string');
    expect(title.length).toBeGreaterThan(0);
  });

  it('declares the page language on the html element', () => {
    const markup = renderToStaticMarkup(<RootLayout>x</RootLayout>);
    expect(markup).toContain('<html lang="en"');
  });

  it('renders children without adding a second main landmark', () => {
    const markup = renderToStaticMarkup(<RootLayout>x</RootLayout>);
    expect(markup).not.toContain('<main');
    expect(markup).toContain('<body>x</body>');
  });
});
