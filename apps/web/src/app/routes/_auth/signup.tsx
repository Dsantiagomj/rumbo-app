import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { SignupForm } from '@/features/auth/components/signup-form';

export const Route = createFileRoute('/_auth/signup')({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <SignupForm onSuccess={() => navigate({ to: '/verify-email' })} />
    </AuthLayout>
  );
}
