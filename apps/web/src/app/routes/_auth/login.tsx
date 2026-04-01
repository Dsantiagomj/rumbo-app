import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { LoginForm } from '@/features/auth/components/login-form';

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout footer={<a href="/forgot-password">No recuerdo mi contrasena</a>}>
      <LoginForm onSuccess={() => navigate({ to: '/' })} />
    </AuthLayout>
  );
}
