import { createFileRoute } from '@tanstack/react-router';
import { NewMovimientoPage } from '@/features/movimientos/components/new-movimiento-page';

export const Route = createFileRoute('/_app/transactions/new')({
  component: NewTransactionsPage,
});

function NewTransactionsPage() {
  return <NewMovimientoPage />;
}
