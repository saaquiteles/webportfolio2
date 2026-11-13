import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useMediaQuery', () => {
  it('returns whether the query matches', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} }));

    expect(renderHook(() => useMediaQuery('(x)', false, false)).result.current).toBe(true);
  });

  it('returns the fallback when matchMedia is missing', () => {
    vi.stubGlobal('matchMedia', undefined);

    expect(renderHook(() => useMediaQuery('(x)', false, true)).result.current).toBe(true);
    expect(renderHook(() => useMediaQuery('(x)', true, false)).result.current).toBe(false);
  });

  it('subscribes to nothing and does not throw when the query cannot listen', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));

    expect(() => renderHook(() => useMediaQuery('(x)', true, true)).unmount()).not.toThrow();
  });

  it('removes an addListener subscription through removeListener on unmount', () => {
    const query = { matches: false, addListener: vi.fn(), removeListener: vi.fn() };
    vi.stubGlobal('matchMedia', () => query);
    const { unmount } = renderHook(() => useMediaQuery('(x)', true, true));

    unmount();

    expect(query.removeListener).toHaveBeenCalledWith(query.addListener.mock.calls[0][0]);
  });
});
