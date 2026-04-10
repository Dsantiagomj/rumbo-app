import { createAuthClient } from 'better-auth/react';
import { env } from '@/shared/lib/env';

export const authClient = createAuthClient({
  baseURL: env.apiUrl || undefined,
});

export const { signIn, signUp, signOut, useSession } = authClient;
