import { Mail01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { Button } from '@/shared/components/ui/button';

export const Route = createFileRoute('/_auth/verify-email')({
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  return (
    <AuthLayout title="Ya casi!">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <HugeiconsIcon icon={Mail01Icon} className="size-6 text-primary" />
        </div>
        <h3 className="font-heading text-lg font-semibold">Revisa tu correo</h3>
        <p className="text-sm text-muted-foreground">
          Te enviamos un enlace para confirmar tu email. Dale clic y listo.
        </p>
        <p className="text-xs text-muted-foreground">Si no lo ves, revisa en spam.</p>
        <Button asChild variant="outline" className="w-full">
          <Link to="/login">Volver a entrar</Link>
        </Button>
      </div>
    </AuthLayout>
  );
}
