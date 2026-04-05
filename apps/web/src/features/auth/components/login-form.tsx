import { zodResolver } from '@hookform/resolvers/zod';
import { type LoginInput, loginSchema } from '@rumbo/shared';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PasswordInput } from '@/features/auth/components/password-input';
import { LOGIN } from '@/features/auth/strings';
import { translateAuthError } from '@/features/auth/utils/translate-error';
import { Button } from '@/shared/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { signIn } from '@/shared/lib/auth-client';
import { COMMON } from '@/shared/lib/strings';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setError(null);
    setLoading(true);

    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setError(translateAuthError(result.error.message ?? LOGIN.fallbackError));
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
          <h1 className="text-xl font-bold">{LOGIN.heading}</h1>
          <FieldDescription>
            {LOGIN.noAccount} <Link to="/signup">{LOGIN.createAccount}</Link>
          </FieldDescription>
        </div>

        <Field data-invalid={errors.email ? true : undefined}>
          <FieldLabel htmlFor="login-email">{LOGIN.emailLabel}</FieldLabel>
          <Input
            id="login-email"
            type="email"
            placeholder={LOGIN.emailPlaceholder}
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            {...register('email')}
          />
          <FieldError id="login-email-error">{errors.email?.message}</FieldError>
        </Field>

        <Field data-invalid={errors.password ? true : undefined}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="login-password">{LOGIN.passwordLabel}</FieldLabel>
            <Link
              to="/forgot-password"
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
            >
              {LOGIN.forgotPassword}
            </Link>
          </div>
          <PasswordInput
            id="login-password"
            placeholder={LOGIN.passwordPlaceholder}
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            {...register('password')}
          />
          <FieldError id="login-password-error">{errors.password?.message}</FieldError>
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
            {loading ? LOGIN.submitLoading : LOGIN.submit}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
