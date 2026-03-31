import { Hono } from 'hono';
import { createCorsMiddleware } from './middleware/cors';
import { authRoutes } from './routes/auth';
import { health } from './routes/health';

const app = new Hono().basePath('/api');

// CORS middleware
const appUrl = process.env.APP_URL ?? 'http://localhost:5173';
app.use('*', createCorsMiddleware(appUrl));

// Routes
app.route('/', health);
app.route('/', authRoutes);

export default app;
