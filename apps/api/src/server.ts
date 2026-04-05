import { serve } from '@hono/node-server';
import app from './index.js';
import { env } from './lib/env.js';

console.log(`RumboApp API starting on http://localhost:${env.API_PORT}`);

serve({
  fetch: app.fetch,
  port: env.API_PORT,
});
