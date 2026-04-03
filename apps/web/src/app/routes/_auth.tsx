import { createFileRoute, Outlet, redirect, useRouterState } from '@tanstack/react-router';
import { PageTransition } from '@/shared/components/page-transition';
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <PageTransition transitionKey={pathname} variant="fade-scale">
      <Outlet />
    </PageTransition>
  );
}
