import type { MovimientoCreateInput } from '@rumbo/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { toast } from '@/shared/lib/toast';
import { deleteMovimientoMutationOptions, updateMovimientoMutationOptions } from '../api/mutations';
import { movimientosQueryOptions } from '../api/queries';
import { MOVIMIENTOS } from '../strings';
import {
  formatCurrency,
  getCurrentMonthValue,
  getMonthFromMovimiento,
  getMonthLabel,
  getMovimientoFormValues,
  mapMovimientosError,
} from '../utils';
import { MovimientoForm } from './movimiento-form';
import { MovimientosList } from './movimientos-list';

interface MovimientosPageProps {
  month: string;
  onMonthChange: (month: string) => void;
}

export function MovimientosPage({ month, onMonthChange }: MovimientosPageProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const movimientosQuery = useQuery(movimientosQueryOptions(month));
  const updateMovimientoMutation = useMutation(updateMovimientoMutationOptions());
  const deleteMovimientoMutation = useMutation(deleteMovimientoMutationOptions());

  const items = movimientosQuery.data?.items ?? [];
  const selectedMovimiento = items.find((item) => item.id === selectedId) ?? null;
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
      setSelectedId((current) => (current === id ? null : current));
      toast.success({ title: MOVIMIENTOS.feedback.deleteSuccess });
    } catch (error) {
      toast.error({ title: mapMovimientosError(error) });
    }
  }

  async function handleUpdate(values: MovimientoCreateInput) {
    if (!selectedMovimiento) {
      return;
    }

    try {
      const response = await updateMovimientoMutation.mutateAsync({
        id: selectedMovimiento.id,
        input: values,
      });
      const nextMonth = getMonthFromMovimiento(response.item);

      if (nextMonth !== month) {
        setSelectedId(null);
      }

      toast.success({ title: MOVIMIENTOS.feedback.updateSuccess });
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
              <p className="text-sm text-muted-foreground">
                {selectedMovimiento ? MOVIMIENTOS.summary.selectedHint : MOVIMIENTOS.listTitle}
              </p>
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
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
          <section className="overflow-hidden rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-1">
              <h2 className="text-lg font-semibold tracking-tight">{MOVIMIENTOS.listTitle}</h2>
              <p className="text-sm text-muted-foreground">{MOVIMIENTOS.listDescription}</p>
            </div>

            <MovimientosList
              items={items}
              selectedId={selectedId}
              onEdit={(item) => setSelectedId(item.id)}
              onDelete={(item) => void handleDelete(item.id)}
            />
          </section>

          <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm xl:sticky xl:top-4 xl:self-start">
            <div className="mb-5 flex flex-col gap-1">
              <h2 className="text-lg font-semibold tracking-tight">
                {selectedMovimiento ? MOVIMIENTOS.editTitle : MOVIMIENTOS.editorPlaceholderTitle}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedMovimiento
                  ? MOVIMIENTOS.editDescription
                  : MOVIMIENTOS.editorPlaceholderDescription}
              </p>
            </div>

            {selectedMovimiento ? (
              <MovimientoForm
                key={selectedMovimiento.id}
                mode="edit"
                initialValues={getMovimientoFormValues(selectedMovimiento)}
                onSubmit={handleUpdate}
                onCancel={() => setSelectedId(null)}
                submitLabel={MOVIMIENTOS.form.submitUpdate}
                isPending={updateMovimientoMutation.isPending}
              />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {MOVIMIENTOS.editorPlaceholderDescription}
              </p>
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}
