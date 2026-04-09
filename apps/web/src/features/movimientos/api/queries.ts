import {
  type MovimientoListQuery,
  type MovimientoListResponse,
  type MovimientoMutationResponse,
  movimientoListResponseSchema,
  movimientoMutationResponseSchema,
} from '@rumbo/shared';
import { queryOptions } from '@tanstack/react-query';
import { api } from '@/shared/lib/api-client';

export const movimientosKeys = {
  all: ['movimientos'] as const,
  list: (month: string) => ['movimientos', month] as const,
  detail: (id: string) => ['movimientos', 'detail', id] as const,
};

export function movimientosQueryOptions(month: string) {
  return queryOptions({
    queryKey: movimientosKeys.list(month),
    queryFn: () => fetchMovimientos({ month }),
  });
}

export function movimientoQueryOptions(id: string) {
  return queryOptions({
    queryKey: movimientosKeys.detail(id),
    queryFn: () => fetchMovimiento(id),
  });
}

async function fetchMovimientos(query: MovimientoListQuery): Promise<MovimientoListResponse> {
  const searchParams = new URLSearchParams();

  if (query.month) {
    searchParams.set('month', query.month);
  }

  const suffix = searchParams.toString();
  const endpoint = suffix ? `/api/movimientos?${suffix}` : '/api/movimientos';
  const response = await api.get<MovimientoListResponse>(endpoint);

  return movimientoListResponseSchema.parse(response);
}

async function fetchMovimiento(id: string): Promise<MovimientoMutationResponse> {
  const response = await api.get<MovimientoMutationResponse>(`/api/movimientos/${id}`);

  return movimientoMutationResponseSchema.parse(response);
}
