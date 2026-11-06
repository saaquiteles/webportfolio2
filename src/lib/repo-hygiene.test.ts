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

describe('the Claude Code setup stays on this machine', () => {
  const ignored = (file: string) => {
    try {
      git('check-ignore', '--no-index', '-q', '--', file);
      return true;
    } catch {
      return false;
    }
  };

  it('ignores the settings, hooks, rules, skills, plans and notes', () => {
    for (const file of [
      '.claude/settings.json',
      '.claude/hooks/guard-bash.js',
      '.claude/rules/git.md',
      '.claude/skills/new-page/SKILL.md',
      '.claude/logs/plans/2026-10-26-real-content.md',
      '.claude/logs/learning/2026-10-26-note.md',
    ]) {
      expect(ignored(file), file).toBe(true);
    }
  });

  it('tracks no file under .claude', () => {
    expect(git('ls-files', '.claude').split('\n').filter(Boolean)).toEqual([]);
  });
});
