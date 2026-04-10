import {
  type TransactionCreateInput,
  type TransactionDeleteResponse,
  type TransactionMutationResponse,
  type TransactionUpdateInput,
  transactionDeleteResponseSchema,
  transactionMutationResponseSchema,
} from '@rumbo/shared';
import { mutationOptions } from '@tanstack/react-query';
import { api } from '@/shared/lib/api-client';
import { queryClient } from '@/shared/lib/query-client';
import { transactionsKeys } from './queries';

export function createTransactionMutationOptions() {
  return mutationOptions({
    mutationFn: createTransaction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: transactionsKeys.all });
    },
  });
}

export function updateTransactionMutationOptions() {
  return mutationOptions({
    mutationFn: updateTransaction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: transactionsKeys.all });
    },
  });
}

export function deleteTransactionMutationOptions() {
  return mutationOptions({
    mutationFn: deleteTransaction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: transactionsKeys.all });
    },
  });
}

async function createTransaction(
  input: TransactionCreateInput,
): Promise<TransactionMutationResponse> {
  const response = await api.post<TransactionMutationResponse>('/api/transactions', input);

  return transactionMutationResponseSchema.parse(response);
}

async function updateTransaction({
  id,
  input,
}: {
  id: string;
  input: TransactionUpdateInput;
}): Promise<TransactionMutationResponse> {
  const response = await api.patch<TransactionMutationResponse>(`/api/transactions/${id}`, input);

  return transactionMutationResponseSchema.parse(response);
}

async function deleteTransaction(id: string): Promise<TransactionDeleteResponse> {
  const response = await api.delete<TransactionDeleteResponse>(`/api/transactions/${id}`);

  return transactionDeleteResponseSchema.parse(response);
}
