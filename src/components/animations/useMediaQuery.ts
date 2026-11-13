import { useCallback, useSyncExternalStore } from 'react';

function listen(query: MediaQueryList, onChange: () => void): () => void {
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }
  // Safari before 14 only has the deprecated addListener/removeListener.
  if (typeof query.addListener === 'function') {
    query.addListener(onChange);
    return () => query.removeListener(onChange);
  }
  return () => {};
}

export function useMediaQuery(query: string, serverValue: boolean, fallback: boolean): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window.matchMedia !== 'function') return () => {};
      return listen(window.matchMedia(query), onChange);
    },
    [query],
  );

  function getSnapshot() {
    return typeof window.matchMedia === 'function' ? window.matchMedia(query).matches : fallback;
  }

  return useSyncExternalStore(subscribe, getSnapshot, () => serverValue);
}
