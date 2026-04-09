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
  const month = search.month ?? getCurrentMonthValue();

  return (
    <MovimientosPage
      month={month}
      onMonthChange={(nextMonth) => {
        void navigate({
          to: '/transactions',
          search: nextMonth === getCurrentMonthValue() ? {} : { month: nextMonth },
        });
      }}
    />
  );
}
