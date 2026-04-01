import { authClient } from '@/shared/lib/auth-client';

interface RequestPasswordResetOptions {
  email: string;
  redirectTo: string;
}

export async function requestPasswordReset({ email, redirectTo }: RequestPasswordResetOptions) {
  const { error } = await authClient.requestPasswordReset({ email, redirectTo });

  if (error) {
    throw new Error(error.message ?? 'Request failed');
  }
}
