import { Hono } from 'hono';
import { env } from './lib/env.js';
import { createCorsMiddleware } from './middleware/cors.js';
import { authRoutes } from './routes/auth.js';
import { health } from './routes/health.js';
import { transactionsRoutes } from './routes/transactions.js';

const app = new Hono().basePath('/api');

// CORS middleware
app.use('*', createCorsMiddleware(env.APP_URL));

// Routes
app.route('/', health);
app.route('/', authRoutes);
app.route('/', transactionsRoutes);

export default app;
