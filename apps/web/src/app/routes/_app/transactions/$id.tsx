import { createFileRoute } from '@tanstack/react-router';
import { EditTransactionPage } from '@/features/transactions/components/edit-transaction-page';

export const Route = createFileRoute('/_app/transactions/$id')({
  component: EditTransactionRoute,
});

function EditTransactionRoute() {
  const { id } = Route.useParams();

  return <EditTransactionPage id={id} />;
}
