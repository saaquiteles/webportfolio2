// @vitest-environment node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');

function blockAt(text: string, openBraceIndex: number): string {
  let depth = 0;
  for (let i = openBraceIndex; i < text.length; i++) {
    if (text[i] === '{') depth++;
    if (text[i] === '}' && --depth === 0) return text.slice(openBraceIndex + 1, i);
  }
  return '';
}

const mediaStart = css.indexOf('@media (prefers-reduced-motion: no-preference)');
const motionSafe = mediaStart === -1 ? '' : blockAt(css, css.indexOf('{', mediaStart));
const outside = mediaStart === -1 ? css : css.replace(motionSafe, '');

describe('the headline settle animation in globals.css', () => {
  it('has the keyframes and the letter class inside the no-preference block', () => {
    expect(motionSafe).toMatch(/@keyframes\s+kinetic-settle\s*\{/);
    expect(motionSafe).toMatch(/\[data-letter\]\s*\{[^}]*animation:\s*kinetic-settle/);
    expect(motionSafe).toMatch(/var\(--kinetic-x\)/);
    expect(motionSafe).toMatch(/animation-delay:\s*var\(--kinetic-delay\)/);
  });

  it('starts letters at least 40 percent opaque so the headline paints at once', () => {
    const from = motionSafe.match(/@keyframes\s+kinetic-settle\s*\{\s*from\s*\{([^}]*)\}/)?.[1] ?? '';
    const opacity = Number(from.match(/opacity:\s*([\d.]+)/)?.[1]);
    expect(opacity).toBeGreaterThanOrEqual(0.4);
  });

  it('ends with the letters fully opaque and in place', () => {
    const to = motionSafe.match(/@keyframes\s+kinetic-settle\s*\{[^]*?to\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(to).toMatch(/opacity:\s*1\b/);
    expect(to).toMatch(/transform:\s*none/);
  });

  it('puts nothing of it outside that block, so reduced motion gets letters in place', () => {
    expect(outside).not.toMatch(/kinetic/);
  });
});
