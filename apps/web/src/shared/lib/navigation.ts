import {
  ChartBarIncreasingIcon,
  Database01Icon,
  Home01Icon,
  LockPasswordIcon,
  Notification01Icon,
  PaintBrushIcon,
  Target01Icon,
  UserIcon,
  Wallet01Icon,
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';
import { NAV } from '@/shared/lib/strings';

export interface NavItem {
  label: string;
  icon: IconSvgElement;
  href: string;
}

export function isNavActive(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Primary navigation items shown in the sidebar and mobile bottom bar.
 * Order matters — mobile bottom bar shows only `PRIMARY_NAV_ITEMS`.
 *
 * Settings/Configuración is NOT here — it lives in the sidebar footer
 * and in the mobile drawer.
 */
export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { label: NAV.home, icon: Home01Icon, href: '/' },
  { label: NAV.transactions, icon: Wallet01Icon, href: '/transactions' },
  { label: NAV.budgets, icon: Target01Icon, href: '/budgets' },
  { label: NAV.reports, icon: ChartBarIncreasingIcon, href: '/reports' },
];

/**
 * Settings section navigation items.
 *
 * Shared across the settings layout (desktop sidebar + mobile pills)
 * and the mobile drawer (which surfaces these sections directly).
 */
export const SETTINGS_NAV_ITEMS: NavItem[] = [
  { label: NAV.account, icon: UserIcon, href: '/settings' },
  { label: NAV.preferences, icon: PaintBrushIcon, href: '/settings/preferences' },
  { label: NAV.security, icon: LockPasswordIcon, href: '/settings/security' },
  { label: NAV.notifications, icon: Notification01Icon, href: '/settings/notifications' },
  { label: NAV.dataPrivacy, icon: Database01Icon, href: '/settings/data' },
];

/**
 * Resolve a pathname to a page title for breadcrumb display.
 *
 * Derives titles from the NAV registry so navigation labels and breadcrumbs
 * are always in sync — no duplicate string maps.
 */
export function getPageTitle(pathname: string): string {
  const segments: Record<string, string> = {
    '/': NAV.home,
    '/transactions': NAV.transactions,
    '/budgets': NAV.budgets,
    '/reports': NAV.reports,
    '/settings': NAV.settings,
  };

  if (segments[pathname]) {
    return segments[pathname];
  }

  for (const [path, title] of Object.entries(segments)) {
    if (path !== '/' && pathname.startsWith(`${path}/`)) {
      return title;
    }
  }

  return NAV.home;
}
