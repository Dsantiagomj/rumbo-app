import { createFileRoute, redirect } from '@tanstack/react-router';
import { SettingsLayout } from '@/shared/components/app-shell/settings-layout';
import { authClient } from '@/shared/lib/auth-client';

export const Route = createFileRoute('/_settings')({
  beforeLoad: async ({ location }) => {
    const { data: session } = await authClient.getSession();

    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname },
      });
    }

    return {
      session: session as {
        user: { name: string; email: string; image?: string | null };
        session: { id: string };
      },
    };
  },
  component: SettingsLayout,
});
