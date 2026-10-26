// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('deploy workflow while deploying is on hold (ADR 0007)', () => {
  const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');

  it('runs only when started by hand, not on every push', () => {
    expect(workflow).toMatch(/^on:\s*\r?\n\s+workflow_dispatch:/m);
    expect(workflow).not.toMatch(/^\s+push:/m);
  });

  it('runs the same full check as the developer', () => {
    expect(workflow).toContain('run: npm run check');
  });
});
