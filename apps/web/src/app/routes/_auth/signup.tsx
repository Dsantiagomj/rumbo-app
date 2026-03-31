import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { SignupForm } from '@/features/auth/components/signup-form';

export const Route = createFileRoute('/_auth/signup')({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Vamos a conocernos"
      footer={
        <p>
          Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Entra aqui
          </Link>
        </p>
      }
    >
      <SignupForm onSuccess={() => navigate({ to: '/verify-email' })} />
    </AuthLayout>
  );
}
