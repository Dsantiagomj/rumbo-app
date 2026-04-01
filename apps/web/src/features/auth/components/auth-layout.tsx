import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  footer?: ReactNode;
}

export function AuthLayout({ children, title, description, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <div className="flex flex-col items-center gap-2">
          <img src="/favicon.svg" alt="Rumbo" className="size-12" />
          <h1 className="font-heading text-2xl font-bold tracking-tight">Rumbo</h1>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-center text-xl font-semibold">{title}</h2>
          {description && (
            <p className="text-center text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {children}

        {footer && <div className="text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </div>
  );
}
