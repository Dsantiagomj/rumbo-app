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
      title="Iniciar sesion"
      description="Ingresa tus credenciales para acceder a tu cuenta"
      footer={
        <div className="flex flex-col gap-2">
          <Link to="/forgot-password" className="text-primary hover:underline">
            Olvidaste tu contrasena?
          </Link>
          <p>
            No tienes cuenta?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              Crear cuenta
            </Link>
          </p>
        </div>
      }
    >
      <LoginForm onSuccess={() => navigate({ to: '/' })} />
    </AuthLayout>
  );
}
