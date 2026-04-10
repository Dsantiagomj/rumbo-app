import {
  transactionCreateSchema,
  transactionDeleteResponseSchema,
  transactionIdParamsSchema,
  transactionListQuerySchema,
  transactionListResponseSchema,
  transactionMutationResponseSchema,
  transactionUpdateSchema,
} from '@rumbo/shared';
import { type Context, Hono } from 'hono';
import { ZodError } from 'zod';
import { type AuthVariables, authMiddleware } from '../middleware/auth.js';
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  listAvailableMonths,
  listTransactions,
  TransactionServiceError,
  updateTransaction,
} from '../services/transactions.js';
import { TRANSACTIONS_SERVICE } from '../services/transactions-strings.js';

type TransactionsRouteService = {
  listTransactions: typeof listTransactions;
  getTransaction: typeof getTransaction;
  createTransaction: typeof createTransaction;
  updateTransaction: typeof updateTransaction;
  deleteTransaction: typeof deleteTransaction;
};

type CreateTransactionsRoutesOptions = {
  authMiddleware?: typeof authMiddleware;
  service?: TransactionsRouteService;
};

const defaultTransactionsRouteService: TransactionsRouteService = {
  listTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};

export function createTransactionsRoutes(options: CreateTransactionsRoutesOptions = {}) {
  const transactionsRoutes = new Hono<{ Variables: AuthVariables }>();
  const routeAuthMiddleware = options.authMiddleware ?? authMiddleware;
  const service = options.service ?? defaultTransactionsRouteService;

  transactionsRoutes.use('/transactions', routeAuthMiddleware);
  transactionsRoutes.use('/transactions/*', routeAuthMiddleware);

  transactionsRoutes.get('/transactions/months', async (c) => {
    try {
      const user = c.get('user');
      const months = await listAvailableMonths(user.id);

      return c.json({ months });
    } catch (error) {
      return handleRouteError(c, error);
    }
  });

  transactionsRoutes.get('/transactions/:id', async (c) => {
    try {
      const user = c.get('user');
      const { id } = transactionIdParamsSchema.parse(c.req.param());
      const item = await service.getTransaction(user.id, id);

      return c.json(transactionMutationResponseSchema.parse({ item }));
    } catch (error) {
      return handleRouteError(c, error);
    }
  });

  transactionsRoutes.get('/transactions', async (c) => {
    try {
      const user = c.get('user');
      const query = transactionListQuerySchema.parse(c.req.query());
      const response = await service.listTransactions(user.id, query);

      return c.json(transactionListResponseSchema.parse(response));
    } catch (error) {
      return handleRouteError(c, error);
    }
  });

  transactionsRoutes.post('/transactions', async (c) => {
    try {
      const user = c.get('user');
      const payload = transactionCreateSchema.parse(await c.req.json());
      const item = await service.createTransaction(user.id, payload);

      return c.json(transactionMutationResponseSchema.parse({ item }), 201);
    } catch (error) {
      return handleRouteError(c, error);
    }
  });

  transactionsRoutes.patch('/transactions/:id', async (c) => {
    try {
      const user = c.get('user');
      const { id } = transactionIdParamsSchema.parse(c.req.param());
      const payload = transactionUpdateSchema.parse(await c.req.json());
      const item = await service.updateTransaction(user.id, id, payload);

      return c.json(transactionMutationResponseSchema.parse({ item }));
    } catch (error) {
      return handleRouteError(c, error);
    }
  });

  transactionsRoutes.delete('/transactions/:id', async (c) => {
    try {
      const user = c.get('user');
      const { id } = transactionIdParamsSchema.parse(c.req.param());

      await service.deleteTransaction(user.id, id);

      return c.json(transactionDeleteResponseSchema.parse({ success: true }));
    } catch (error) {
      return handleRouteError(c, error);
    }
  });

  return transactionsRoutes;
}

export const transactionsRoutes = createTransactionsRoutes();

function handleRouteError(c: Context<{ Variables: AuthVariables }>, error: unknown) {
  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? TRANSACTIONS_SERVICE.invalidRequest;
    return c.json({ message }, 400);
  }

  if (error instanceof TransactionServiceError) {
    c.status(error.status === 404 ? 404 : 500);
    return c.json({ message: error.message });
  }

  return c.json({ message: TRANSACTIONS_SERVICE.unexpectedError }, 500);
}
