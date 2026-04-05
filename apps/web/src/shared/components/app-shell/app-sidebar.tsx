import { Settings01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar';
import { isNavActive, PRIMARY_NAV_ITEMS } from '@/shared/lib/navigation';
import { NAV, SHELL } from '@/shared/lib/strings';
import { NavLink } from './nav-link';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}

/**
 * Desktop sidebar built on top of shadcn Sidebar for state management.
 * Uses variant="sidebar" with collapsible="icon" to produce a flush
 * sidebar matching Rumbo's geometry: bg-muted, no padding/gaps, w-56 / w-14.
 *
 * - Hidden on mobile (md:block) — we use a custom bottom bar instead
 * - On desktop: plain sidebar with icon-only collapse via Cmd+B
 * - Footer: direct Configuración entry that opens the dedicated settings view
 */
export function AppSidebar(props: AppSidebarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      {/* Brand header — uses the exact favicon mark from /favicon.svg */}
      <SidebarHeader className="p-0">
        <div className="flex h-14 items-center gap-2 px-3.5">
          <img src="/favicon.svg" alt="Rumbo" className="h-7 w-7 shrink-0 rounded-md" />
          <span className="flex-1 text-base font-bold text-foreground whitespace-nowrap truncate group-data-[collapsible=icon]:hidden">
            {SHELL.brandName}
          </span>
        </div>
      </SidebarHeader>

      {/* Main navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {PRIMARY_NAV_ITEMS.map((item) => {
                const active = isNavActive(pathname, item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                      <NavLink href={item.href} aria-current={active ? 'page' : undefined}>
                        <HugeiconsIcon icon={item.icon} />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: direct access to the settings view */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isNavActive(pathname, '/settings')}
              tooltip={NAV.settings}
              aria-current={isNavActive(pathname, '/settings') ? 'page' : undefined}
              onClick={() => {
                if (!isNavActive(pathname, '/settings')) {
                  void navigate({ to: '/settings' });
                }
              }}
            >
              <HugeiconsIcon icon={Settings01Icon} />
              <span>{NAV.settings}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
