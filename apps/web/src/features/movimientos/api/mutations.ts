import {
  type MovimientoCreateInput,
  type MovimientoDeleteResponse,
  type MovimientoMutationResponse,
  type MovimientoUpdateInput,
  movimientoDeleteResponseSchema,
  movimientoMutationResponseSchema,
} from '@rumbo/shared';
import { mutationOptions } from '@tanstack/react-query';
import { api } from '@/shared/lib/api-client';
import { queryClient } from '@/shared/lib/query-client';
import { movimientosKeys } from './queries';

export function createMovimientoMutationOptions() {
  return mutationOptions({
    mutationFn: createMovimiento,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: movimientosKeys.all });
    },
  });
}

export function updateMovimientoMutationOptions() {
  return mutationOptions({
    mutationFn: updateMovimiento,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: movimientosKeys.all });
    },
  });
}

export function deleteMovimientoMutationOptions() {
  return mutationOptions({
    mutationFn: deleteMovimiento,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: movimientosKeys.all });
    },
  });
}

async function createMovimiento(input: MovimientoCreateInput): Promise<MovimientoMutationResponse> {
  const response = await api.post<MovimientoMutationResponse>('/api/movimientos', input);

  return movimientoMutationResponseSchema.parse(response);
}

async function updateMovimiento({
  id,
  input,
}: {
  id: string;
  input: MovimientoUpdateInput;
}): Promise<MovimientoMutationResponse> {
  const response = await api.patch<MovimientoMutationResponse>(`/api/movimientos/${id}`, input);

  return movimientoMutationResponseSchema.parse(response);
}

async function deleteMovimiento(id: string): Promise<MovimientoDeleteResponse> {
  const response = await api.delete<MovimientoDeleteResponse>(`/api/movimientos/${id}`);

  return movimientoDeleteResponseSchema.parse(response);
}
