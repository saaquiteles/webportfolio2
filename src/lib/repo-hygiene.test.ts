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

describe('plans are working notes, not published (like learning notes)', () => {
  it('ignores every plan except the template', () => {
    const ignored = (file: string) => {
      try {
        git('check-ignore', '--no-index', '-q', '--', file);
        return true;
      } catch {
        return false;
      }
    };

    expect(ignored('.claude/logs/plans/2026-10-26-real-content.md')).toBe(true);
    expect(ignored('.claude/logs/plans/TEMPLATE.md')).toBe(false);
  });

  it('tracks no plan other than the template', () => {
    const tracked = git('ls-files', '.claude/logs/plans').split('\n').filter(Boolean);
    expect(tracked).toEqual(['.claude/logs/plans/TEMPLATE.md']);
  });
});
