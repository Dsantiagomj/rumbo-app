import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { SETTINGS_NAV_ITEMS } from '@/shared/lib/navigation';
import { cn } from '@/shared/lib/utils';
import { NavLink } from './nav-link';

/**
 * Settings layout — adapted from the Rumbo reference project.
 *
 * Desktop: bg-muted wrapper with a settings sidebar (w-56) on the left
 *          and a rounded content panel on the right (same geometry as the app shell).
 * Mobile:  A top header with back arrow + horizontal pill nav for sections.
 */
export function SettingsLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted">
      {/* ─── Desktop settings sidebar ─── */}
      <aside className="hidden w-56 shrink-0 flex-col md:flex">
        {/* Back to app */}
        <div className="flex h-14 items-center px-3.5">
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => {
              void navigate({ to: '/' });
            }}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            Volver a la app
          </button>
        </div>

        {/* Settings navigation */}
        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {SETTINGS_NAV_ITEMS.map((item) => {
            const isActive = isSettingsNavActive(pathname, item.href);

            return (
              <NavLink
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                )}
              >
                <HugeiconsIcon icon={item.icon} size={20} className="shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* ─── Content panel ─── */}
      <div className="flex flex-1 flex-col overflow-hidden bg-background md:rounded-l-2xl md:shadow-sm">
        {/* Mobile header */}
        <header className="flex h-14 items-center gap-3 border-b border-border px-4 md:hidden">
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => {
              void navigate({ to: '/' });
            }}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          </button>
          <span className="text-base font-semibold">Configuracion</span>
        </header>

        {/* Mobile settings nav — horizontal pills */}
        <nav className="flex gap-1 overflow-x-auto border-b border-border/40 px-4 py-2 md:hidden">
          {SETTINGS_NAV_ITEMS.map((item) => {
            const isActive = isSettingsNavActive(pathname, item.href);

            return (
              <NavLink
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                <HugeiconsIcon icon={item.icon} size={14} className="shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Settings content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-2xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

function isSettingsNavActive(pathname: string, path: string): boolean {
  if (path === '/settings') {
    return pathname === '/settings';
  }
  return pathname.startsWith(path);
}
