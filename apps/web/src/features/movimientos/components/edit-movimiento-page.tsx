import type { MovimientoCreateInput } from '@rumbo/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/shared/components/ui/button';
import { toast } from '@/shared/lib/toast';
import { deleteMovimientoMutationOptions, updateMovimientoMutationOptions } from '../api/mutations';
import { movimientoQueryOptions } from '../api/queries';
import { MOVIMIENTOS } from '../strings';
import { getMonthFromMovimiento, getMovimientoFormValues, mapMovimientosError } from '../utils';
import { MovimientoForm } from './movimiento-form';

interface EditMovimientoPageProps {
  id: string;
}

export function EditMovimientoPage({ id }: EditMovimientoPageProps) {
  const navigate = useNavigate();
  const movimientoQuery = useQuery(movimientoQueryOptions(id));
  const updateMovimientoMutation = useMutation(updateMovimientoMutationOptions());
  const deleteMovimientoMutation = useMutation(deleteMovimientoMutationOptions());

  const item = movimientoQuery.data?.item ?? null;

  async function handleUpdate(values: MovimientoCreateInput) {
    if (!item) {
      return;
    }

    try {
      const response = await updateMovimientoMutation.mutateAsync({ id: item.id, input: values });

      toast.success({ title: MOVIMIENTOS.feedback.updateSuccess });
      void navigate({
        to: '/transactions',
        search: { month: getMonthFromMovimiento(response.item) },
      });
    } catch (error) {
      toast.error({ title: mapMovimientosError(error) });
    }
  }

  async function handleDelete() {
    if (!item) {
      return;
    }

    const confirmed = window.confirm(MOVIMIENTOS.feedback.deleteConfirm);

    if (!confirmed) {
      return;
    }

    try {
      await deleteMovimientoMutation.mutateAsync(item.id);
      toast.success({ title: MOVIMIENTOS.feedback.deleteSuccess });
      void navigate({ to: '/transactions' });
    } catch (error) {
      toast.error({ title: mapMovimientosError(error) });
    }
  }

  if (movimientoQuery.isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <section className="rounded-3xl border border-border/60 bg-card px-5 py-8 text-sm text-muted-foreground shadow-sm">
          {MOVIMIENTOS.feedback.loading}
        </section>
      </div>
    );
  }

  if (movimientoQuery.isError || !item) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <section className="rounded-3xl border border-destructive/30 bg-destructive/5 px-5 py-8 text-sm text-destructive shadow-sm">
          {mapMovimientosError(movimientoQuery.error)}
        </section>
        <Button variant="outline" asChild className="self-start">
          <Link to="/transactions">{MOVIMIENTOS.actions.backToList}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{MOVIMIENTOS.editTitle}</h1>
          <p className="text-muted-foreground">{MOVIMIENTOS.editDescription}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMovimientoMutation.isPending}
          >
            {MOVIMIENTOS.actions.delete}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/transactions">{MOVIMIENTOS.actions.backToList}</Link>
          </Button>
        </div>
      </div>

      <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
        <MovimientoForm
          key={item.id}
          mode="edit"
          initialValues={getMovimientoFormValues(item)}
          onSubmit={handleUpdate}
          submitLabel={MOVIMIENTOS.form.submitUpdate}
          isPending={updateMovimientoMutation.isPending}
        />
      </section>
    </div>
  );
}
