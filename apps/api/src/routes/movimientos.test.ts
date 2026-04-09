import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  type Movimiento,
  type MovimientoCreateInput,
  type MovimientoListQuery,
  type MovimientoListResponse,
  type MovimientoUpdateInput,
  movimientoDeleteResponseSchema,
  movimientoListResponseSchema,
  movimientoMutationResponseSchema,
} from '@rumbo/shared';
import type { Session, User } from 'better-auth';
import { Hono } from 'hono';
import { createAuthMiddleware } from '../middleware/auth.js';
import { MovimientoServiceError } from '../services/movimientos.js';
import { createMovimientosRoutes } from './movimientos.js';

type RouteService = {
  listMovimientos: (userId: string, query: MovimientoListQuery) => Promise<MovimientoListResponse>;
  getMovimiento: (userId: string, movimientoId: string) => Promise<Movimiento>;
  createMovimiento: (userId: string, input: unknown) => Promise<Movimiento>;
  updateMovimiento: (userId: string, movimientoId: string, input: unknown) => Promise<Movimiento>;
  deleteMovimiento: (userId: string, movimientoId: string) => Promise<void>;
};

type InMemoryMovimientoRecord = {
  userId: string;
  item: Movimiento;
};

test('GET /api/movimientos rejects unauthenticated requests', async () => {
  const app = createTestApp({
    authSessionResolver: async () => null,
  });

  const response = await app.request('/api/movimientos');

  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: 'Unauthorized' });
});

test('POST /api/movimientos returns 400 for invalid payloads before touching the service', async () => {
  let createCalled = false;
  const app = createTestApp({
    authSessionResolver: async ({ headers }) => createSession(headers.get('x-user-id') ?? 'user-1'),
    service: {
      createMovimiento: async () => {
        createCalled = true;
        throw new Error('Unexpected create');
      },
    },
  });

  const response = await app.request('/api/movimientos', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-user-id': 'user-1',
    },
    body: JSON.stringify({
      type: 'expense',
      amount: 0,
      date: getTodayDateKey(),
      category: 'Comida',
    }),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    message: 'El monto debe ser mayor a 0',
  });
  assert.equal(createCalled, false);
});

test('POST /api/movimientos returns 201 with the mutation payload shape', async () => {
  const store = createInMemoryStore();
  const app = createTestApp({
    authSessionResolver: async ({ headers }) => createSession(headers.get('x-user-id') ?? 'user-1'),
    service: store.service,
  });

  const response = await app.request('/api/movimientos', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-user-id': 'user-1',
    },
    body: JSON.stringify({
      type: 'expense',
      amount: 123.45,
      date: getTodayDateKey(),
      category: 'Comida',
      note: 'Supermercado',
    }),
  });

  assert.equal(response.status, 201);
  const payload = movimientoMutationResponseSchema.parse(await response.json());

  assert.equal(payload.item.amount, 123.45);
  assert.equal(payload.item.category, 'Comida');
  assert.equal(payload.item.note, 'Supermercado');
});

test('GET /api/movimientos filters the list by authenticated user and requested month', async () => {
  const store = createInMemoryStore();
  const currentMonth = getTodayDateKey().slice(0, 7);
  const previousMonthDate = getPreviousMonthDateKey();

  await store.service.createMovimiento('user-1', {
    type: 'expense',
    amount: 25,
    date: `${currentMonth}-05`,
    category: 'Comida',
    note: 'Visible',
  });
  await store.service.createMovimiento('user-1', {
    type: 'expense',
    amount: 30,
    date: previousMonthDate,
    category: 'Transporte',
    note: 'Old month',
  });
  await store.service.createMovimiento('user-2', {
    type: 'expense',
    amount: 40,
    date: `${currentMonth}-10`,
    category: 'Servicios',
    note: 'Other user',
  });

  const app = createTestApp({
    authSessionResolver: async ({ headers }) => createSession(headers.get('x-user-id') ?? 'user-1'),
    service: store.service,
  });

  const response = await app.request(`/api/movimientos?month=${currentMonth}`, {
    headers: { 'x-user-id': 'user-1' },
  });

  assert.equal(response.status, 200);
  const payload = movimientoListResponseSchema.parse(await response.json());

  assert.equal(payload.month, currentMonth);
  assert.equal(payload.items.length, 1);
  assert.equal(payload.items[0]?.note, 'Visible');
  assert.equal(payload.items[0]?.date, `${currentMonth}-05`);
});

test('PATCH /api/movimientos/:id returns 200 with the updated payload shape', async () => {
  const store = createInMemoryStore();
  const today = getTodayDateKey();
  const created = await store.service.createMovimiento('user-1', {
    type: 'expense',
    amount: 60,
    date: today,
    category: 'Transporte',
    note: 'Antes',
  });

  const app = createTestApp({
    authSessionResolver: async ({ headers }) => createSession(headers.get('x-user-id') ?? 'user-1'),
    service: store.service,
  });

  const response = await app.request(`/api/movimientos/${created.id}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      'x-user-id': 'user-1',
    },
    body: JSON.stringify({
      type: 'expense',
      amount: 75.5,
      date: today,
      category: 'Servicios',
      note: '  Después  ',
    }),
  });

  assert.equal(response.status, 200);
  const payload = movimientoMutationResponseSchema.parse(await response.json());

  assert.equal(payload.item.id, created.id);
  assert.equal(payload.item.amount, 75.5);
  assert.equal(payload.item.category, 'Servicios');
  assert.equal(payload.item.note, 'Después');
});

test('DELETE /api/movimientos removes the item from a follow-up month list', async () => {
  const store = createInMemoryStore();
  const currentMonth = getTodayDateKey().slice(0, 7);
  const created = await store.service.createMovimiento('user-1', {
    type: 'expense',
    amount: 88,
    date: `${currentMonth}-12`,
    category: 'Salud',
    note: 'To delete',
  });

  const app = createTestApp({
    authSessionResolver: async ({ headers }) => createSession(headers.get('x-user-id') ?? 'user-1'),
    service: store.service,
  });

  const deleteResponse = await app.request(`/api/movimientos/${created.id}`, {
    method: 'DELETE',
    headers: { 'x-user-id': 'user-1' },
  });
  const listResponse = await app.request(`/api/movimientos?month=${currentMonth}`, {
    headers: { 'x-user-id': 'user-1' },
  });

  assert.equal(deleteResponse.status, 200);
  assert.deepEqual(movimientoDeleteResponseSchema.parse(await deleteResponse.json()), {
    success: true,
  });
  assert.equal(listResponse.status, 200);
  const listPayload = movimientoListResponseSchema.parse(await listResponse.json());

  assert.equal(listPayload.items.length, 0);
});

test('DELETE /api/movimientos/:id returns 404 for missing or foreign-owner deletes', async (t) => {
  for (const movimientoId of [
    '11111111-1111-4111-8111-111111111111',
    '22222222-2222-4222-8222-222222222222',
  ]) {
    await t.test(`returns 404 for ${movimientoId}`, async () => {
      const app = createTestApp({
        authSessionResolver: async ({ headers }) =>
          createSession(headers.get('x-user-id') ?? 'user-1'),
        service: {
          deleteMovimiento: async () => {
            throw new MovimientoServiceError('Movimiento no encontrado', 404);
          },
        },
      });

      const response = await app.request(`/api/movimientos/${movimientoId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': 'user-1' },
      });

      assert.equal(response.status, 404);
      assert.deepEqual(await response.json(), { message: 'Movimiento no encontrado' });
    });
  }
});

function createTestApp(options: {
  authSessionResolver: (input: {
    headers: Headers;
  }) => Promise<{ user: User; session: Session } | null>;
  service?: Partial<RouteService>;
}) {
  const app = new Hono().basePath('/api');
  const store = createInMemoryStore();

  app.route(
    '/',
    createMovimientosRoutes({
      authMiddleware: createAuthMiddleware({
        api: {
          getSession: options.authSessionResolver,
        },
      }),
      service: {
        ...store.service,
        ...options.service,
      },
    }),
  );

  return app;
}

function createInMemoryStore() {
  const records: InMemoryMovimientoRecord[] = [];

  const service: RouteService = {
    async listMovimientos(userId, query) {
      const month = query.month ?? getTodayDateKey().slice(0, 7);

      return {
        month,
        items: records
          .filter((record) => record.userId === userId && record.item.date.startsWith(month))
          .map((record) => record.item)
          .sort((left, right) => right.date.localeCompare(left.date)),
      };
    },
    async createMovimiento(userId, input) {
      const payload = input as MovimientoCreateInput;
      const id = createMovimientoId(records.length + 1);
      const timestamp = new Date('2026-04-07T12:00:00.000Z').toISOString();
      const item: Movimiento = {
        id,
        type: payload.type,
        amount: payload.amount,
        date: payload.date,
        category: payload.category,
        note: payload.note?.trim() || null,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      records.push({ userId, item });
      return item;
    },
    async updateMovimiento(userId, movimientoId, input) {
      const payload = input as MovimientoUpdateInput;
      const record = records.find(
        (currentRecord) =>
          currentRecord.userId === userId && currentRecord.item.id === movimientoId,
      );

      if (!record) {
        throw new Error('Unexpected missing record in test store');
      }

      const item = record.item;
      item.type = payload.type;
      item.amount = payload.amount;
      item.date = payload.date;
      item.category = payload.category;
      item.note = payload.note?.trim() || null;
      item.updatedAt = new Date('2026-04-07T13:00:00.000Z').toISOString();

      return item;
    },
    async getMovimiento(userId, movimientoId) {
      const record = records.find(
        (currentRecord) =>
          currentRecord.userId === userId && currentRecord.item.id === movimientoId,
      );

      if (!record) {
        throw new Error('Movimiento no encontrado');
      }

      return record.item;
    },
    async deleteMovimiento(userId, movimientoId) {
      const index = records.findIndex(
        (record) => record.userId === userId && record.item.id === movimientoId,
      );

      if (index >= 0) {
        records.splice(index, 1);
      }
    },
  };

  return { service };
}

function createSession(userId: string) {
  return {
    user: {
      id: userId,
      email: `${userId}@example.com`,
      name: userId,
      emailVerified: true,
      createdAt: new Date('2026-04-07T12:00:00.000Z'),
      updatedAt: new Date('2026-04-07T12:00:00.000Z'),
    } as User,
    session: {
      id: `session-${userId}`,
      userId,
      token: `token-${userId}`,
      expiresAt: new Date('2026-04-08T12:00:00.000Z'),
      createdAt: new Date('2026-04-07T12:00:00.000Z'),
      updatedAt: new Date('2026-04-07T12:00:00.000Z'),
      ipAddress: null,
      userAgent: null,
    } as Session,
  };
}

function getTodayDateKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getPreviousMonthDateKey() {
  const today = new Date();
  const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 15);
  const year = previousMonth.getFullYear();
  const month = String(previousMonth.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}-15`;
}

function createMovimientoId(seed: number) {
  return `00000000-0000-4000-8000-${String(seed).padStart(12, '0')}`;
}
