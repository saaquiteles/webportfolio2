// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { motionSafe, outside } from './css-helpers';

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
