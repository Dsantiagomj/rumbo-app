import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type Transaction,
  type TransactionCreateInput,
  type TransactionType,
} from '@rumbo/shared';
import { TRANSACTIONS } from './strings';

export const FORM_CONTROL_CLASS_NAME =
  'flex h-9 w-full rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-sm transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40';

export const TEXTAREA_CLASS_NAME = `${FORM_CONTROL_CLASS_NAME} min-h-24 resize-y py-2`;

export function getCurrentMonthValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
}

export function getTodayDateValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getMonthLabel(month: string) {
  const [yearString, monthString] = month.split('-');
  const date = new Date(Number(yearString), Number(monthString) - 1, 1);

  return new Intl.DateTimeFormat('es-AR', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatShortDate(value: string) {
  const [yearString, monthString, dayString] = value.split('-');
  const date = new Date(Number(yearString), Number(monthString) - 1, Number(dayString));

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function getTypeLabel(type: TransactionType) {
  return type === 'income' ? TRANSACTIONS.types.income : TRANSACTIONS.types.expense;
}

export function getCategoryOptions(type: TransactionType) {
  return type === 'income' ? [...INCOME_CATEGORIES] : [...EXPENSE_CATEGORIES];
}

export function getDefaultTransactionValues(): TransactionCreateInput {
  return {
    type: 'expense',
    amount: 0,
    date: getTodayDateValue(),
    category: EXPENSE_CATEGORIES[0],
    note: '',
  };
}

export function getTransactionFormValues(item: Transaction): TransactionCreateInput {
  return {
    type: item.type,
    amount: item.amount,
    date: item.date,
    category: item.category,
    note: item.note ?? '',
  };
}

export function formatDayHeader(dateString: string) {
  const [yearString, monthString, dayString] = dateString.split('-');
  const date = new Date(Number(yearString), Number(monthString) - 1, Number(dayString));

  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

export function groupByDate(items: Transaction[]) {
  const groups: Array<{ date: string; label: string; items: Transaction[] }> = [];
  let current: (typeof groups)[number] | null = null;

  for (const item of items) {
    if (current && current.date === item.date) {
      current.items.push(item);
    } else {
      current = { date: item.date, label: formatDayHeader(item.date), items: [item] };
      groups.push(current);
    }
  }

  return groups;
}

export function mapTransactionsError(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return TRANSACTIONS.feedback.loadError;
}

export function getMonthFromTransaction(item: Pick<Transaction, 'date'>) {
  return item.date.slice(0, 7);
}
