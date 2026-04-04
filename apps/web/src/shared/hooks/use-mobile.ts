import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

function subscribe(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  mediaQuery.addEventListener('change', onStoreChange);

  return () => mediaQuery.removeEventListener('change', onStoreChange);
}

function getSnapshot() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches;
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, () => false);
}
