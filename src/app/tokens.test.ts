// @vitest-environment node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { bricolage, inter, jetbrainsMono } from './fonts';

const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');

const tokens: Record<string, string> = {};
for (const [, name, hex] of css.matchAll(/--color-([a-z]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
  tokens[name] = hex.toUpperCase();
}

function color(name: string): string {
  const hex = tokens[name];
  expect(hex, `--color-${name} is missing from globals.css`).toBeDefined();
  return hex;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

describe('the contrast helper', () => {
  it('gives 21 for black on white and 1 for equal colours', () => {
    expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrast('#336699', '#336699')).toBeCloseTo(1, 5);
  });
});

describe('the colour tokens in globals.css', () => {
  it('holds the five approved colours exactly', () => {
    expect(color('paper')).toBe('#FBF5E9');
    expect(color('surface')).toBe('#FFFFFF');
    expect(color('ink')).toBe('#1E1B18');
    expect(color('tomato')).toBe('#C8321E');
    expect(color('blueprint')).toBe('#1F5FA8');
  });

  it('adds the approved muted, rule and grid colours', () => {
    expect(color('muted')).toBe('#5C544B');
    expect(color('rule')).toBe('#D8CDB8');
    expect(color('grid')).toBe('#E4E7EC');
  });

  it("removes Tailwind's default palette", () => {
    expect(css).toMatch(/--color-\*:\s*initial\s*;/);
  });

  it('matches the contrast ratios written in docs/design.md', () => {
    const within = (actual: number, expected: number) => Math.abs(actual - expected) <= 0.01;
    expect(within(contrast(color('ink'), color('paper')), 15.79)).toBe(true);
    expect(within(contrast(color('ink'), color('surface')), 17.14)).toBe(true);
    expect(within(contrast(color('tomato'), color('paper')), 4.92)).toBe(true);
    expect(within(contrast(color('blueprint'), color('paper')), 5.93)).toBe(true);
  });

  it.each(['ink', 'muted', 'tomato', 'blueprint'])('keeps %s text at 4.5 or more on paper and surface', (name) => {
    expect(contrast(color(name), color('paper'))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(color(name), color('surface'))).toBeGreaterThanOrEqual(4.5);
  });

  it.each(['ink', 'muted', 'blueprint'])('keeps %s text at 4.5 or more on the grid colour', (name) => {
    expect(contrast(color(name), color('grid'))).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps the blueprint focus ring at 3 or more on paper and surface', () => {
    expect(contrast(color('blueprint'), color('paper'))).toBeGreaterThanOrEqual(3);
    expect(contrast(color('blueprint'), color('surface'))).toBeGreaterThanOrEqual(3);
  });

  it('keeps the grid faint against paper (1.25 or less)', () => {
    expect(contrast(color('grid'), color('paper'))).toBeLessThanOrEqual(1.25);
  });
});

describe('the font tokens in globals.css', () => {
  it.each([
    ['heading', bricolage],
    ['sans', inter],
    ['mono', jetbrainsMono],
  ])('maps --font-%s to the loaded font variable', (name, font) => {
    expect(css).toContain(`--font-${name}: var(${font.variable});`);
  });
});

describe('the base styles in globals.css', () => {
  it('draws a visible focus ring in the blueprint colour', () => {
    expect(css).toMatch(/:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--color-blueprint\)/);
  });

  it('underlines links, so they still look like links after the reset', () => {
    expect(css).toMatch(/(^|\n)\s*a\s*\{[^}]*text-decoration:\s*underline/);
  });

  it('sets headings in the heading font', () => {
    expect(css).toMatch(/h1,[^{]*\{[^}]*font-family:\s*var\(--font-heading\)/);
  });

  it('paints a 32 px graph-paper grid from the grid colour', () => {
    expect(css).toMatch(/background-image:[^;]*var\(--color-grid\)/);
    expect(css).toMatch(/background-size:\s*32px 32px/);
  });
});
