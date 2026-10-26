import { describe, expect, it } from 'vitest';
import { formatMonth } from './dates';

describe('formatMonth', () => {
  it('turns a YYYY-MM string into a short month and year', () => {
    expect(formatMonth('2026-06')).toBe('Jun 2026');
    expect(formatMonth('2025-12')).toBe('Dec 2025');
  });
});
