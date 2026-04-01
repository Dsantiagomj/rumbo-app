import { api } from '@/shared/lib/api-client';

interface RequestPasswordResetOptions {
  email: string;
  redirectTo: string;
}

export async function requestPasswordReset({ email, redirectTo }: RequestPasswordResetOptions) {
  return api.post('/api/auth/forget-password', { email, redirectTo });
}
