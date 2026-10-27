// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const ANSI = /\u001b\[[0-9;]*m/g;

function statusline(input: unknown) {
  const result = spawnSync(process.execPath, ['.claude/statusline.mjs'], {
    input: typeof input === 'string' ? input : JSON.stringify(input),
    encoding: 'utf8',
  });
  return { status: result.status, text: result.stdout.replace(ANSI, '').trim(), raw: result.stdout };
}

const usage = (used_percentage: number | null) => ({ context_window: { used_percentage } });

describe('the context status line', () => {
  it('shows the used percentage', () => {
    expect(statusline(usage(42)).text).toBe('ctx 42%');
  });

  it('rounds to a whole number', () => {
    expect(statusline(usage(41.6)).text).toBe('ctx 42%');
  });

  it('tells the human to compact from 65 percent', () => {
    expect(statusline(usage(64)).text).toBe('ctx 64%');
    expect(statusline(usage(65)).text).toBe('ctx 65% compact soon');
    expect(statusline(usage(90)).text).toBe('ctx 90% compact soon');
  });

  it('uses different colours below 50, from 50 and from 65', () => {
    const colours = [40, 55, 70].map((value) => statusline(usage(value)).raw.match(/\u001b\[(\d+)m/)?.[1]);
    expect(new Set(colours).size).toBe(3);
  });

  it('shows ctx -- when the number is missing and never crashes on bad input', () => {
    expect(statusline(usage(null)).text).toBe('ctx --');
    expect(statusline({}).text).toBe('ctx --');
    const bad = statusline('not json');
    expect(bad.status).toBe(0);
    expect(bad.text).toBe('ctx --');
  });
});
