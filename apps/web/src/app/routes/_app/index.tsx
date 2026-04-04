import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/')({
  component: DashboardPage,
});

/**
 * Dashboard page — the default landing page for authenticated users.
 *
 * The shell shows the centered search slot on routes that opt in.
 */
function DashboardPage() {
  const { session } = Route.useRouteContext();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inicio</h1>
        <p className="text-muted-foreground">Bienvenido de vuelta, {session.user.name}</p>
      </div>

      {/* Placeholder cards — will be replaced with real dashboard widgets */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLACEHOLDER_CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{card.title}</p>
            <p className="mt-1 text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <h2 className="text-lg font-semibold">Primeros pasos</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tu panel financiero se esta configurando. Empieza agregando tu primera transaccion.
        </p>
      </div>
    </div>
  );
}

const PLACEHOLDER_CARDS = [
  { title: 'Balance', value: '$0' },
  { title: 'Ingresos', value: '$0' },
  { title: 'Gastos', value: '$0' },
  { title: 'Ahorros', value: '$0' },
] as const;
