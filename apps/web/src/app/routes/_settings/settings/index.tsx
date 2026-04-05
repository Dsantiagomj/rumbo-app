import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { signOut } from '@/shared/lib/auth-client';
import { SETTINGS, SHELL, TOAST } from '@/shared/lib/strings';
import { toast } from '@/shared/lib/toast';

export const Route = createFileRoute('/_settings/settings/')({
  component: AccountSettingsPage,
});

/**
 * Account settings page — the default landing page for /settings.
 *
 * Mirrors Rumbo reference but with Spanish UI copy.
 * Includes user account info placeholder and log-out action.
 */
function AccountSettingsPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success({ title: TOAST.signOutSuccess });
      void navigate({ to: '/login' });
    } catch {
      toast.error({ title: TOAST.signOutError });
    }
  };

  return (
    <div>
      <h1 className="text-lg font-semibold">{SETTINGS.account.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{SETTINGS.account.description}</p>

      <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-12">
        <p className="text-sm font-medium text-muted-foreground">{SHELL.comingSoon}</p>
      </div>

      {/* Danger zone */}
      <div className="mt-12">
        <h2 className="text-sm font-medium text-destructive">{SETTINGS.dangerZone}</h2>
        <div className="mt-3 rounded-lg border border-destructive/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{SETTINGS.signOutLabel}</p>
              <p className="text-sm text-muted-foreground">{SETTINGS.signOutDescription}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
            >
              {SETTINGS.signOutLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
