import { zodResolver } from '@hookform/resolvers/zod';
import { type SignupInput, signupSchema } from '@rumbo/shared';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PasswordInput } from '@/features/auth/components/password-input';
import { SIGNUP } from '@/features/auth/strings';
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
import { signUp } from '@/shared/lib/auth-client';
import { COMMON } from '@/shared/lib/strings';

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupInput) {
    setError(null);
    setLoading(true);

    try {
      const result = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (result.error) {
        setError(translateAuthError(result.error.message ?? SIGNUP.fallbackError));
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
          <h1 className="text-xl font-bold">{SIGNUP.heading}</h1>
          <FieldDescription>
            {SIGNUP.hasAccount} <Link to="/login">{SIGNUP.goToLogin}</Link>
          </FieldDescription>
        </div>

        <Field data-invalid={errors.name ? true : undefined}>
          <FieldLabel htmlFor="signup-name">{SIGNUP.nameLabel}</FieldLabel>
          <Input
            id="signup-name"
            type="text"
            placeholder={SIGNUP.namePlaceholder}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'signup-name-error' : undefined}
            {...register('name')}
          />
          <FieldError id="signup-name-error">{errors.name?.message}</FieldError>
        </Field>

        <Field data-invalid={errors.email ? true : undefined}>
          <FieldLabel htmlFor="signup-email">{SIGNUP.emailLabel}</FieldLabel>
          <Input
            id="signup-email"
            type="email"
            placeholder={SIGNUP.emailPlaceholder}
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'signup-email-error' : undefined}
            {...register('email')}
          />
          <FieldError id="signup-email-error">{errors.email?.message}</FieldError>
        </Field>

        <Field data-invalid={errors.password ? true : undefined}>
          <FieldLabel htmlFor="signup-password">{SIGNUP.passwordLabel}</FieldLabel>
          <PasswordInput
            id="signup-password"
            placeholder={SIGNUP.passwordPlaceholder}
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'signup-password-error' : undefined}
            {...register('password')}
          />
          <FieldError id="signup-password-error">{errors.password?.message}</FieldError>
        </Field>

        <Field data-invalid={errors.confirmPassword ? true : undefined}>
          <FieldLabel htmlFor="signup-confirm-password">{SIGNUP.confirmPasswordLabel}</FieldLabel>
          <PasswordInput
            id="signup-confirm-password"
            placeholder={SIGNUP.confirmPasswordPlaceholder}
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'signup-confirm-error' : undefined}
            {...register('confirmPassword')}
          />
          <FieldError id="signup-confirm-error">{errors.confirmPassword?.message}</FieldError>
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
            {loading ? SIGNUP.submitLoading : SIGNUP.submit}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
