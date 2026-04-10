import { transactionListQuerySchema } from '@rumbo/shared';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { TransactionsPage } from '@/features/transactions/components/transactions-page';
import { getCurrentMonthValue } from '@/features/transactions/utils';

export const Route = createFileRoute('/_app/transactions/')({
  validateSearch: transactionListQuerySchema,
  component: TransactionsIndexPage,
});

function TransactionsIndexPage() {
  const navigate = useNavigate({ from: '/transactions' });
  const search = Route.useSearch();
  const month = search.month === 'all' ? undefined : (search.month ?? getCurrentMonthValue());

  return (
    <TransactionsPage
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
