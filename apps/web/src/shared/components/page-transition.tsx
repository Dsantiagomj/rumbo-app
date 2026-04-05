import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

type TransitionVariant = 'fade' | 'fade-up' | 'fade-scale';

interface PageTransitionProps {
  /** Content to animate */
  children: ReactNode;
  /**
   * Unique key that triggers re-animation on change.
   * Use the current route path for route transitions.
   */
  transitionKey: string;
  /** Animation variant. Defaults to 'fade-up'. */
  variant?: TransitionVariant;
  /** Additional classes for the wrapper */
  className?: string;
}

const VARIANT_CLASSES: Record<TransitionVariant, string> = {
  fade: 'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300 motion-safe:ease-out',
  'fade-up':
    'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:ease-out',
  'fade-scale':
    'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-[0.98] motion-safe:slide-in-from-bottom-1 motion-safe:duration-300 motion-safe:ease-out',
};

/**
 * Wraps page content with a subtle CSS entrance animation.
 *
 * Uses `tw-animate-css` utilities already present in the project.
 * Re-triggers the animation whenever `transitionKey` changes
 * by forcing React to remount via the `key` prop.
 *
 * @example
 * ```tsx
 * // In a layout route
 * const pathname = useRouterState({ select: (s) => s.location.pathname });
 *
 * <PageTransition transitionKey={pathname}>
 *   <Outlet />
 * </PageTransition>
 * ```
 */
export function PageTransition({
  children,
  transitionKey,
  variant = 'fade-up',
  className,
}: PageTransitionProps) {
  return (
    <div key={transitionKey} className={cn(VARIANT_CLASSES[variant], className)}>
      {children}
    </div>
  );
}
