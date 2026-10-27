// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('the publish-review script', () => {
  it('shows the diff against origin/main for everything that becomes public text', () => {
    const { scripts } = JSON.parse(readFileSync('package.json', 'utf8')) as {
      scripts: Record<string, string>;
    };
    const script = scripts['publish-review'];

    expect(script).toBeDefined();
    expect(script).toContain('origin/main');
    for (const path of ['content', 'src/data', 'src/app', 'src/components', 'public', 'README.md']) {
      expect(script).toContain(path);
    }
  });
});
