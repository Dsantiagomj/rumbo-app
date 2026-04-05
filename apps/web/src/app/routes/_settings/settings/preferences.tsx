import { createFileRoute } from '@tanstack/react-router';
import { SETTINGS, SHELL } from '@/shared/lib/strings';

export const Route = createFileRoute('/_settings/settings/preferences')({
  component: PreferencesPage,
});

/**
 * Preferences settings page — appearance, language, currency, etc.
 */
function PreferencesPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold">{SETTINGS.preferences.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{SETTINGS.preferences.description}</p>

      <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-12">
        <p className="text-sm font-medium text-muted-foreground">{SHELL.comingSoon}</p>
      </div>
    </div>
  );
}
