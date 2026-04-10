import { zodResolver } from '@hookform/resolvers/zod';
import {
  type TransactionCreateInput,
  type TransactionType,
  transactionCreateSchema,
  transactionUpdateSchema,
} from '@rumbo/shared';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { TRANSACTIONS } from '../strings';
import type { TransactionFormProps } from '../types';
import {
  FORM_CONTROL_CLASS_NAME,
  getCategoryOptions,
  getTodayDateValue,
  getTypeLabel,
  TEXTAREA_CLASS_NAME,
} from '../utils';

export function TransactionForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  isPending,
}: TransactionFormProps) {
  const {
    register,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionCreateInput>({
    resolver: zodResolver(mode === 'create' ? transactionCreateSchema : transactionUpdateSchema),
    defaultValues: initialValues,
  });

  const selectedType = watch('type');
  const categoryOptions = getCategoryOptions(selectedType);

  function handleTypeChange(nextType: TransactionType) {
    const nextOptions = getCategoryOptions(nextType);
    const currentCategory = getValues('category');
    const fallbackCategory = nextOptions[0];

    setValue('type', nextType, { shouldDirty: true, shouldValidate: true });

    if (fallbackCategory && !nextOptions.some((option) => option === currentCategory)) {
      setValue('category', fallbackCategory, { shouldDirty: true, shouldValidate: true });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FieldGroup>
        <Field data-invalid={errors.type ? true : undefined}>
          <FieldLabel htmlFor={`transaction-type-${mode}`}>
            {TRANSACTIONS.form.typeLabel}
          </FieldLabel>
          <select
            id={`transaction-type-${mode}`}
            className={FORM_CONTROL_CLASS_NAME}
            aria-invalid={!!errors.type}
            value={selectedType}
            onChange={(event) => handleTypeChange(event.target.value as TransactionType)}
          >
            {(['income', 'expense'] as const).map((type) => (
              <option key={type} value={type}>
                {getTypeLabel(type)}
              </option>
            ))}
          </select>
          <FieldError>{errors.type?.message}</FieldError>
        </Field>

        <Field data-invalid={errors.amount ? true : undefined}>
          <FieldLabel htmlFor={`transaction-amount-${mode}`}>
            {TRANSACTIONS.form.amountLabel}
          </FieldLabel>
          <Input
            id={`transaction-amount-${mode}`}
            type="number"
            step="0.01"
            min="0.01"
            aria-invalid={!!errors.amount}
            {...register('amount', { valueAsNumber: true })}
          />
          <FieldError>{errors.amount?.message}</FieldError>
        </Field>

        <Field data-invalid={errors.date ? true : undefined}>
          <FieldLabel htmlFor={`transaction-date-${mode}`}>
            {TRANSACTIONS.form.dateLabel}
          </FieldLabel>
          <Input
            id={`transaction-date-${mode}`}
            type="date"
            max={getTodayDateValue()}
            aria-invalid={!!errors.date}
            {...register('date')}
          />
          <FieldDescription>{TRANSACTIONS.form.dateHelp}</FieldDescription>
          <FieldError>{errors.date?.message}</FieldError>
        </Field>

        <Field data-invalid={errors.category ? true : undefined}>
          <FieldLabel htmlFor={`transaction-category-${mode}`}>
            {TRANSACTIONS.form.categoryLabel}
          </FieldLabel>
          <select
            id={`transaction-category-${mode}`}
            className={FORM_CONTROL_CLASS_NAME}
            aria-invalid={!!errors.category}
            {...register('category')}
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <FieldError>{errors.category?.message}</FieldError>
        </Field>

        <Field data-invalid={errors.note ? true : undefined}>
          <FieldLabel htmlFor={`transaction-note-${mode}`}>
            {TRANSACTIONS.form.noteLabel}
          </FieldLabel>
          <textarea
            id={`transaction-note-${mode}`}
            className={TEXTAREA_CLASS_NAME}
            placeholder={TRANSACTIONS.form.notePlaceholder}
            aria-invalid={!!errors.note}
            {...register('note')}
          />
          <FieldError>{errors.note?.message}</FieldError>
        </Field>
      </FieldGroup>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            {TRANSACTIONS.form.cancel}
          </Button>
        ) : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? `${submitLabel}...` : submitLabel}
        </Button>
      </div>
    </form>
  );
}
