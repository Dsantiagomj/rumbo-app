import type {
  Movimiento,
  MovimientoCreateInput,
  MovimientoType,
  MovimientoUpdateInput,
} from '@rumbo/shared';

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

export interface MovimientoListItemProps {
  item: Movimiento;
  isSelected: boolean;
  onEdit: (item: Movimiento) => void;
  onDelete: (item: Movimiento) => void;
}

export interface MovimientoTypeOption {
  value: MovimientoType;
  label: string;
}
