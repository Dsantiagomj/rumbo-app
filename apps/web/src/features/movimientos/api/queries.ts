import {
  type MovimientoListQuery,
  type MovimientoListResponse,
  movimientoListResponseSchema,
} from '@rumbo/shared';
import { queryOptions } from '@tanstack/react-query';
import { api } from '@/shared/lib/api-client';

export const movimientosKeys = {
  all: ['movimientos'] as const,
  list: (month: string) => ['movimientos', month] as const,
};

export function movimientosQueryOptions(month: string) {
  return queryOptions({
    queryKey: movimientosKeys.list(month),
    queryFn: () => fetchMovimientos({ month }),
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
