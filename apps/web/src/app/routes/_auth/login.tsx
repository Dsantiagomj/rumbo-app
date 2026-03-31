import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { LoginForm } from '@/features/auth/components/login-form';

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      footer={
        <div className="flex flex-col gap-2">
          <Link to="/forgot-password" className="text-primary hover:underline">
            No recuerdo mi contrasena
          </Link>
          <p>
            Aun no tienes cuenta?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              Crear una
            </Link>
          </p>
        </div>
      }
    >
      <LoginForm onSuccess={() => navigate({ to: '/' })} />
    </AuthLayout>
  );
}
