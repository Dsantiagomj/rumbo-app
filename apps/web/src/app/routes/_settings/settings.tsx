import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_settings/settings')({
  component: () => <Outlet />,
});
