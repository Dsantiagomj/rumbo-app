import { createFileRoute } from '@tanstack/react-router';
import { NewTransactionPage } from '@/features/transactions/components/new-transaction-page';

export const Route = createFileRoute('/_app/transactions/new')({
  component: NewTransactionsPage,
});

function NewTransactionsPage() {
  return <NewTransactionPage />;
}
