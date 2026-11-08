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

  it('names every field of the Project interface in the spec Project line', () => {
    const types = readFileSync('src/lib/types.ts', 'utf8');
    const spec = readFileSync('docs/spec.md', 'utf8');
    const body = types.match(/export interface Project \{\r?\n([\s\S]*?)\r?\n\}/)?.[1] ?? '';
    const fields = [...body.matchAll(/^ {2}(\w+)\??:/gm)].map((match) => match[1]);
    const line = spec.split(/\r?\n/).find((candidate) => candidate.startsWith('`Project`')) ?? '';

    expect(fields.length).toBeGreaterThan(0);
    for (const field of fields) {
      expect(line, `the spec Project line should name ${field}`).toContain('`' + field);
    }
  });
});
