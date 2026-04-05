import { zodResolver } from '@hookform/resolvers/zod';
import { Mail01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { type ForgotPasswordInput, forgotPasswordSchema } from '@rumbo/shared';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { requestPasswordReset } from '@/features/auth/api/forgot-password';
import { FORGOT_PASSWORD } from '@/features/auth/strings';
import { Button } from '@/shared/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { COMMON } from '@/shared/lib/strings';

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setError(null);
    setLoading(true);

    try {
      await requestPasswordReset({
        email: data.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      setSuccess(true);
    } catch {
      setError(COMMON.unexpectedError);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <FieldGroup>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <HugeiconsIcon icon={Mail01Icon} className="size-6 text-primary" />
          </div>
          <h3 className="font-heading text-lg font-semibold">{FORGOT_PASSWORD.successHeading}</h3>
          <p className="text-sm text-muted-foreground">{FORGOT_PASSWORD.successDescription}</p>
        </div>
      </FieldGroup>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <img src="/favicon.svg" alt="Rumbo" className="size-8" />
          <h1 className="text-xl font-bold">{FORGOT_PASSWORD.heading}</h1>
          <FieldDescription>{FORGOT_PASSWORD.description}</FieldDescription>
        </div>

        <Field data-invalid={errors.email ? true : undefined}>
          <FieldLabel htmlFor="forgot-email">{FORGOT_PASSWORD.emailLabel}</FieldLabel>
          <Input
            id="forgot-email"
            type="email"
            placeholder={FORGOT_PASSWORD.emailPlaceholder}
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'forgot-email-error' : undefined}
            {...register('email')}
          />
          <FieldError id="forgot-email-error">{errors.email?.message}</FieldError>
        </Field>

        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        <Field>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? FORGOT_PASSWORD.submitLoading : FORGOT_PASSWORD.submit}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
