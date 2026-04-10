import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { transactions } from '@rumbo/db/schema';
import {
  createTransactionsService,
  TransactionServiceError,
  type TransactionsDb,
} from './transactions.js';

type TransactionRow = typeof transactions.$inferSelect;

test('createTransaction stores a valid transaction for the authenticated user', async () => {
  const userId = 'user-1';
  const date = getTodayDateKey();
  let insertedValues: Record<string, unknown> | undefined;

  const db = createMockDb();
  db.insert = ((_table) => ({
    values: (values) => {
      insertedValues = values as Record<string, unknown>;

      return {
        returning: async () => [createRow({ userId, date })],
      };
    },
  })) as TransactionsDb['insert'];

  const service = createTransactionsService(db);
  const result = await service.createTransaction(userId, {
    type: 'expense',
    amount: 123.45,
    date,
    category: 'Comida',
    note: '  Supermercado  ',
  });

  assert.equal(insertedValues?.userId, userId);
  assert.equal(insertedValues?.amount, '123.45');
  assert.equal(insertedValues?.note, 'Supermercado');
  assert.equal(result.amount, 123.45);
  assert.equal(result.category, 'Comida');
  assert.equal(result.note, 'Supermercado');
});

test('createTransaction rejects a future date before touching the database', async () => {
  const db = createMockDb();
  let insertCalled = false;

  db.insert = ((table) => {
    insertCalled = true;
    throw new Error(`Unexpected insert for ${String(table)}`);
  }) as TransactionsDb['insert'];

  const service = createTransactionsService(db);

  await assert.rejects(
    service.createTransaction('user-1', {
      type: 'expense',
      amount: 10,
      date: getFutureDateKey(),
      category: 'Comida',
    }),
    (error) => {
      assert.equal(error instanceof Error, true);
      assert.match(String(error), /La fecha no puede ser futura/);
      return true;
    },
  );

  assert.equal(insertCalled, false);
});

test('updateTransaction allows updating a transaction owned by the user', async () => {
  const userId = 'user-1';
  const transactionId = '11111111-1111-4111-8111-111111111111';
  let updatedValues: Record<string, unknown> | undefined;

  const db = createMockDb();
  db.update = ((_table: unknown) => ({
    set: (values: unknown) => {
      updatedValues = values as Record<string, unknown>;

      return {
        where: () => ({
          returning: async () => [
            createRow({ id: transactionId, userId, category: 'Servicios', note: 'Pago luz' }),
          ],
        }),
      };
    },
  })) as unknown as TransactionsDb['update'];

  const service = createTransactionsService(db);
  const result = await service.updateTransaction(userId, transactionId, {
    type: 'expense',
    amount: 55.2,
    date: getTodayDateKey(),
    category: 'Servicios',
    note: '  Pago luz  ',
  });

  assert.equal(updatedValues?.amount, '55.20');
  assert.equal(updatedValues?.note, 'Pago luz');
  assert.ok(updatedValues?.updatedAt instanceof Date);
  assert.equal(result.id, transactionId);
  assert.equal(result.category, 'Servicios');
  assert.equal(result.note, 'Pago luz');
});

test('updateTransaction rejects invalid updates and preserves the stored record', async () => {
  const db = createMockDb();
  let updateCalled = false;

  db.update = ((_table: unknown) => {
    updateCalled = true;
    throw new Error('Unexpected update');
  }) as TransactionsDb['update'];

  const service = createTransactionsService(db);

  await assert.rejects(
    service.updateTransaction('user-1', '11111111-1111-4111-8111-111111111111', {
      type: 'expense',
      amount: 0,
      date: getTodayDateKey(),
      category: 'Comida',
    }),
    (error) => {
      assert.equal(error instanceof Error, true);
      assert.match(String(error), /El monto debe ser mayor a 0/);
      return true;
    },
  );

  assert.equal(updateCalled, false);
});

test('deleteTransaction removes a transaction owned by the user', async () => {
  let deletedWhereCalled = false;
  const db = createMockDb();

  db.delete = ((_table: unknown) => ({
    where: () => {
      deletedWhereCalled = true;

      return {
        returning: async () => [{ id: '11111111-1111-4111-8111-111111111111' }],
      };
    },
  })) as unknown as TransactionsDb['delete'];

  const service = createTransactionsService(db);
  await service.deleteTransaction('user-1', '11111111-1111-4111-8111-111111111111');

  assert.equal(deletedWhereCalled, true);
});

test('deleteTransaction rejects deleting a missing or foreign transaction', async () => {
  const db = createMockDb();

  db.delete = ((_table: unknown) => ({
    where: () => ({
      returning: async () => [],
    }),
  })) as unknown as TransactionsDb['delete'];

  const service = createTransactionsService(db);

  await assert.rejects(
    service.deleteTransaction('user-1', '11111111-1111-4111-8111-111111111111'),
    (error) => {
      assert.equal(error instanceof TransactionServiceError, true);
      assert.equal((error as TransactionServiceError).status, 404);
      assert.match(String(error), /Transacción no encontrada/);
      return true;
    },
  );
});

test('listTransactions returns the current month when no filter is provided', async () => {
  const currentMonth = getCurrentMonthKey();
  const db = createMockDb();

  db.select = (() => ({
    from: () => ({
      where: () => ({
        orderBy: async () => [createRow({ date: `${currentMonth}-05` })],
      }),
    }),
  })) as unknown as TransactionsDb['select'];

  const service = createTransactionsService(db);
  const result = await service.listTransactions('user-1', {});

  assert.equal(result.month, currentMonth);
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0]?.date, `${currentMonth}-05`);
});

test('listTransactions normalizes string timestamps returned by the DB driver', async () => {
  const db = createMockDb();

  db.select = (() => ({
    from: () => ({
      where: () => ({
        orderBy: async () => [
          createRow({
            createdAt: '2026-04-06T12:00:00.000Z' as unknown as Date,
            updatedAt: '2026-04-06T13:00:00.000Z' as unknown as Date,
          }),
        ],
      }),
    }),
  })) as unknown as TransactionsDb['select'];

  const service = createTransactionsService(db);
  const result = await service.listTransactions('user-1', { month: '2026-04' });

  assert.equal(result.items[0]?.createdAt, '2026-04-06T12:00:00.000Z');
  assert.equal(result.items[0]?.updatedAt, '2026-04-06T13:00:00.000Z');
});

function createMockDb(): TransactionsDb {
  return {
    select: (() => {
      throw new Error('select mock not configured');
    }) as TransactionsDb['select'],
    insert: (() => {
      throw new Error('insert mock not configured');
    }) as TransactionsDb['insert'],
    update: (() => {
      throw new Error('update mock not configured');
    }) as TransactionsDb['update'],
    delete: (() => {
      throw new Error('delete mock not configured');
    }) as TransactionsDb['delete'],
  };
}

function createRow(overrides: Partial<TransactionRow> = {}): TransactionRow {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    userId: 'user-1',
    type: 'expense',
    amount: '123.45',
    date: getTodayDateKey(),
    time: '12:00:00',
    category: 'Comida',
    note: 'Supermercado',
    createdAt: new Date('2026-04-06T12:00:00.000Z'),
    updatedAt: new Date('2026-04-06T12:00:00.000Z'),
    ...overrides,
  };
}

function getCurrentMonthKey() {
  return getTodayDateKey().slice(0, 7);
}

function getTodayDateKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getFutureDateKey() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
