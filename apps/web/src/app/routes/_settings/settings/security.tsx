import { createFileRoute } from '@tanstack/react-router';
import { SETTINGS, SHELL } from '@/shared/lib/strings';

export const Route = createFileRoute('/_settings/settings/security')({
  component: SecurityPage,
});

/**
 * Security settings page — password, two-factor auth, sessions.
 */
function SecurityPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold">{SETTINGS.security.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{SETTINGS.security.description}</p>

      <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-12">
        <p className="text-sm font-medium text-muted-foreground">{SHELL.comingSoon}</p>
      </div>
    </div>
  );
}
