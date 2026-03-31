import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { createCorsMiddleware } from './middleware/cors';
import { health } from './routes/health';

const app = new Hono();

// CORS middleware
const appUrl = process.env.APP_URL ?? 'http://localhost:5173';
app.use('*', createCorsMiddleware(appUrl));

// Routes
app.route('/', health);

// Dev server
const port = Number(process.env.API_PORT) || 3001;

console.log(`RumboApp API starting on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

// Vercel adapter export
export default app;
