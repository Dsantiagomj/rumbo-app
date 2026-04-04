import { Add01Icon, SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouterState } from '@tanstack/react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/shared/components/ui/breadcrumb';
import { Button } from '@/shared/components/ui/button';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { useShell } from '@/shared/hooks/use-shell-context';
import { useSidebarState } from '@/shared/hooks/use-sidebar-state';
import { NavLink } from './nav-link';

interface SiteHeaderProps {
  userName: string;
}

/**
 * Top header bar for the authenticated shell.
 *
 * Desktop layout (left → center → right):
 *   - Left:   SidebarTrigger + Breadcrumb
 *   - Center: Optional search slot (visible per-page via ShellContext)
 *   - Right:  "Agregar movimiento" CTA (shortcut in tooltip) + AI Assistant toggle
 *
 * Mobile layout:
 *   - Left:   Avatar button (opens drawer)
 *   - Center: Brand mark
 *   - Right:  Add Transaction icon + AI Assistant icon
 *
 * Follows the Rumbo reference project's DesktopHeader exactly.
 */
export function SiteHeader({ userName }: SiteHeaderProps) {
  const { setMobileDrawerOpen } = useSidebarState();
  const { assistantOpen, modKey, toggleAssistant, setMobileAssistantOpen } = useShell();

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const pageTitle = getPageTitle(pathname);
  const searchSlotVisible = shouldShowSearchSlot(pathname);

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4 md:h-12 md:border-border/40">
      {/* ─── DESKTOP ─── */}
      <div className="hidden w-full items-center gap-3 md:flex">
        {/* Left: sidebar trigger + breadcrumb */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-semibold">{pageTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Center: search slot — fills remaining space, content is centered */}
        <div className="flex flex-1 items-center justify-center">
          {searchSlotVisible && <SearchSlotPlaceholder modKey={modKey} />}
        </div>

        {/* Right: quick actions + AI assistant */}
        <div className="flex items-center gap-2">
          {/* Add Transaction CTA — contained/solid, strongest visual action */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="default" size="sm" asChild>
                <NavLink href="/transactions/new">
                  <HugeiconsIcon icon={Add01Icon} size={14} data-icon="inline-start" />
                  Agregar movimiento
                </NavLink>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <span className="flex items-center gap-2">
                Nuevo movimiento
                <kbd className="rounded bg-background/20 px-1.5 py-0.5 font-mono text-[10px]">
                  {modKey}N
                </kbd>
              </span>
            </TooltipContent>
          </Tooltip>

          {/* AI Assistant toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={toggleAssistant}
                className={`cursor-pointer flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                  assistantOpen
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
                aria-label={assistantOpen ? 'Cerrar asistente' : 'Abrir asistente'}
              >
                <HugeiconsIcon icon={SparklesIcon} size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <span className="flex items-center gap-2">
                Asistente IA
                <kbd className="rounded bg-background/20 px-1.5 py-0.5 font-mono text-[10px]">
                  {modKey}I
                </kbd>
              </span>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* ─── MOBILE ─── */}
      <div className="flex w-full items-center md:hidden">
        {/* Left: avatar opens drawer */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground"
        >
          {initials}
        </button>

        {/* Center: brand mark */}
        <div className="flex flex-1 items-center justify-center gap-2">
          <img src="/favicon.svg" alt="Rumbo" className="h-7 w-7 rounded-md" />
          <span className="text-base font-bold">Rumbo</span>
        </div>

        {/* Right: compact action buttons */}
        <div className="flex items-center gap-1">
          <NavLink
            href="/transactions/new"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <HugeiconsIcon icon={Add01Icon} size={20} />
            <span className="sr-only">Nuevo movimiento</span>
          </NavLink>

          <button
            type="button"
            onClick={() => setMobileAssistantOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <HugeiconsIcon icon={SparklesIcon} size={20} />
            <span className="sr-only">Asistente IA</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Search slot placeholder
// ---------------------------------------------------------------------------

/**
 * Placeholder for the centered search area.
 *
 * This renders a non-functional preview so the layout slot is proven.
 * Visibility is derived from the current route.
 * A future iteration will replace this with a real search input/command-k.
 *
 * Includes a keyboard shortcut affordance (⌘K / Ctrl+K) aligned right.
 */
function SearchSlotPlaceholder({ modKey }: { modKey: string }) {
  return (
    <div className="flex h-8 w-full max-w-xl items-center gap-2 rounded-lg border border-border/60 bg-muted/50 px-3 text-xs text-muted-foreground">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="h-3.5 w-3.5 shrink-0 opacity-60"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clipRule="evenodd"
        />
      </svg>
      <span className="flex-1">Buscar...</span>
      <kbd className="pointer-events-none shrink-0 rounded border border-border/80 bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/70">
        {modKey}K
      </kbd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page title resolver
// ---------------------------------------------------------------------------

/** Map pathname to a page title for breadcrumb display. */
function getPageTitle(pathname: string): string {
  const segments: Record<string, string> = {
    '/': 'Inicio',
    '/transactions': 'Transacciones',
    '/budgets': 'Presupuestos',
    '/reports': 'Reportes',
    '/settings': 'Configuracion',
  };

  if (segments[pathname]) {
    return segments[pathname];
  }

  for (const [path, title] of Object.entries(segments)) {
    if (path !== '/' && pathname.startsWith(`${path}/`)) {
      return title;
    }
  }

  return 'Inicio';
}

function shouldShowSearchSlot(pathname: string): boolean {
  return pathname === '/' || pathname.startsWith('/transactions');
}
