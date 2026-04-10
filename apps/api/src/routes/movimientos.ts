import {
  movimientoCreateSchema,
  movimientoDeleteResponseSchema,
  movimientoIdParamsSchema,
  movimientoListQuerySchema,
  movimientoListResponseSchema,
  movimientoMutationResponseSchema,
  movimientoUpdateSchema,
} from '@rumbo/shared';
import { type Context, Hono } from 'hono';
import { ZodError } from 'zod';
import { type AuthVariables, authMiddleware } from '../middleware/auth.js';
import {
  createMovimiento,
  deleteMovimiento,
  getMovimiento,
  listAvailableMonths,
  listMovimientos,
  MovimientoServiceError,
  updateMovimiento,
} from '../services/movimientos.js';

type MovimientosRouteService = {
  listMovimientos: typeof listMovimientos;
  getMovimiento: typeof getMovimiento;
  createMovimiento: typeof createMovimiento;
  updateMovimiento: typeof updateMovimiento;
  deleteMovimiento: typeof deleteMovimiento;
};

type CreateMovimientosRoutesOptions = {
  authMiddleware?: typeof authMiddleware;
  service?: MovimientosRouteService;
};

const defaultMovimientosRouteService: MovimientosRouteService = {
  listMovimientos,
  getMovimiento,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
};

export function createMovimientosRoutes(options: CreateMovimientosRoutesOptions = {}) {
  const movimientosRoutes = new Hono<{ Variables: AuthVariables }>();
  const routeAuthMiddleware = options.authMiddleware ?? authMiddleware;
  const service = options.service ?? defaultMovimientosRouteService;

  movimientosRoutes.use('/movimientos', routeAuthMiddleware);
  movimientosRoutes.use('/movimientos/*', routeAuthMiddleware);

  movimientosRoutes.get('/movimientos/months', async (c) => {
    try {
      const user = c.get('user');
      const months = await listAvailableMonths(user.id);

      return c.json({ months });
    } catch (error) {
      return handleRouteError(c, error);
    }
  });

  movimientosRoutes.get('/movimientos/:id', async (c) => {
    try {
      const user = c.get('user');
      const { id } = movimientoIdParamsSchema.parse(c.req.param());
      const item = await service.getMovimiento(user.id, id);

      return c.json(movimientoMutationResponseSchema.parse({ item }));
    } catch (error) {
      return handleRouteError(c, error);
    }
  });

  movimientosRoutes.get('/movimientos', async (c) => {
    try {
      const user = c.get('user');
      const query = movimientoListQuerySchema.parse(c.req.query());
      const response = await service.listMovimientos(user.id, query);

      return c.json(movimientoListResponseSchema.parse(response));
    } catch (error) {
      return handleRouteError(c, error);
    }
  });

  movimientosRoutes.post('/movimientos', async (c) => {
    try {
      const user = c.get('user');
      const payload = movimientoCreateSchema.parse(await c.req.json());
      const item = await service.createMovimiento(user.id, payload);

      return c.json(movimientoMutationResponseSchema.parse({ item }), 201);
    } catch (error) {
      return handleRouteError(c, error);
    }
  });

  movimientosRoutes.patch('/movimientos/:id', async (c) => {
    try {
      const user = c.get('user');
      const { id } = movimientoIdParamsSchema.parse(c.req.param());
      const payload = movimientoUpdateSchema.parse(await c.req.json());
      const item = await service.updateMovimiento(user.id, id, payload);

      return c.json(movimientoMutationResponseSchema.parse({ item }));
    } catch (error) {
      return handleRouteError(c, error);
    }
  });

  movimientosRoutes.delete('/movimientos/:id', async (c) => {
    try {
      const user = c.get('user');
      const { id } = movimientoIdParamsSchema.parse(c.req.param());

      await service.deleteMovimiento(user.id, id);

      return c.json(movimientoDeleteResponseSchema.parse({ success: true }));
    } catch (error) {
      return handleRouteError(c, error);
    }
  });

  return movimientosRoutes;
}

export const movimientosRoutes = createMovimientosRoutes();

function handleRouteError(c: Context<{ Variables: AuthVariables }>, error: unknown) {
  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? 'Solicitud inválida';
    return c.json({ message }, 400);
  }

  if (error instanceof MovimientoServiceError) {
    c.status(error.status === 404 ? 404 : 500);
    return c.json({ message: error.message });
  }

  return c.json({ message: 'Ocurrió un error inesperado' }, 500);
}
