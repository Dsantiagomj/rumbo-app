import { movimientoListQuerySchema } from '@rumbo/shared';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { MovimientosPage } from '@/features/movimientos/components/movimientos-page';
import { getCurrentMonthValue } from '@/features/movimientos/utils';

export const Route = createFileRoute('/_app/transactions/')({
  validateSearch: movimientoListQuerySchema,
  component: TransactionsIndexPage,
});

function TransactionsIndexPage() {
  const navigate = useNavigate({ from: '/transactions' });
  const search = Route.useSearch();
  const month = search.month === 'all' ? undefined : (search.month ?? getCurrentMonthValue());

  return (
    <MovimientosPage
      month={month}
      query={search.q?.trim() ?? ''}
      onMonthChange={(nextMonth) => {
        void navigate({
          to: '/transactions',
          search: {
            month: nextMonth ? nextMonth : 'all',
            q: search.q,
          },
        });
      }}
    />
  );
}
