import { Hono } from 'hono';
import { auth } from '../lib/auth.js';

export const authRoutes = new Hono();

authRoutes.on(['POST', 'GET', 'PUT', 'DELETE', 'PATCH'], '/auth/*', (c) => {
  return auth.handler(c.req.raw);
});
