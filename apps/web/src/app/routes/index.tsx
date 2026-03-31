import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { Button } from '@/shared/components/ui/button';
import { authClient, signOut } from '@/shared/lib/auth-client';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

    if (!session) {
      throw redirect({ to: '/login' });
    }

    return { session };
  },
  component: HomePage,
});

function HomePage() {
  const { session } = Route.useRouteContext();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    await navigate({ to: '/login' });
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="font-heading text-4xl font-bold">RumboApp</h1>
        <p className="text-muted-foreground">Bienvenido, {session.user.name}</p>
        <Button variant="outline" onClick={handleSignOut}>
          Cerrar sesion
        </Button>
      </div>
    </div>
  );
}
