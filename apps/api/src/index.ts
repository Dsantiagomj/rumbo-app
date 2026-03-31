import { Hono } from 'hono';
import { createCorsMiddleware } from './middleware/cors';
import { health } from './routes/health';

const app = new Hono().basePath('/api');

// CORS middleware
const appUrl = process.env.APP_URL ?? 'http://localhost:5173';
app.use('*', createCorsMiddleware(appUrl));

// Routes
app.route('/', health);

export default app;
