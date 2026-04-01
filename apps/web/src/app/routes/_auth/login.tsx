import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { LoginForm } from '@/features/auth/components/login-form';

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <LoginForm onSuccess={() => navigate({ to: '/' })} />
    </AuthLayout>
  );
}
