import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_settings/settings/notifications')({
  component: NotificationsPage,
});

/**
 * Notification settings page — email alerts, push notifications, reminders.
 */
function NotificationsPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold">Notificaciones</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Configura tus alertas, recordatorios y notificaciones.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-12">
        <p className="text-sm font-medium text-muted-foreground">Proximamente</p>
      </div>
    </div>
  );
}
