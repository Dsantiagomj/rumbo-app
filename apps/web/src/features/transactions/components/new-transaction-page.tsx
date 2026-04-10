import type { TransactionCreateInput } from '@rumbo/shared';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/shared/components/ui/button';
import { toast } from '@/shared/lib/toast';
import { createTransactionMutationOptions } from '../api/mutations';
import { TRANSACTIONS } from '../strings';
import {
  getDefaultTransactionValues,
  getMonthFromTransaction,
  mapTransactionsError,
} from '../utils';
import { TransactionForm } from './transaction-form';

export function NewTransactionPage() {
  const navigate = useNavigate();
  const createTransactionMutation = useMutation(createTransactionMutationOptions());

  async function handleCreate(values: TransactionCreateInput) {
    try {
      const response = await createTransactionMutation.mutateAsync(values);

      toast.success({ title: TRANSACTIONS.feedback.createSuccess });
      void navigate({
        to: '/transactions',
        search: { month: getMonthFromTransaction(response.item) },
      });
    } catch (error) {
      toast.error({ title: mapTransactionsError(error) });
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{TRANSACTIONS.newTitle}</h1>
          <p className="text-muted-foreground">{TRANSACTIONS.newDescription}</p>
        </div>

        <Button variant="outline" asChild>
          <Link to="/transactions">{TRANSACTIONS.actions.backToList}</Link>
        </Button>
      </div>

      <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
        <TransactionForm
          key="new-transaction-form"
          mode="create"
          initialValues={getDefaultTransactionValues()}
          onSubmit={handleCreate}
          submitLabel={TRANSACTIONS.form.submitCreate}
          isPending={createTransactionMutation.isPending}
        />
      </section>
    </div>
  );
}
