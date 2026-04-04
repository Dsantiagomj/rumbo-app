import { useCallback, useState } from 'react';

/**
 * Persists state to localStorage with SSR-safe initialization.
 *
 * Reads from localStorage on mount and writes inside the setter.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const nextValue =
          typeof updater === 'function' ? (updater as (prev: T) => T)(prev) : updater;

        try {
          localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // Storage full or unavailable — silently ignore
        }

        return nextValue;
      });
    },
    [key],
  );

  return [value, set] as const;
}
