import type { Session, User } from 'better-auth';
import type { Context, MiddlewareHandler, Next } from 'hono';

export type AuthVariables = {
  user: User;
  session: Session;
};

type AuthSessionResult = {
  user: User;
  session: Session;
};

type AuthClient = {
  api: {
    getSession: (input: { headers: Headers }) => Promise<AuthSessionResult | null>;
  };
};

export function createAuthMiddleware(authClient: AuthClient): MiddlewareHandler<{
  Variables: AuthVariables;
}> {
  return async function authMiddleware(c: Context<{ Variables: AuthVariables }>, next: Next) {
    const session = await authClient.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    c.set('user', session.user);
    c.set('session', session.session);

    return next();
  };
}

export const authMiddleware: MiddlewareHandler<{ Variables: AuthVariables }> = async (c, next) => {
  const { auth } = await import('../lib/auth.js');

  return createAuthMiddleware(auth)(c, next);
};
