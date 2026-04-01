const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

interface RequestPasswordResetOptions {
  email: string;
  redirectTo: string;
}

export async function requestPasswordReset({ email, redirectTo }: RequestPasswordResetOptions) {
  const response = await fetch(`${API_BASE_URL}/api/auth/forget-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, redirectTo }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message ?? `HTTP ${response.status}`);
  }

  return response.json();
}
