import type { TransactionCreateInput, TransactionUpdateInput } from '@rumbo/shared';

export interface TransactionsRouteSearch {
  month?: string;
}

export interface TransactionFormProps {
  mode: 'create' | 'edit';
  initialValues: TransactionCreateInput | TransactionUpdateInput;
  onSubmit: (values: TransactionCreateInput | TransactionUpdateInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
  isPending: boolean;
}
