import type { Session, User } from 'better-auth';
import type { Context, Next } from 'hono';
import { auth } from '../lib/auth.js';

export type AuthVariables = {
  user: User;
  session: Session;
};

export async function authMiddleware(c: Context<{ Variables: AuthVariables }>, next: Next) {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('user', session.user);
  c.set('session', session.session);

  return next();
}
