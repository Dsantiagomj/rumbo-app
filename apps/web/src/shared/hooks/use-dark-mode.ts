import { useEffect, useState } from 'react';

/**
 * Observes the `.dark` class on `<html>` and returns whether dark mode is
 * active. Uses a MutationObserver so it reacts to runtime class toggles
 * (e.g. from a theme switcher) without requiring a shared context or store.
 */
export function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false,
  );

  useEffect(() => {
    const html = document.documentElement;
    const sync = () => setIsDark(html.classList.contains('dark'));

    const observer = new MutationObserver(sync);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });

    // Sync once in case the class changed between render and effect.
    sync();

    return () => observer.disconnect();
  }, []);

  return isDark;
}
