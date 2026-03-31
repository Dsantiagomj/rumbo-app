import { createFileRoute, Link } from '@tanstack/react-router';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export const Route = createFileRoute('/_auth/forgot-password')({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Recuperar contrasena"
      description="Te enviaremos un enlace para restablecer tu contrasena"
      footer={
        <Link to="/login" className="text-primary hover:underline">
          Volver a iniciar sesion
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
