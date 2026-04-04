import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_settings/settings/data')({
  component: DataPrivacyPage,
});

/**
 * Data & privacy settings page — export, import, data deletion.
 */
function DataPrivacyPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold">Datos y privacidad</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Exporta, importa o elimina tus datos financieros.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-12">
        <p className="text-sm font-medium text-muted-foreground">Proximamente</p>
      </div>
    </div>
  );
}
