import { Mail01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { VERIFY_EMAIL } from '@/features/auth/strings';
import { Button } from '@/shared/components/ui/button';
import { FieldGroup } from '@/shared/components/ui/field';

export const Route = createFileRoute('/_auth/verify-email')({
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  return (
    <AuthLayout>
      <FieldGroup>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <HugeiconsIcon icon={Mail01Icon} className="size-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold">{VERIFY_EMAIL.heading}</h1>
          <p className="text-sm text-muted-foreground">{VERIFY_EMAIL.description}</p>
          <p className="text-xs text-muted-foreground">{VERIFY_EMAIL.spamHint}</p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/login">{VERIFY_EMAIL.backToLogin}</Link>
          </Button>
        </div>
      </FieldGroup>
    </AuthLayout>
  );
}
