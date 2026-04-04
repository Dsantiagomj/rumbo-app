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
  { label: 'Inicio', icon: Home01Icon, href: '/' },
  { label: 'Transacciones', icon: Wallet01Icon, href: '/transactions' },
  { label: 'Presupuestos', icon: Target01Icon, href: '/budgets' },
  { label: 'Reportes', icon: ChartBarIncreasingIcon, href: '/reports' },
];

/**
 * Settings section navigation items.
 *
 * Shared across the settings layout (desktop sidebar + mobile pills)
 * and the mobile drawer (which surfaces these sections directly).
 */
export const SETTINGS_NAV_ITEMS: NavItem[] = [
  { label: 'Cuenta', icon: UserIcon, href: '/settings' },
  { label: 'Preferencias', icon: PaintBrushIcon, href: '/settings/preferences' },
  { label: 'Seguridad', icon: LockPasswordIcon, href: '/settings/security' },
  { label: 'Notificaciones', icon: Notification01Icon, href: '/settings/notifications' },
  { label: 'Datos y privacidad', icon: Database01Icon, href: '/settings/data' },
];
