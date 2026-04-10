import {
  type TransactionAvailableMonthsResponse,
  type TransactionListQuery,
  type TransactionListResponse,
  type TransactionMutationResponse,
  transactionAvailableMonthsResponseSchema,
  transactionListResponseSchema,
  transactionMutationResponseSchema,
} from '@rumbo/shared';
import { queryOptions } from '@tanstack/react-query';
import { api } from '@/shared/lib/api-client';

export const transactionsKeys = {
  all: ['transactions'] as const,
  months: ['transactions', 'months'] as const,
  list: (month?: string) => ['transactions', month ?? 'all'] as const,
  detail: (id: string) => ['transactions', 'detail', id] as const,
};

export function transactionsQueryOptions(month?: string) {
  return queryOptions({
    queryKey: transactionsKeys.list(month),
    queryFn: () => fetchTransactions(month ? { month } : {}),
  });
}

export function transactionQueryOptions(id: string) {
  return queryOptions({
    queryKey: transactionsKeys.detail(id),
    queryFn: () => fetchTransaction(id),
  });
}

export function availableMonthsQueryOptions() {
  return queryOptions({
    queryKey: transactionsKeys.months,
    queryFn: fetchAvailableMonths,
    staleTime: 1000 * 60 * 5,
  });
}

async function fetchAvailableMonths(): Promise<TransactionAvailableMonthsResponse> {
  const response = await api.get<TransactionAvailableMonthsResponse>('/api/transactions/months');

  return transactionAvailableMonthsResponseSchema.parse(response);
}

async function fetchTransactions(query: TransactionListQuery): Promise<TransactionListResponse> {
  const searchParams = new URLSearchParams();

  if (query.month) {
    searchParams.set('month', query.month);
  }

  const suffix = searchParams.toString();
  const endpoint = suffix ? `/api/transactions?${suffix}` : '/api/transactions';
  const response = await api.get<TransactionListResponse>(endpoint);

  return transactionListResponseSchema.parse(response);
}

async function fetchTransaction(id: string): Promise<TransactionMutationResponse> {
  const response = await api.get<TransactionMutationResponse>(`/api/transactions/${id}`);

  return transactionMutationResponseSchema.parse(response);
}
