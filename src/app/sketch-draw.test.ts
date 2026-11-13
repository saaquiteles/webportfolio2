// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { mediaStart, motionSafe, outside } from './css-helpers';

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
