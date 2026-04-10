import { z } from 'zod';

export const TRANSACTION_TYPES = ['income', 'expense'] as const;

export const INCOME_CATEGORIES = [
  'Salario',
  'Freelance',
  'Ventas',
  'Regalos',
  'Reembolsos',
  'Inversiones',
  'Otros ingresos',
] as const;

export const EXPENSE_CATEGORIES = [
  'Vivienda',
  'Comida',
  'Transporte',
  'Salud',
  'Educación',
  'Entretenimiento',
  'Compras',
  'Servicios',
  'Deudas',
  'Suscripciones',
  'Viajes',
  'Mascotas',
  'Familia',
  'Impuestos',
  'Otros gastos',
] as const;

export const transactionTypeSchema = z.enum(TRANSACTION_TYPES);
export const incomeCategorySchema = z.enum(INCOME_CATEGORIES);
export const expenseCategorySchema = z.enum(EXPENSE_CATEGORIES);
export const transactionCategorySchema = z.union([incomeCategorySchema, expenseCategorySchema]);

export const monthKeySchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/, 'El mes debe tener formato AAAA-MM')
  .refine((value) => {
    const [yearString, monthString] = value.split('-');
    const year = Number(yearString);
    const month = Number(monthString);

    return Number.isInteger(year) && Number.isInteger(month) && month >= 1 && month <= 12;
  }, 'El mes no es válido');

export const transactionDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato AAAA-MM-DD')
  .refine((value) => isValidCalendarDate(value), 'La fecha no es válida')
  .refine((value) => value <= getTodayDateKey(), 'La fecha no puede ser futura');

export const transactionAmountSchema = z
  .number({ message: 'El monto es requerido' })
  .positive('El monto debe ser mayor a 0');

const transactionBaseSchema = z.object({
  type: transactionTypeSchema,
  amount: transactionAmountSchema,
  date: transactionDateSchema,
  category: transactionCategorySchema,
  note: z.string().trim().max(280, 'La nota no puede superar los 280 caracteres').optional(),
});

export const transactionCreateSchema = transactionBaseSchema.superRefine((value, ctx) => {
  if (value.type === 'income' && !INCOME_CATEGORIES.includes(value.category as IncomeCategory)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['category'],
      message: 'La categoría no corresponde al tipo de transaction',
    });
  }

  if (value.type === 'expense' && !EXPENSE_CATEGORIES.includes(value.category as ExpenseCategory)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['category'],
      message: 'La categoría no corresponde al tipo de transaction',
    });
  }
});

export const transactionUpdateSchema = transactionCreateSchema;

export const transactionListQuerySchema = z.object({
  month: z.union([monthKeySchema, z.literal('all')]).optional(),
  q: z.string().trim().max(120).optional(),
});

export const transactionIdParamsSchema = z.object({
  id: z.string().uuid('El identificador no es válido'),
});

export const transactionSchema = z.object({
  id: z.string().uuid(),
  type: transactionTypeSchema,
  amount: z.number().positive(),
  date: transactionDateSchema,
  category: transactionCategorySchema,
  note: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const transactionListResponseSchema = z.object({
  month: monthKeySchema.optional(),
  items: z.array(transactionSchema),
});

export const transactionMutationResponseSchema = z.object({
  item: transactionSchema,
});

export const transactionDeleteResponseSchema = z.object({
  success: z.literal(true),
});

export const transactionAvailableMonthsResponseSchema = z.object({
  months: z.array(monthKeySchema),
});

export type TransactionType = z.infer<typeof transactionTypeSchema>;
export type IncomeCategory = z.infer<typeof incomeCategorySchema>;
export type ExpenseCategory = z.infer<typeof expenseCategorySchema>;
export type TransactionCategory = z.infer<typeof transactionCategorySchema>;
export type TransactionCreateInput = z.infer<typeof transactionCreateSchema>;
export type TransactionUpdateInput = z.infer<typeof transactionUpdateSchema>;
export type TransactionListQuery = z.infer<typeof transactionListQuerySchema>;
export type TransactionIdParams = z.infer<typeof transactionIdParamsSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionListResponse = z.infer<typeof transactionListResponseSchema>;
export type TransactionMutationResponse = z.infer<typeof transactionMutationResponseSchema>;
export type TransactionDeleteResponse = z.infer<typeof transactionDeleteResponseSchema>;
export type TransactionAvailableMonthsResponse = z.infer<
  typeof transactionAvailableMonthsResponseSchema
>;

function getTodayDateKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function isValidCalendarDate(value: string) {
  const [yearString, monthString, dayString] = value.split('-');
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }

  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}
