import { serve } from '@hono/node-server';
import app from './index.js';

const port = Number(process.env.API_PORT) || 3001;

console.log(`RumboApp API starting on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
