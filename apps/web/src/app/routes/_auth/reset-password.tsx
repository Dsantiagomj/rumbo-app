import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';
import { Button } from '@/shared/components/ui/button';

type ResetPasswordSearch = {
  token?: string;
  error?: string;
};

export const Route = createFileRoute('/_auth/reset-password')({
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => ({
    token: typeof search.token === 'string' ? search.token : undefined,
    error: typeof search.error === 'string' ? search.error : undefined,
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token, error: tokenError } = Route.useSearch();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  if (tokenError === 'INVALID_TOKEN' || !token) {
    return (
      <AuthLayout
        title="Este enlace ya no funciona"
        description="Puede que haya expirado o ya lo hayas usado"
        footer={
          <Link to="/forgot-password" className="text-primary hover:underline">
            Pedir otro enlace
          </Link>
        }
      >
        <div className="text-center text-sm text-muted-foreground">
          <p>Pide un nuevo enlace y te lo enviamos al correo.</p>
        </div>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout title="Listo, contrasena actualizada">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Ya puedes entrar con tu nueva contrasena.</p>
          <Button className="w-full" onClick={() => navigate({ to: '/login' })}>
            Entrar
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Elige tu nueva contrasena"
      footer={
        <Link to="/login" className="text-primary hover:underline">
          Volver a entrar
        </Link>
      }
    >
      <ResetPasswordForm token={token} onSuccess={() => setSuccess(true)} />
    </AuthLayout>
  );
}
