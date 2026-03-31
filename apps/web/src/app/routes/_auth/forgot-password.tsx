import { createFileRoute, Link } from '@tanstack/react-router';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export const Route = createFileRoute('/_auth/forgot-password')({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="No te preocupes"
      description="Te enviamos un enlace para que crees una nueva contrasena"
      footer={
        <Link to="/login" className="text-primary hover:underline">
          Volver a entrar
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
