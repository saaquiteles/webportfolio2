import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

function stubMatchMedia(matches: boolean) {
  let listener: (() => void) | undefined;
  const query = {
    matches,
    addEventListener: vi.fn((_type: string, callback: () => void) => {
      listener = callback;
    }),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal('matchMedia', vi.fn(() => query));
  return {
    query,
    change(next: boolean) {
      query.matches = next;
      listener?.();
    },
  };
}

function Probe() {
  return createElement('p', null, useReducedMotion() ? 'reduced' : 'allowed');
}

describe('useReducedMotion', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the finished state (reduce) during a server render even when motion is allowed', () => {
    stubMatchMedia(false);

    expect(renderToString(createElement(Probe))).toContain('reduced');
  });

  it('treats a missing matchMedia as reduced', () => {
    vi.stubGlobal('matchMedia', undefined);

    expect(renderHook(() => useReducedMotion()).result.current).toBe(true);
  });

  it('returns true when the visitor asks for reduced motion', () => {
    stubMatchMedia(true);

    expect(renderHook(() => useReducedMotion()).result.current).toBe(true);
  });

  it('returns false in the browser when motion is allowed', () => {
    stubMatchMedia(false);

    expect(renderHook(() => useReducedMotion()).result.current).toBe(false);
  });

  it('follows a change of the setting while the page is open', () => {
    const media = stubMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());

    act(() => media.change(true));

    expect(result.current).toBe(true);
  });

  it('removes the change listener on unmount', () => {
    const media = stubMatchMedia(false);
    const { unmount } = renderHook(() => useReducedMotion());

    unmount();

    const added = media.query.addEventListener.mock.calls[0][1];
    expect(media.query.removeEventListener).toHaveBeenCalledWith('change', added);
  });
});
