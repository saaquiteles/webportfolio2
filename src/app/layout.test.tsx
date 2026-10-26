// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import RootLayout, { metadata } from './layout';

describe('RootLayout', () => {
  it('uses the profile name as the page title', () => {
    expect(metadata.title).toBe('Sean Argie A. Quiteles');
  });

  it('uses the headline as the page description, with no placeholder left', () => {
    expect(metadata.description).toBe('I build full-stack apps with Spring Boot and React.');
    expect(JSON.stringify(metadata)).not.toContain('TODO(human)');
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
