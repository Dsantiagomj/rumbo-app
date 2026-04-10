import { movimientos } from '@rumbo/db/schema';
import {
  type Movimiento,
  type MovimientoListResponse,
  movimientoCreateSchema,
  movimientoListQuerySchema,
  movimientoSchema,
  movimientoUpdateSchema,
} from '@rumbo/shared';
import { and, desc, eq, gte, lt, sql } from 'drizzle-orm';
import { MOVIMIENTOS_SERVICE } from './movimientos-strings.js';

type MovimientoRow = typeof movimientos.$inferSelect;
type AvailableMonthRow = { month: string };

// HACK: Narrow local DB contract until the shared db package exports the typed client.
type AvailableMonthsDb = {
  select: (selection: { month: ReturnType<typeof sql<string>> }) => {
    from: (table: typeof movimientos) => {
      where: (condition: unknown) => {
        groupBy: (grouping: ReturnType<typeof sql<string>>) => {
          orderBy: (...clauses: unknown[]) => Promise<AvailableMonthRow[]>;
        };
      };
    };
  };
};

// HACK: Tests stub only the query methods used by this service, so we keep a minimal contract here.
export type MovimientosDb = {
  select: () => {
    from: (table: typeof movimientos) => {
      where: (condition: unknown) => {
        orderBy: (...clauses: unknown[]) => Promise<MovimientoRow[]>;
      };
    };
  };
  insert: (table: typeof movimientos) => {
    values: (values: typeof movimientos.$inferInsert) => {
      returning: () => Promise<MovimientoRow[]>;
    };
  };
  update: (table: typeof movimientos) => {
    set: (values: Partial<typeof movimientos.$inferInsert> & { updatedAt: Date }) => {
      where: (condition: unknown) => {
        returning: () => Promise<MovimientoRow[]>;
      };
    };
  };
  delete: (table: typeof movimientos) => {
    where: (condition: unknown) => {
      returning: (selection: { id: typeof movimientos.id }) => Promise<Array<{ id: string }>>;
    };
  };
};

export class MovimientoServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export function createMovimientosService(database: MovimientosDb) {
  return {
    async listMovimientos(
      userId: string,
      query: { month?: string },
    ): Promise<MovimientoListResponse> {
      const { month } = movimientoListQuerySchema.parse(query);

      if (month === 'all') {
        const rows = await database
          .select()
          .from(movimientos)
          .where(eq(movimientos.userId, userId))
          .orderBy(desc(movimientos.date), desc(movimientos.time));

        return { items: rows.map(mapMovimientoRecord) };
      }

      const targetMonth = month ?? getCurrentMonthKey();
      const { startDate, endDate } = getMonthRange(targetMonth);

      const rows = await database
        .select()
        .from(movimientos)
        .where(
          and(
            eq(movimientos.userId, userId),
            gte(movimientos.date, startDate),
            lt(movimientos.date, endDate),
          ),
        )
        .orderBy(desc(movimientos.date), desc(movimientos.time));

      return { month: targetMonth, items: rows.map(mapMovimientoRecord) };
    },

    async createMovimiento(userId: string, input: unknown): Promise<Movimiento> {
      const parsedInput = movimientoCreateSchema.parse(input);

      const [created] = await database
        .insert(movimientos)
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
        throw new MovimientoServiceError(MOVIMIENTOS_SERVICE.createFailed, 500);
      }

      return mapMovimientoRecord(created);
    },

    async updateMovimiento(
      userId: string,
      movimientoId: string,
      input: unknown,
    ): Promise<Movimiento> {
      const parsedInput = movimientoUpdateSchema.parse(input);

      const [updated] = await database
        .update(movimientos)
        .set({
          type: parsedInput.type,
          amount: parsedInput.amount.toFixed(2),
          date: parsedInput.date,
          time: getCurrentTimeKey(),
          category: parsedInput.category,
          note: normalizeOptionalText(parsedInput.note),
          updatedAt: new Date(),
        })
        .where(and(eq(movimientos.id, movimientoId), eq(movimientos.userId, userId)))
        .returning();

      if (!updated) {
        throw new MovimientoServiceError(MOVIMIENTOS_SERVICE.notFound, 404);
      }

      return mapMovimientoRecord(updated);
    },

    async getMovimiento(userId: string, movimientoId: string): Promise<Movimiento> {
      const rows = await database
        .select()
        .from(movimientos)
        .where(and(eq(movimientos.id, movimientoId), eq(movimientos.userId, userId)))
        .orderBy(desc(movimientos.createdAt));

      const row = rows[0];

      if (!row) {
        throw new MovimientoServiceError(MOVIMIENTOS_SERVICE.notFound, 404);
      }

      return mapMovimientoRecord(row);
    },

    async deleteMovimiento(userId: string, movimientoId: string): Promise<void> {
      const [deleted] = await database
        .delete(movimientos)
        .where(and(eq(movimientos.id, movimientoId), eq(movimientos.userId, userId)))
        .returning({ id: movimientos.id });

      if (!deleted) {
        throw new MovimientoServiceError(MOVIMIENTOS_SERVICE.notFound, 404);
      }
    },
  };
}

export async function listMovimientos(userId: string, query: { month?: string }) {
  const service = createMovimientosService(await getMovimientosDb());
  return service.listMovimientos(userId, query);
}

export async function getMovimiento(userId: string, movimientoId: string) {
  const service = createMovimientosService(await getMovimientosDb());
  return service.getMovimiento(userId, movimientoId);
}

export async function listAvailableMonths(userId: string): Promise<string[]> {
  const monthExpr = sql<string>`to_char(${movimientos.date}, 'YYYY-MM')`;
  const monthsDb = await getAvailableMonthsDb();

  const rows = await monthsDb
    .select({ month: monthExpr })
    .from(movimientos)
    .where(eq(movimientos.userId, userId))
    .groupBy(monthExpr)
    .orderBy(desc(monthExpr));

  return rows.map((row) => row.month);
}

export async function createMovimiento(userId: string, input: unknown) {
  const service = createMovimientosService(await getMovimientosDb());
  return service.createMovimiento(userId, input);
}

export async function updateMovimiento(userId: string, movimientoId: string, input: unknown) {
  const service = createMovimientosService(await getMovimientosDb());
  return service.updateMovimiento(userId, movimientoId, input);
}

export async function deleteMovimiento(userId: string, movimientoId: string) {
  const service = createMovimientosService(await getMovimientosDb());
  return service.deleteMovimiento(userId, movimientoId);
}

async function getMovimientosDb(): Promise<MovimientosDb> {
  const { db } = await import('../lib/db.js');

  // HACK: Drizzle's inferred DB type is not exported from the shared db layer yet.
  return db as unknown as MovimientosDb;
}

async function getAvailableMonthsDb(): Promise<AvailableMonthsDb> {
  const { db } = await import('../lib/db.js');

  // HACK: Keep this narrow cast local until the shared db package exports the typed DB client.
  return db as unknown as AvailableMonthsDb;
}

function mapMovimientoRecord(record: MovimientoRow): Movimiento {
  return movimientoSchema.parse({
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
    throw new MovimientoServiceError(MOVIMIENTOS_SERVICE.invalidDate, 500);
  }

  return parsed.toISOString();
}
