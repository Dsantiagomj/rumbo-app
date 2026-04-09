import { createFileRoute } from '@tanstack/react-router';
import { EditMovimientoPage } from '@/features/movimientos/components/edit-movimiento-page';

export const Route = createFileRoute('/_app/transactions/$id')({
  component: EditTransactionPage,
});

function EditTransactionPage() {
  const { id } = Route.useParams();

  return <EditMovimientoPage id={id} />;
}
