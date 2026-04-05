import { Cancel01Icon, Logout01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { useSidebarState } from '@/shared/hooks/use-sidebar-state';
import { signOut } from '@/shared/lib/auth-client';
import { isNavActive, SETTINGS_NAV_ITEMS } from '@/shared/lib/navigation';
import { SHELL, TOAST } from '@/shared/lib/strings';
import { toast } from '@/shared/lib/toast';
import { cn } from '@/shared/lib/utils';
import { NavLink } from './nav-link';

interface MobileDrawerProps {
  userName: string;
  userEmail: string;
}

/**
 * Mobile left-slide drawer — account & settings hub.
 *
 * Shows user profile, settings section links (mirroring the settings view
 * sidebar), and sign-out. Primary app nav lives in the bottom bar, not here.
 *
 * Uses the shared `SETTINGS_NAV_ITEMS` so the drawer and the settings
 * layout always stay in sync.
 *
 * Triggered by the hamburger button in the mobile header.
 */
export function MobileDrawer({ userName, userEmail }: MobileDrawerProps) {
  const { mobileDrawerOpen, setMobileDrawerOpen } = useSidebarState();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="data-[side=left]:w-[min(18rem,85vw)] p-0"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <SheetHeader className="border-b border-border/60 px-4 py-3">
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg font-bold">
              <img src="/favicon.svg" alt="" className="size-6" />
              {SHELL.brandName}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setMobileDrawerOpen(false)}
              aria-label={SHELL.closeMenu}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </Button>
          </SheetTitle>
          <SheetDescription className="sr-only">{SHELL.drawerDescription}</SheetDescription>
        </SheetHeader>

        {/* User profile card */}
        <div className="flex items-center gap-3 px-4 py-4">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">{userName}</span>
            <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
          </div>
        </div>

        <Separator />

        {/* Settings section nav — mirrors the settings layout sidebar */}
        <nav aria-label={SHELL.navDrawer} className="flex flex-col gap-1 p-3">
          {SETTINGS_NAV_ITEMS.map((item) => {
            const active = isNavActive(pathname, item.href);

            return (
              <NavLink
                key={item.href}
                href={item.href}
                onClick={() => setMobileDrawerOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors active:opacity-60',
                  active
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50',
                )}
              >
                <HugeiconsIcon icon={item.icon} size={20} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="mt-auto border-t border-border/60 p-3">
          <button
            type="button"
            onClick={async () => {
              try {
                await signOut();
                toast.success({ title: TOAST.signOutSuccess });
                void navigate({ to: '/login' });
              } catch {
                toast.error({ title: TOAST.signOutError });
              }
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 active:opacity-60"
          >
            <HugeiconsIcon icon={Logout01Icon} size={20} />
            {SHELL.signOut}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
