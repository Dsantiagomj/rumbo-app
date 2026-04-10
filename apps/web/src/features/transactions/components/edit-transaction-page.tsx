import type { TransactionCreateInput } from '@rumbo/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/shared/components/ui/button';
import { toast } from '@/shared/lib/toast';
import {
  deleteTransactionMutationOptions,
  updateTransactionMutationOptions,
} from '../api/mutations';
import { transactionQueryOptions } from '../api/queries';
import { TRANSACTIONS } from '../strings';
import { getMonthFromTransaction, getTransactionFormValues, mapTransactionsError } from '../utils';
import { TransactionForm } from './transaction-form';

interface EditTransactionPageProps {
  id: string;
}

export function EditTransactionPage({ id }: EditTransactionPageProps) {
  const navigate = useNavigate();
  const transactionQuery = useQuery(transactionQueryOptions(id));
  const updateTransactionMutation = useMutation(updateTransactionMutationOptions());
  const deleteTransactionMutation = useMutation(deleteTransactionMutationOptions());

  const item = transactionQuery.data?.item ?? null;

  async function handleUpdate(values: TransactionCreateInput) {
    if (!item) {
      return;
    }

    try {
      const response = await updateTransactionMutation.mutateAsync({ id: item.id, input: values });

      toast.success({ title: TRANSACTIONS.feedback.updateSuccess });
      void navigate({
        to: '/transactions',
        search: { month: getMonthFromTransaction(response.item) },
      });
    } catch (error) {
      toast.error({ title: mapTransactionsError(error) });
    }
  }

  async function handleDelete() {
    if (!item) {
      return;
    }

    const confirmed = window.confirm(TRANSACTIONS.feedback.deleteConfirm);

    if (!confirmed) {
      return;
    }

    try {
      await deleteTransactionMutation.mutateAsync(item.id);
      toast.success({ title: TRANSACTIONS.feedback.deleteSuccess });
      void navigate({ to: '/transactions' });
    } catch (error) {
      toast.error({ title: mapTransactionsError(error) });
    }
  }

  if (transactionQuery.isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <section className="rounded-3xl border border-border/60 bg-card px-5 py-8 text-sm text-muted-foreground shadow-sm">
          {TRANSACTIONS.feedback.loading}
        </section>
      </div>
    );
  }

  if (transactionQuery.isError || !item) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <section className="rounded-3xl border border-destructive/30 bg-destructive/5 px-5 py-8 text-sm text-destructive shadow-sm">
          {mapTransactionsError(transactionQuery.error)}
        </section>
        <Button variant="outline" asChild className="self-start">
          <Link to="/transactions">{TRANSACTIONS.actions.backToList}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{TRANSACTIONS.editTitle}</h1>
          <p className="text-muted-foreground">{TRANSACTIONS.editDescription}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteTransactionMutation.isPending}
          >
            {TRANSACTIONS.actions.delete}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/transactions">{TRANSACTIONS.actions.backToList}</Link>
          </Button>
        </div>
      </div>

      <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
        <TransactionForm
          key={item.id}
          mode="edit"
          initialValues={getTransactionFormValues(item)}
          onSubmit={handleUpdate}
          submitLabel={TRANSACTIONS.form.submitUpdate}
          isPending={updateTransactionMutation.isPending}
        />
      </section>
    </div>
  );
}
