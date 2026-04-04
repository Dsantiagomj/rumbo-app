import { useRouterState } from '@tanstack/react-router';
import { type ComponentPropsWithoutRef, forwardRef, type MouseEvent } from 'react';
import { cn } from '@/shared/lib/utils';

interface NavLinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
  href: string;
}

/**
 * Client-side navigation link that bypasses TanStack Router's
 * compile-time route type checking.
 *
 * Use this for shell navigation where target routes may not
 * exist yet. Once all routes are registered, individual links
 * can be migrated to typed `<Link>` if desired.
 */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { href, children, className, onClick, ...props },
  ref,
) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    onClick?.(e);

    if (e.defaultPrevented || pathname === href) {
      return;
    }

    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  return (
    <a ref={ref} href={href} onClick={handleClick} className={cn(className)} {...props}>
      {children}
    </a>
  );
});
