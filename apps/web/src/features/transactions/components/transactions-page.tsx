import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from '@/shared/lib/toast';
import { deleteTransactionMutationOptions } from '../api/mutations';
import { availableMonthsQueryOptions, transactionsQueryOptions } from '../api/queries';
import { TRANSACTIONS } from '../strings';
import { mapTransactionsError } from '../utils';
import { PeriodNav } from './period-nav';
import { TransactionsList } from './transactions-list';

interface TransactionsPageProps {
  month: string | undefined;
  query: string;
  onMonthChange: (month: string | undefined) => void;
}

export function TransactionsPage({ month, query, onMonthChange }: TransactionsPageProps) {
  const transactionsQuery = useQuery(transactionsQueryOptions(month));
  const monthsQuery = useQuery(availableMonthsQueryOptions());
  const deleteTransactionMutation = useMutation(deleteTransactionMutationOptions());

  const items = transactionsQuery.data?.items ?? [];
  const availableMonths = monthsQuery.data?.months ?? [];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = useMemo(() => {
    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => buildTransactionSearchText(item).includes(normalizedQuery));
  }, [items, normalizedQuery]);
  const balance = filteredItems.reduce(
    (sum, item) => sum + (item.type === 'income' ? item.amount : item.amount * -1),
    0,
  );

  async function handleDelete(id: string) {
    const confirmed = window.confirm(TRANSACTIONS.feedback.deleteConfirm);

    if (!confirmed) {
      return;
    }

    try {
      await deleteTransactionMutation.mutateAsync(id);
      toast.success({ title: TRANSACTIONS.feedback.deleteSuccess });
    } catch (error) {
      toast.error({ title: mapTransactionsError(error) });
    }
  }

  return (
    <div className="space-y-8 md:space-y-6">
      <PeriodNav
        month={month}
        availableMonths={availableMonths}
        balance={balance}
        count={filteredItems.length}
        onMonthChange={onMonthChange}
      />

      {transactionsQuery.isLoading ? (
        <p className="px-1 py-8 text-sm text-muted-foreground">{TRANSACTIONS.feedback.loading}</p>
      ) : null}

      {transactionsQuery.isError ? (
        <section className="rounded-3xl border border-destructive/30 bg-destructive/5 px-5 py-8 text-sm text-destructive shadow-sm">
          {mapTransactionsError(transactionsQuery.error)}
        </section>
      ) : null}

      {!transactionsQuery.isLoading && !transactionsQuery.isError ? (
        <TransactionsList
          items={filteredItems}
          searchQuery={normalizedQuery}
          onDelete={(item) => void handleDelete(item.id)}
        />
      ) : null}
    </div>
  );
}

function buildTransactionSearchText(item: {
  type: 'income' | 'expense';
  category: string;
  note: string | null;
  amount: number;
}) {
  const typeLabel = item.type === 'income' ? 'income ingreso' : 'expense gasto';
  const rawAmount = String(item.amount);
  const compactAmount = rawAmount.replace(/\D/g, '');
  const localeAmount = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(item.amount);

  return [typeLabel, item.category, item.note ?? '', rawAmount, compactAmount, localeAmount]
    .join(' ')
    .toLowerCase();
}
