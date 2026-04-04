import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { signOut } from '@/shared/lib/auth-client';

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
    await signOut();
    void navigate({ to: '/login' });
  };

  return (
    <div>
      <h1 className="text-lg font-semibold">Cuenta</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Administra los detalles de tu cuenta y tu perfil.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-12">
        <p className="text-sm font-medium text-muted-foreground">Proximamente</p>
      </div>

      {/* Danger zone */}
      <div className="mt-12">
        <h2 className="text-sm font-medium text-destructive">Zona de riesgo</h2>
        <div className="mt-3 rounded-lg border border-destructive/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Cerrar sesion</p>
              <p className="text-sm text-muted-foreground">Cierra tu sesion en este dispositivo.</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
            >
              Cerrar sesion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
