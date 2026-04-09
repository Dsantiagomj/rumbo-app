import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/components/ui/button';
import { toast } from '@/shared/lib/toast';
import { deleteMovimientoMutationOptions } from '../api/mutations';
import { movimientosQueryOptions } from '../api/queries';
import { MOVIMIENTOS } from '../strings';
import { formatCurrency, getCurrentMonthValue, getMonthLabel, mapMovimientosError } from '../utils';
import { MovimientosList } from './movimientos-list';

interface MovimientosPageProps {
  month: string;
  onMonthChange: (month: string) => void;
}

export function MovimientosPage({ month, onMonthChange }: MovimientosPageProps) {
  const movimientosQuery = useQuery(movimientosQueryOptions(month));
  const deleteMovimientoMutation = useMutation(deleteMovimientoMutationOptions());

  const items = movimientosQuery.data?.items ?? [];
  const total = items.reduce(
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{MOVIMIENTOS.pageTitle}</h1>
          <p className="text-muted-foreground">{MOVIMIENTOS.pageDescription}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-2 text-sm font-medium sm:min-w-[172px]">
            <span>{MOVIMIENTOS.monthLabel}</span>
            <input
              type="month"
              value={month}
              max={getCurrentMonthValue()}
              onChange={(event) => onMonthChange(event.target.value)}
              className="h-10 rounded-2xl border border-transparent bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </label>

          <Button asChild className="h-10 rounded-full px-4 sm:self-end">
            <Link to="/transactions/new">{MOVIMIENTOS.createAction}</Link>
          </Button>
        </div>
      </div>

      <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{MOVIMIENTOS.summaryTitle}</p>
            <h2 className="text-xl font-semibold tracking-tight">{getMonthLabel(month)}</h2>
            <p className="text-sm text-muted-foreground">{MOVIMIENTOS.summaryDescription}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
            <div className="rounded-xl bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">{MOVIMIENTOS.summary.netBalance}</p>
              <p className="mt-1 text-2xl font-semibold">{formatCurrency(total)}</p>
            </div>

            <div className="rounded-xl bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">{MOVIMIENTOS.listTitle}</p>
              <p className="mt-1 text-2xl font-semibold">
                {MOVIMIENTOS.summary.totalMovimientos(items.length)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {movimientosQuery.isLoading ? (
        <section className="rounded-3xl border border-border/60 bg-card px-5 py-8 text-sm text-muted-foreground shadow-sm">
          {MOVIMIENTOS.feedback.loading}
        </section>
      ) : null}

      {movimientosQuery.isError ? (
        <section className="rounded-3xl border border-destructive/30 bg-destructive/5 px-5 py-8 text-sm text-destructive shadow-sm">
          {mapMovimientosError(movimientosQuery.error)}
        </section>
      ) : null}

      {!movimientosQuery.isLoading && !movimientosQuery.isError ? (
        <MovimientosList items={items} onDelete={(item) => void handleDelete(item.id)} />
      ) : null}
    </div>
  );
}
