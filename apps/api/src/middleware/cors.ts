import { cors } from 'hono/cors';

export function createCorsMiddleware(appUrl: string) {
  const origins = appUrl ? appUrl.split(',').map((o) => o.trim()) : [];

  return cors({
    origin: origins,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  });
}
