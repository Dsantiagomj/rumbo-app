import { handle } from '@hono/node-server/vercel';
import app from '../apps/api/src/index';

export default handle(app);
