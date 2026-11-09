import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useFinePointer } from './useFinePointer';

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
  return createElement('p', null, useFinePointer() ? 'fine' : 'coarse');
}

describe('useFinePointer', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns false during a server render even on a fine pointer', () => {
    stubMatchMedia(true);

    expect(renderToString(createElement(Probe))).toContain('coarse');
  });

  it('returns false when matchMedia is missing', () => {
    vi.stubGlobal('matchMedia', undefined);

    expect(renderHook(() => useFinePointer()).result.current).toBe(false);
  });

  it('returns true in the browser with a mouse', () => {
    stubMatchMedia(true);

    expect(renderHook(() => useFinePointer()).result.current).toBe(true);
  });

  it('returns false in the browser on a touch device', () => {
    stubMatchMedia(false);

    expect(renderHook(() => useFinePointer()).result.current).toBe(false);
  });

  it('follows a change while the page is open', () => {
    const media = stubMatchMedia(false);
    const { result } = renderHook(() => useFinePointer());

    act(() => media.change(true));

    expect(result.current).toBe(true);
  });

  it('removes the change listener on unmount', () => {
    const media = stubMatchMedia(true);
    const { unmount } = renderHook(() => useFinePointer());

    unmount();

    const added = media.query.addEventListener.mock.calls[0][1];
    expect(media.query.removeEventListener).toHaveBeenCalledWith('change', added);
  });
});
