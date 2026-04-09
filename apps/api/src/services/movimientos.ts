import { movimientos } from '@rumbo/db/schema';
import {
  type Movimiento,
  type MovimientoListResponse,
  movimientoCreateSchema,
  movimientoListQuerySchema,
  movimientoSchema,
  movimientoUpdateSchema,
} from '@rumbo/shared';
import { and, desc, eq, gte, lt } from 'drizzle-orm';

type MovimientoRow = typeof movimientos.$inferSelect;

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
      const resolvedMonth = month ?? getCurrentMonthKey();
      const { startDate, endDate } = getMonthRange(resolvedMonth);

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
        .orderBy(desc(movimientos.date), desc(movimientos.createdAt));

      return {
        month: resolvedMonth,
        items: rows.map(mapMovimientoRecord),
      };
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
          category: parsedInput.category,
          note: normalizeOptionalText(parsedInput.note),
        })
        .returning();

      if (!created) {
        throw new MovimientoServiceError('No se pudo crear el movimiento', 500);
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
          category: parsedInput.category,
          note: normalizeOptionalText(parsedInput.note),
          updatedAt: new Date(),
        })
        .where(and(eq(movimientos.id, movimientoId), eq(movimientos.userId, userId)))
        .returning();

      if (!updated) {
        throw new MovimientoServiceError('Movimiento no encontrado', 404);
      }

      return mapMovimientoRecord(updated);
    },

    async deleteMovimiento(userId: string, movimientoId: string): Promise<void> {
      const [deleted] = await database
        .delete(movimientos)
        .where(and(eq(movimientos.id, movimientoId), eq(movimientos.userId, userId)))
        .returning({ id: movimientos.id });

      if (!deleted) {
        throw new MovimientoServiceError('Movimiento no encontrado', 404);
      }
    },
  };
}

export async function listMovimientos(userId: string, query: { month?: string }) {
  const service = createMovimientosService(await getMovimientosDb());
  return service.listMovimientos(userId, query);
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

  return db as unknown as MovimientosDb;
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

function toIsoDateTimeString(value: Date | string) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new MovimientoServiceError('No se pudo leer la fecha del movimiento', 500);
  }

  return parsed.toISOString();
}
