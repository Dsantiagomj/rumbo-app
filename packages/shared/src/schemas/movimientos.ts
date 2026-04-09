import { z } from 'zod';

export const MOVIMIENTO_TYPES = ['income', 'expense'] as const;

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

export const movimientoTypeSchema = z.enum(MOVIMIENTO_TYPES);
export const incomeCategorySchema = z.enum(INCOME_CATEGORIES);
export const expenseCategorySchema = z.enum(EXPENSE_CATEGORIES);
export const movimientoCategorySchema = z.union([incomeCategorySchema, expenseCategorySchema]);

export const monthKeySchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/, 'El mes debe tener formato AAAA-MM')
  .refine((value) => {
    const [yearString, monthString] = value.split('-');
    const year = Number(yearString);
    const month = Number(monthString);

    return Number.isInteger(year) && Number.isInteger(month) && month >= 1 && month <= 12;
  }, 'El mes no es válido');

export const movimientoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato AAAA-MM-DD')
  .refine((value) => isValidCalendarDate(value), 'La fecha no es válida')
  .refine((value) => value <= getTodayDateKey(), 'La fecha no puede ser futura');

export const movimientoAmountSchema = z
  .number({ message: 'El monto es requerido' })
  .positive('El monto debe ser mayor a 0');

const movimientoBaseSchema = z.object({
  type: movimientoTypeSchema,
  amount: movimientoAmountSchema,
  date: movimientoDateSchema,
  category: movimientoCategorySchema,
  note: z.string().trim().max(280, 'La nota no puede superar los 280 caracteres').optional(),
});

export const movimientoCreateSchema = movimientoBaseSchema.superRefine((value, ctx) => {
  if (value.type === 'income' && !INCOME_CATEGORIES.includes(value.category as IncomeCategory)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['category'],
      message: 'La categoría no corresponde al tipo de movimiento',
    });
  }

  if (value.type === 'expense' && !EXPENSE_CATEGORIES.includes(value.category as ExpenseCategory)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['category'],
      message: 'La categoría no corresponde al tipo de movimiento',
    });
  }
});

export const movimientoUpdateSchema = movimientoCreateSchema;

export const movimientoListQuerySchema = z.object({
  month: monthKeySchema.optional(),
});

export const movimientoIdParamsSchema = z.object({
  id: z.string().uuid('El identificador no es válido'),
});

export const movimientoSchema = z.object({
  id: z.string().uuid(),
  type: movimientoTypeSchema,
  amount: z.number().positive(),
  date: movimientoDateSchema,
  category: movimientoCategorySchema,
  note: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const movimientoListResponseSchema = z.object({
  month: monthKeySchema,
  items: z.array(movimientoSchema),
});

export const movimientoMutationResponseSchema = z.object({
  item: movimientoSchema,
});

export const movimientoDeleteResponseSchema = z.object({
  success: z.literal(true),
});

export type MovimientoType = z.infer<typeof movimientoTypeSchema>;
export type IncomeCategory = z.infer<typeof incomeCategorySchema>;
export type ExpenseCategory = z.infer<typeof expenseCategorySchema>;
export type MovimientoCategory = z.infer<typeof movimientoCategorySchema>;
export type MovimientoCreateInput = z.infer<typeof movimientoCreateSchema>;
export type MovimientoUpdateInput = z.infer<typeof movimientoUpdateSchema>;
export type MovimientoListQuery = z.infer<typeof movimientoListQuerySchema>;
export type MovimientoIdParams = z.infer<typeof movimientoIdParamsSchema>;
export type Movimiento = z.infer<typeof movimientoSchema>;
export type MovimientoListResponse = z.infer<typeof movimientoListResponseSchema>;
export type MovimientoMutationResponse = z.infer<typeof movimientoMutationResponseSchema>;
export type MovimientoDeleteResponse = z.infer<typeof movimientoDeleteResponseSchema>;

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
