import { HugeiconsIcon } from '@hugeicons/react';
import { useRouterState } from '@tanstack/react-router';
import { isNavActive, type NavItem, PRIMARY_NAV_ITEMS } from '@/shared/lib/navigation';
import { cn } from '@/shared/lib/utils';
import { NavLink } from './nav-link';

/**
 * Mobile bottom navigation bar.
 *
 * - Fixed at bottom with safe-area padding for notched devices
 * - Shows primary nav items (up to 4-5) with icon + label
 * - Hidden on desktop (md:hidden)
 * - Uses backdrop-blur for a modern glass effect
 */
export function MobileBottomBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around">
        {PRIMARY_NAV_ITEMS.map((item) => (
          <BottomBarTab key={item.href} item={item} active={isNavActive(pathname, item.href)} />
        ))}
      </div>
    </nav>
  );
}

function BottomBarTab({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <NavLink
      href={item.href}
      className={cn(
        'relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
        active ? 'text-primary' : 'text-muted-foreground',
      )}
    >
      <HugeiconsIcon icon={item.icon} size={20} className={cn(active && 'text-primary')} />
      <span>{item.label}</span>
    </NavLink>
  );
}
