import { zodResolver } from '@hookform/resolvers/zod';
import { type ResetPasswordInput, resetPasswordSchema } from '@rumbo/shared';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PasswordInput } from '@/features/auth/components/password-input';
import { translateAuthError } from '@/features/auth/utils/translate-error';
import { Button } from '@/shared/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { authClient } from '@/shared/lib/auth-client';

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
        setError(translateAuthError(result.error.message ?? 'Error al restablecer la contrasena'));
        return;
      }

      onSuccess?.();
    } catch {
      setError('Ocurrio un error inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <img src="/favicon.svg" alt="Rumbo" className="size-8" />
          <h1 className="text-xl font-bold">Elige tu nueva contrasena</h1>
        </div>

        <Field data-invalid={errors.password ? true : undefined}>
          <FieldLabel htmlFor="reset-password">Tu nueva contrasena</FieldLabel>
          <PasswordInput
            id="reset-password"
            placeholder="Minimo 8 caracteres"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </Field>

        <Field data-invalid={errors.confirmPassword ? true : undefined}>
          <FieldLabel htmlFor="reset-confirm-password">Repitela aqui</FieldLabel>
          <PasswordInput
            id="reset-confirm-password"
            placeholder="La misma de arriba"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
          <FieldError>{errors.confirmPassword?.message}</FieldError>
        </Field>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        <Field>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar nueva contrasena'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
