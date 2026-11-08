import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

vi.mock('framer-motion', () => ({ useReducedMotion: vi.fn() }));

describe('useReducedMotion', () => {
  it('treats an unknown preference as reduced, the safe default', () => {
    vi.mocked(useFramerReducedMotion).mockReturnValue(null);

    expect(renderHook(() => useReducedMotion()).result.current).toBe(true);
  });

  it('follows the visitor preference when it is known', () => {
    vi.mocked(useFramerReducedMotion).mockReturnValue(false);

    expect(renderHook(() => useReducedMotion()).result.current).toBe(false);
  });
});
