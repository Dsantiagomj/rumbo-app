import { Cancel01Icon, Logout01Icon, Settings01Icon, UserIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useNavigate } from '@tanstack/react-router';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet';
import { useSidebarState } from '@/shared/hooks/use-sidebar-state';
import { signOut } from '@/shared/lib/auth-client';
import { NavLink } from './nav-link';

interface MobileDrawerProps {
  userName: string;
  userEmail: string;
}

/**
 * Mobile left-slide drawer for secondary navigation and account actions.
 *
 * Shows user profile, account/settings links, and sign-out.
 * Primary nav lives in the bottom bar, not here.
 *
 * Mirrors the desktop sidebar footer's Configuración submenu options:
 * Cuenta, Configuración, and Cerrar sesión.
 *
 * Triggered by the avatar button in the mobile header.
 */
export function MobileDrawer({ userName, userEmail }: MobileDrawerProps) {
  const { mobileDrawerOpen, setMobileDrawerOpen } = useSidebarState();
  const navigate = useNavigate();

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
      <SheetContent side="left" showCloseButton={false} className="w-72 p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg font-bold">
              <img src="/favicon.svg" alt="" className="size-6" />
              Rumbo
            </span>
            <Button variant="ghost" size="icon-sm" onClick={() => setMobileDrawerOpen(false)}>
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </Button>
          </SheetTitle>
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

        {/* Account & settings nav */}
        <nav className="flex flex-col gap-1 p-3">
          {/* Cuenta */}
          <NavLink
            href="/settings"
            onClick={() => setMobileDrawerOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50"
          >
            <HugeiconsIcon icon={UserIcon} size={20} />
            Cuenta
          </NavLink>

          {/* Configuración — dedicated settings view */}
          <NavLink
            href="/settings"
            onClick={() => setMobileDrawerOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50"
          >
            <HugeiconsIcon icon={Settings01Icon} size={20} />
            Configuracion
          </NavLink>
        </nav>

        {/* Sign out */}
        <div className="mt-auto border-t p-3">
          <button
            type="button"
            onClick={async () => {
              await signOut();
              void navigate({ to: '/login' });
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50"
          >
            <HugeiconsIcon icon={Logout01Icon} size={20} />
            Cerrar sesion
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
