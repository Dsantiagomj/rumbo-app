import { zodResolver } from '@hookform/resolvers/zod';
import { type SignupInput, signupSchema } from '@rumbo/shared';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PasswordInput } from '@/features/auth/components/password-input';
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
        setError(translateAuthError(result.error.message ?? 'Error al crear la cuenta'));
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
          <h1 className="text-xl font-bold">Vamos a conocernos</h1>
          <FieldDescription>
            Ya tienes cuenta? <Link to="/login">Entra aqui</Link>
          </FieldDescription>
        </div>

        <Field data-invalid={errors.name ? true : undefined}>
          <FieldLabel htmlFor="signup-name">Como te llamas?</FieldLabel>
          <Input
            id="signup-name"
            type="text"
            placeholder="Tu nombre o como prefieres ser llamado"
            autoComplete="name"
            aria-invalid={!!errors.name}
            {...register('name')}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>

        <Field data-invalid={errors.email ? true : undefined}>
          <FieldLabel htmlFor="signup-email">Tu email</FieldLabel>
          <Input
            id="signup-email"
            type="email"
            placeholder="tu@email.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <Field data-invalid={errors.password ? true : undefined}>
          <FieldLabel htmlFor="signup-password">Elige una contrasena</FieldLabel>
          <PasswordInput
            id="signup-password"
            placeholder="Minimo 8 caracteres"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </Field>

        <Field data-invalid={errors.confirmPassword ? true : undefined}>
          <FieldLabel htmlFor="signup-confirm-password">Repite la contrasena</FieldLabel>
          <PasswordInput
            id="signup-confirm-password"
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
            {loading ? 'Creando tu cuenta...' : 'Empezar'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
