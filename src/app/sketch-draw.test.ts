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

describe('the arrow draw animation in globals.css', () => {
  it('has a no-preference media block holding the keyframes and the class', () => {
    expect(mediaStart).toBeGreaterThan(-1);
    expect(motionSafe).toMatch(/@keyframes\s+sketch-draw\s*\{/);
    expect(motionSafe).toMatch(/stroke-dashoffset:\s*1/);
    expect(motionSafe).toMatch(/\.sketch-draw\s+path/);
    expect(motionSafe).toMatch(/stroke-dasharray:\s*1/);
    expect(motionSafe).toMatch(/animation:\s*sketch-draw/);
  });

  it('puts nothing of it outside that block, so reduced motion gets a plain arrow', () => {
    expect(outside).not.toMatch(/sketch-draw/);
    expect(outside).not.toMatch(/stroke-dash/);
  });

  it('draws the head after the shaft', () => {
    expect(motionSafe).toMatch(/\.sketch-draw\s+path:nth-child\(2\)\s*\{[^}]*animation-delay/);
  });
});
