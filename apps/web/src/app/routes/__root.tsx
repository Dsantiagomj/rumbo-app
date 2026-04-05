import { QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { Toaster } from 'sileo';
import { useDarkMode } from '@/shared/hooks/use-dark-mode';
import { queryClient } from '../providers';

const RouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-router-devtools').then((mod) => ({
        default: mod.TanStackRouterDevtools,
      })),
    )
  : null;

const QueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((mod) => ({
        default: mod.ReactQueryDevtools,
      })),
    )
  : null;

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const isDark = useDarkMode();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster
        position="top-center"
        theme={isDark ? 'dark' : 'light'}
        offset={{ top: 16 }}
        options={{
          duration: 5000,
          roundness: 10,
        }}
      />
      {RouterDevtools && (
        <Suspense fallback={null}>
          <RouterDevtools position="bottom-right" />
        </Suspense>
      )}
      {QueryDevtools && (
        <Suspense fallback={null}>
          <QueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}
