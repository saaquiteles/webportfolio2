// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { bricolage, inter, jetbrainsMono } from './fonts';
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

  it('puts the three font variables on the html element', () => {
    const markup = renderToStaticMarkup(<RootLayout>x</RootLayout>);
    const htmlTag = markup.match(/<html[^>]*>/)?.[0] ?? '';
    for (const font of [bricolage, inter, jetbrainsMono]) {
      expect(font.variable).not.toBe('');
      expect(htmlTag).toContain(font.variable);
    }
  });

  it('renders children without adding a second main landmark', () => {
    const markup = renderToStaticMarkup(<RootLayout>x</RootLayout>);
    expect(markup).not.toContain('<main');
    expect(markup).toMatch(/<body><a [^>]*>Skip to content<\/a><header.*<\/header>x<footer.*<\/footer><\/body>/);
  });

  it('starts the body with a skip link to the main content, hidden until it has focus', () => {
    const markup = renderToStaticMarkup(<RootLayout>x</RootLayout>);
    const firstLink = markup.match(/<body>.*?(<a [^>]*>)/)?.[1] ?? '';

    expect(firstLink).toContain('href="#main-content"');
    expect(firstLink).toMatch(/class="[^"]*\bsr-only\b/);
    expect(firstLink).toMatch(/class="[^"]*\bfocus:not-sr-only\b/);
  });
});
