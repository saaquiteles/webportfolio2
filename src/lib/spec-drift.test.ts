// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('data shapes in the spec', () => {
  it('names every exported interface of src/lib/types.ts in docs/spec.md', () => {
    const types = readFileSync('src/lib/types.ts', 'utf8');
    const spec = readFileSync('docs/spec.md', 'utf8');
    const names = [...types.matchAll(/export interface (\w+)/g)].map((match) => match[1]);

    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      expect(spec, `docs/spec.md should name \`${name}\``).toContain(`\`${name}\``);
    }
  });
});
