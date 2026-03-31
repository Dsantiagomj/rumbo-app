import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { authClient } from '@/shared/lib/auth-client';

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

    if (session) {
      throw redirect({ to: '/' });
    }
  },
  component: AuthLayoutRoute,
});

function AuthLayoutRoute() {
  return <Outlet />;
}
