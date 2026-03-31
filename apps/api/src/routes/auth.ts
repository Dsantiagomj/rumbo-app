import { Hono } from 'hono';
import { auth } from '../lib/auth';

export const authRoutes = new Hono();

authRoutes.on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw);
});
