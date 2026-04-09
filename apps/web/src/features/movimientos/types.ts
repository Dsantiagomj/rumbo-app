import type { MovimientoCreateInput, MovimientoUpdateInput } from '@rumbo/shared';

export interface MovimientosRouteSearch {
  month?: string;
}

export interface MovimientoFormProps {
  mode: 'create' | 'edit';
  initialValues: MovimientoCreateInput | MovimientoUpdateInput;
  onSubmit: (values: MovimientoCreateInput | MovimientoUpdateInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
  isPending: boolean;
}
