import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';
import { Button } from '@/shared/components/ui/button';
import { FieldGroup } from '@/shared/components/ui/field';

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
      <AuthLayout footer={<a href="/forgot-password">Pedir otro enlace</a>}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <img src="/favicon.svg" alt="Rumbo" className="size-8" />
            <h1 className="text-xl font-bold">Este enlace ya no funciona</h1>
            <p className="text-sm text-muted-foreground">
              Puede que haya expirado o ya lo hayas usado. Pide un nuevo enlace y te lo enviamos al
              correo.
            </p>
          </div>
        </FieldGroup>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout>
        <FieldGroup>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold">Listo, contrasena actualizada</h1>
            <p className="text-sm text-muted-foreground">
              Ya puedes entrar con tu nueva contrasena.
            </p>
            <Button className="w-full" onClick={() => navigate({ to: '/login' })}>
              Entrar
            </Button>
          </div>
        </FieldGroup>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout footer={<a href="/login">Volver a entrar</a>}>
      <ResetPasswordForm token={token} onSuccess={() => setSuccess(true)} />
    </AuthLayout>
  );
}
