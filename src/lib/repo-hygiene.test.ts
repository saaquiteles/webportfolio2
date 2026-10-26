// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const git = (...args: string[]) => execFileSync('git', args, { encoding: 'utf8' });

describe('line endings (ADR 0009)', () => {
  it('asks git to store text files with LF', () => {
    expect(git('check-attr', 'eol', '--', 'package.json').trim()).toBe('package.json: eol: lf');
  });

  it('has no tracked file stored with CRLF or mixed endings', () => {
    const bad = git('ls-files', '--eol')
      .split('\n')
      .filter((line) => /^i\/(crlf|mixed)\b/.test(line));
    expect(bad).toEqual([]);
  });
});
