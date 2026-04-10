import { Add01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link, useRouterState } from '@tanstack/react-router';
import { isNavActive, type NavItem, PRIMARY_NAV_ITEMS } from '@/shared/lib/navigation';
import { SHELL } from '@/shared/lib/strings';
import { cn } from '@/shared/lib/utils';
import { NavLink } from './nav-link';

/**
 * Mobile bottom navigation bar with a centered create-action CTA.
 *
 * Layout: 2 nav tabs + protruding CTA + 2 nav tabs
 *
 * - Fixed at bottom with safe-area padding for notched devices
 * - The centered CTA protrudes above the bar to be visually prominent
 * - Hidden on desktop (md:hidden)
 * - Primary nav items are split: first 2 left, last 2 right of the CTA
 */
export function MobileBottomBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const leftTabs = PRIMARY_NAV_ITEMS.slice(0, 2);
  const rightTabs = PRIMARY_NAV_ITEMS.slice(2, 4);

  return (
    <nav
      aria-label={SHELL.navMain}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background shadow-[0_-1px_3px_0_rgb(0_0_0/0.05)] md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="relative flex items-end justify-around">
        {/* Left tabs: Inicio, Transacciones */}
        {leftTabs.map((item) => (
          <BottomBarTab key={item.href} item={item} active={isNavActive(pathname, item.href)} />
        ))}

        {/* Centered protruding CTA: Agregar movimiento */}
        <CenterCreateAction />

        {/* Right tabs: Presupuestos, Reportes */}
        {rightTabs.map((item) => (
          <BottomBarTab key={item.href} item={item} active={isNavActive(pathname, item.href)} />
        ))}
      </div>
    </nav>
  );
}

/**
 * Centered create-action button that protrudes above the bottom bar.
 *
 * Uses a negative top offset (`-translate-y-3`) so the button breaks out
 * of the bar surface while remaining structurally part of it.
 * The bg-primary circle matches the app's primary CTA color for consistency
 * with the desktop "Agregar movimiento" button.
 */
function CenterCreateAction() {
  return (
    <div className="-translate-y-3 px-2">
      <Link
        to="/transactions/new"
        className="flex flex-col items-center gap-0.5"
        aria-label={SHELL.addTransaction}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-95">
          <HugeiconsIcon icon={Add01Icon} size={24} />
        </span>
        <span className="text-[10px] font-medium text-muted-foreground">{SHELL.add}</span>
      </Link>
    </div>
  );
}

function BottomBarTab({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <NavLink
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors active:opacity-60',
        active ? 'text-primary' : 'text-muted-foreground',
      )}
    >
      <div
        className={cn(
          'flex h-7 w-14 items-center justify-center rounded-full transition-colors',
          active && 'bg-primary/10',
        )}
      >
        <HugeiconsIcon icon={item.icon} size={20} className={cn(active && 'text-primary')} />
      </div>
      <span>{item.label}</span>
    </NavLink>
  );
}
