import { SHELL } from '@/shared/lib/strings';

/**
 * Skip-to-content link for keyboard and screen-reader users.
 *
 * Visually hidden by default, becomes visible on focus. Allows users to
 * bypass the sidebar/header/bottom-bar and jump directly to the main
 * content area (WCAG 2.4.1).
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {SHELL.skipToContent}
    </a>
  );
}
