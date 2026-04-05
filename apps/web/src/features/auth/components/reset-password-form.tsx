import { zodResolver } from '@hookform/resolvers/zod';
import { type ResetPasswordInput, resetPasswordSchema } from '@rumbo/shared';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PasswordInput } from '@/features/auth/components/password-input';
import { RESET_PASSWORD } from '@/features/auth/strings';
import { translateAuthError } from '@/features/auth/utils/translate-error';
import { Button } from '@/shared/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { authClient } from '@/shared/lib/auth-client';
import { COMMON } from '@/shared/lib/strings';

interface ResetPasswordFormProps {
  token: string;
  onSuccess?: () => void;
}

export function ResetPasswordForm({ token, onSuccess }: ResetPasswordFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordInput) {
    setError(null);
    setLoading(true);

    try {
      const result = await authClient.resetPassword({
        newPassword: data.password,
        token,
      });

      if (result.error) {
        setError(translateAuthError(result.error.message ?? RESET_PASSWORD.fallbackError));
        return;
      }

      onSuccess?.();
    } catch {
      setError(COMMON.unexpectedError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <img src="/favicon.svg" alt="Rumbo" className="size-8" />
          <h1 className="text-xl font-bold">{RESET_PASSWORD.heading}</h1>
        </div>

        <Field data-invalid={errors.password ? true : undefined}>
          <FieldLabel htmlFor="reset-password">{RESET_PASSWORD.passwordLabel}</FieldLabel>
          <PasswordInput
            id="reset-password"
            placeholder={RESET_PASSWORD.passwordPlaceholder}
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'reset-password-error' : undefined}
            {...register('password')}
          />
          <FieldError id="reset-password-error">{errors.password?.message}</FieldError>
        </Field>

        <Field data-invalid={errors.confirmPassword ? true : undefined}>
          <FieldLabel htmlFor="reset-confirm-password">{RESET_PASSWORD.confirmLabel}</FieldLabel>
          <PasswordInput
            id="reset-confirm-password"
            placeholder={RESET_PASSWORD.confirmPlaceholder}
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'reset-confirm-error' : undefined}
            {...register('confirmPassword')}
          />
          <FieldError id="reset-confirm-error">{errors.confirmPassword?.message}</FieldError>
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
            {loading ? RESET_PASSWORD.submitLoading : RESET_PASSWORD.submit}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
