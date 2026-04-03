import { createFileRoute, Link } from '@tanstack/react-router';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export const Route = createFileRoute('/_auth/forgot-password')({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthLayout footer={<Link to="/login">Volver a entrar</Link>}>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
