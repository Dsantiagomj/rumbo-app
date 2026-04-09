import type { MovimientoCreateInput } from '@rumbo/shared';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/shared/components/ui/button';
import { toast } from '@/shared/lib/toast';
import { createMovimientoMutationOptions } from '../api/mutations';
import { MOVIMIENTOS } from '../strings';
import { getDefaultMovimientoValues, getMonthFromMovimiento, mapMovimientosError } from '../utils';
import { MovimientoForm } from './movimiento-form';

export function NewMovimientoPage() {
  const navigate = useNavigate();
  const createMovimientoMutation = useMutation(createMovimientoMutationOptions());

  async function handleCreate(values: MovimientoCreateInput) {
    try {
      const response = await createMovimientoMutation.mutateAsync(values);

      toast.success({ title: MOVIMIENTOS.feedback.createSuccess });
      void navigate({
        to: '/transactions',
        search: { month: getMonthFromMovimiento(response.item) },
      });
    } catch (error) {
      toast.error({ title: mapMovimientosError(error) });
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{MOVIMIENTOS.newTitle}</h1>
          <p className="text-muted-foreground">{MOVIMIENTOS.newDescription}</p>
        </div>

        <Button variant="outline" asChild>
          <Link to="/transactions">{MOVIMIENTOS.actions.backToList}</Link>
        </Button>
      </div>

      <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
        <MovimientoForm
          key="new-movimiento-form"
          mode="create"
          initialValues={getDefaultMovimientoValues()}
          onSubmit={handleCreate}
          submitLabel={MOVIMIENTOS.form.submitCreate}
          isPending={createMovimientoMutation.isPending}
        />
      </section>
    </div>
  );
}
