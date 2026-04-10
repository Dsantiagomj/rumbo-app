import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from '@/shared/lib/toast';
import { deleteMovimientoMutationOptions } from '../api/mutations';
import { availableMonthsQueryOptions, movimientosQueryOptions } from '../api/queries';
import { MOVIMIENTOS } from '../strings';
import { mapMovimientosError } from '../utils';
import { MovimientosList } from './movimientos-list';
import { PeriodNav } from './period-nav';

interface MovimientosPageProps {
  month: string | undefined;
  query: string;
  onMonthChange: (month: string | undefined) => void;
}

export function MovimientosPage({ month, query, onMonthChange }: MovimientosPageProps) {
  const movimientosQuery = useQuery(movimientosQueryOptions(month));
  const monthsQuery = useQuery(availableMonthsQueryOptions());
  const deleteMovimientoMutation = useMutation(deleteMovimientoMutationOptions());

  const items = movimientosQuery.data?.items ?? [];
  const availableMonths = monthsQuery.data?.months ?? [];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = useMemo(() => {
    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => buildMovimientoSearchText(item).includes(normalizedQuery));
  }, [items, normalizedQuery]);
  const balance = filteredItems.reduce(
    (sum, item) => sum + (item.type === 'income' ? item.amount : item.amount * -1),
    0,
  );

  async function handleDelete(id: string) {
    const confirmed = window.confirm(MOVIMIENTOS.feedback.deleteConfirm);

    if (!confirmed) {
      return;
    }

    try {
      await deleteMovimientoMutation.mutateAsync(id);
      toast.success({ title: MOVIMIENTOS.feedback.deleteSuccess });
    } catch (error) {
      toast.error({ title: mapMovimientosError(error) });
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

      {movimientosQuery.isLoading ? (
        <p className="px-1 py-8 text-sm text-muted-foreground">{MOVIMIENTOS.feedback.loading}</p>
      ) : null}

      {movimientosQuery.isError ? (
        <section className="rounded-3xl border border-destructive/30 bg-destructive/5 px-5 py-8 text-sm text-destructive shadow-sm">
          {mapMovimientosError(movimientosQuery.error)}
        </section>
      ) : null}

      {!movimientosQuery.isLoading && !movimientosQuery.isError ? (
        <MovimientosList
          items={filteredItems}
          searchQuery={normalizedQuery}
          onDelete={(item) => void handleDelete(item.id)}
        />
      ) : null}
    </div>
  );
}

function buildMovimientoSearchText(item: {
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
