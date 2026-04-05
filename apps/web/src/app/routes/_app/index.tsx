import { createFileRoute } from '@tanstack/react-router';
import { DASHBOARD, NAV } from '@/shared/lib/strings';

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
        <h1 className="text-2xl font-bold tracking-tight">{NAV.home}</h1>
        <p className="text-muted-foreground">{DASHBOARD.welcomeBack(session.user.name)}</p>
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
        <h2 className="text-lg font-semibold">{DASHBOARD.gettingStartedTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{DASHBOARD.gettingStartedDescription}</p>
      </div>
    </div>
  );
}

const PLACEHOLDER_CARDS = [
  { title: DASHBOARD.cards.balance, value: '$0' },
  { title: DASHBOARD.cards.income, value: '$0' },
  { title: DASHBOARD.cards.expenses, value: '$0' },
  { title: DASHBOARD.cards.savings, value: '$0' },
] as const;
