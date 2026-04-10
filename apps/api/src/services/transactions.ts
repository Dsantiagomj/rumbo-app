import { transactions } from '@rumbo/db/schema';
import {
  type Transaction,
  type TransactionListResponse,
  transactionCreateSchema,
  transactionListQuerySchema,
  transactionSchema,
  transactionUpdateSchema,
} from '@rumbo/shared';
import { and, desc, eq, gte, lt, sql } from 'drizzle-orm';
import { TRANSACTIONS_SERVICE } from './transactions-strings.js';

type TransactionRow = typeof transactions.$inferSelect;
type AvailableMonthRow = { month: string };

// HACK: Narrow local DB contract until the shared db package exports the typed client.
type AvailableMonthsDb = {
  select: (selection: { month: ReturnType<typeof sql<string>> }) => {
    from: (table: typeof transactions) => {
      where: (condition: unknown) => {
        groupBy: (grouping: ReturnType<typeof sql<string>>) => {
          orderBy: (...clauses: unknown[]) => Promise<AvailableMonthRow[]>;
        };
      };
    };
  };
};

// HACK: Tests stub only the query methods used by this service, so we keep a minimal contract here.
export type TransactionsDb = {
  select: () => {
    from: (table: typeof transactions) => {
      where: (condition: unknown) => {
        orderBy: (...clauses: unknown[]) => Promise<TransactionRow[]>;
      };
    };
  };
  insert: (table: typeof transactions) => {
    values: (values: typeof transactions.$inferInsert) => {
      returning: () => Promise<TransactionRow[]>;
    };
  };
  update: (table: typeof transactions) => {
    set: (values: Partial<typeof transactions.$inferInsert> & { updatedAt: Date }) => {
      where: (condition: unknown) => {
        returning: () => Promise<TransactionRow[]>;
      };
    };
  };
  delete: (table: typeof transactions) => {
    where: (condition: unknown) => {
      returning: (selection: { id: typeof transactions.id }) => Promise<Array<{ id: string }>>;
    };
  };
};

export class TransactionServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export function createTransactionsService(database: TransactionsDb) {
  return {
    async listTransactions(
      userId: string,
      query: { month?: string },
    ): Promise<TransactionListResponse> {
      const { month } = transactionListQuerySchema.parse(query);

      if (month === 'all') {
        const rows = await database
          .select()
          .from(transactions)
          .where(eq(transactions.userId, userId))
          .orderBy(desc(transactions.date), desc(transactions.time));

        return { items: rows.map(mapTransactionRecord) };
      }

      const targetMonth = month ?? getCurrentMonthKey();
      const { startDate, endDate } = getMonthRange(targetMonth);

      const rows = await database
        .select()
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            gte(transactions.date, startDate),
            lt(transactions.date, endDate),
          ),
        )
        .orderBy(desc(transactions.date), desc(transactions.time));

      return { month: targetMonth, items: rows.map(mapTransactionRecord) };
    },

    async createTransaction(userId: string, input: unknown): Promise<Transaction> {
      const parsedInput = transactionCreateSchema.parse(input);

      const [created] = await database
        .insert(transactions)
        .values({
          userId,
          type: parsedInput.type,
          amount: parsedInput.amount.toFixed(2),
          date: parsedInput.date,
          time: getCurrentTimeKey(),
          category: parsedInput.category,
          note: normalizeOptionalText(parsedInput.note),
        })
        .returning();

      if (!created) {
        throw new TransactionServiceError(TRANSACTIONS_SERVICE.createFailed, 500);
      }

      return mapTransactionRecord(created);
    },

    async updateTransaction(
      userId: string,
      transactionId: string,
      input: unknown,
    ): Promise<Transaction> {
      const parsedInput = transactionUpdateSchema.parse(input);

      const [updated] = await database
        .update(transactions)
        .set({
          type: parsedInput.type,
          amount: parsedInput.amount.toFixed(2),
          date: parsedInput.date,
          time: getCurrentTimeKey(),
          category: parsedInput.category,
          note: normalizeOptionalText(parsedInput.note),
          updatedAt: new Date(),
        })
        .where(and(eq(transactions.id, transactionId), eq(transactions.userId, userId)))
        .returning();

      if (!updated) {
        throw new TransactionServiceError(TRANSACTIONS_SERVICE.notFound, 404);
      }

      return mapTransactionRecord(updated);
    },

    async getTransaction(userId: string, transactionId: string): Promise<Transaction> {
      const rows = await database
        .select()
        .from(transactions)
        .where(and(eq(transactions.id, transactionId), eq(transactions.userId, userId)))
        .orderBy(desc(transactions.createdAt));

      const row = rows[0];

      if (!row) {
        throw new TransactionServiceError(TRANSACTIONS_SERVICE.notFound, 404);
      }

      return mapTransactionRecord(row);
    },

    async deleteTransaction(userId: string, transactionId: string): Promise<void> {
      const [deleted] = await database
        .delete(transactions)
        .where(and(eq(transactions.id, transactionId), eq(transactions.userId, userId)))
        .returning({ id: transactions.id });

      if (!deleted) {
        throw new TransactionServiceError(TRANSACTIONS_SERVICE.notFound, 404);
      }
    },
  };
}

export async function listTransactions(userId: string, query: { month?: string }) {
  const service = createTransactionsService(await getTransactionsDb());
  return service.listTransactions(userId, query);
}

export async function getTransaction(userId: string, transactionId: string) {
  const service = createTransactionsService(await getTransactionsDb());
  return service.getTransaction(userId, transactionId);
}

export async function listAvailableMonths(userId: string): Promise<string[]> {
  const monthExpr = sql<string>`to_char(${transactions.date}, 'YYYY-MM')`;
  const monthsDb = await getAvailableMonthsDb();

  const rows = await monthsDb
    .select({ month: monthExpr })
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .groupBy(monthExpr)
    .orderBy(desc(monthExpr));

  return rows.map((row) => row.month);
}

export async function createTransaction(userId: string, input: unknown) {
  const service = createTransactionsService(await getTransactionsDb());
  return service.createTransaction(userId, input);
}

export async function updateTransaction(userId: string, transactionId: string, input: unknown) {
  const service = createTransactionsService(await getTransactionsDb());
  return service.updateTransaction(userId, transactionId, input);
}

export async function deleteTransaction(userId: string, transactionId: string) {
  const service = createTransactionsService(await getTransactionsDb());
  return service.deleteTransaction(userId, transactionId);
}

async function getTransactionsDb(): Promise<TransactionsDb> {
  const { db } = await import('../lib/db.js');

  // HACK: Drizzle's inferred DB type is not exported from the shared db layer yet.
  return db as unknown as TransactionsDb;
}

async function getAvailableMonthsDb(): Promise<AvailableMonthsDb> {
  const { db } = await import('../lib/db.js');

  // HACK: Keep this narrow cast local until the shared db package exports the typed DB client.
  return db as unknown as AvailableMonthsDb;
}

function mapTransactionRecord(record: TransactionRow): Transaction {
  return transactionSchema.parse({
    id: record.id,
    type: record.type,
    amount: Number(record.amount),
    date: record.date,
    category: record.category,
    note: record.note ?? null,
    createdAt: toIsoDateTimeString(record.createdAt),
    updatedAt: toIsoDateTimeString(record.updatedAt),
  });
}

function normalizeOptionalText(value?: string) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

function getCurrentMonthKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
}

function getMonthRange(month: string) {
  const [yearString, monthString] = month.split('-');
  const year = Number(yearString);
  const monthIndex = Number(monthString) - 1;
  const startDate = formatDateKey(new Date(Date.UTC(year, monthIndex, 1)));
  const endDate = formatDateKey(new Date(Date.UTC(year, monthIndex + 1, 1)));

  return { startDate, endDate };
}

function formatDateKey(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getCurrentTimeKey() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

function toIsoDateTimeString(value: Date | string) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new TransactionServiceError(TRANSACTIONS_SERVICE.invalidDate, 500);
  }

  return parsed.toISOString();
}
