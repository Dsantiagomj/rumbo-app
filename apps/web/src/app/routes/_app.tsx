import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppSidebar } from '@/shared/components/app-shell/app-sidebar';
import { AssistantPanel } from '@/shared/components/app-shell/assistant-panel';
import { MobileAssistantSheet } from '@/shared/components/app-shell/mobile-assistant-sheet';
import { MobileBottomBar } from '@/shared/components/app-shell/mobile-bottom-bar';
import { MobileDrawer } from '@/shared/components/app-shell/mobile-drawer';
import { SiteHeader } from '@/shared/components/app-shell/site-header';
import { SkipToContent } from '@/shared/components/app-shell/skip-to-content';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { ShellProvider, useShell } from '@/shared/hooks/use-shell-context';
import { authClient } from '@/shared/lib/auth-client';

export const Route = createFileRoute('/_app')({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

    if (!session) {
      throw redirect({ to: '/login' });
    }

    return {
      session: session as {
        user: { name: string; email: string; image?: string | null };
        session: { id: string };
      },
    };
  },
  component: AppLayout,
});

/**
 * Authenticated application shell.
 *
 * Desktop: bg-muted wrapper → plain sidebar (w-56 / w-14) + content panel
 *          with rounded-l-2xl + shadow + optional AI assistant side panel.
 * Mobile:  custom bottom bar for primary nav + drawer for secondary nav
 *          + full-screen AI assistant sheet.
 */
function AppLayout() {
  const { session } = Route.useRouteContext();
  const userName = session.user.name ?? 'User';
  const userEmail = session.user.email ?? '';

  return (
    <ShellProvider>
      <TooltipProvider>
        <SidebarProvider>
          <SkipToContent />

          {/* Desktop sidebar — hidden on mobile, uses shadcn Sidebar for collapse state */}
          <AppSidebar />

          {/* Content panel — rounded-l-2xl on desktop to match Rumbo layout */}
          <SidebarInset>
            <SiteHeader userName={userName} />
            <AppContent />
          </SidebarInset>

          {/* Mobile-only: bottom bar + secondary drawer + assistant sheet */}
          <MobileBottomBar />
          <MobileDrawer userName={userName} userEmail={userEmail} />
          <MobileAssistantOverlay />
        </SidebarProvider>
      </TooltipProvider>
    </ShellProvider>
  );
}

/**
 * Inner content area wrapped in a flex row so the AI assistant panel
 * can sit beside the main content on desktop.
 */
function AppContent() {
  const { assistantOpen, assistantWidth, isDragging, handleDragStart } = useShell();

  return (
    <div className="flex flex-1 overflow-hidden">
      <main id="main-content" className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
        <Outlet />
      </main>
      <AssistantPanel
        open={assistantOpen}
        width={assistantWidth}
        isDragging={isDragging}
        onDragStart={handleDragStart}
      />
    </div>
  );
}

/** Mobile AI assistant sheet — reads state from shell context. */
function MobileAssistantOverlay() {
  const { mobileAssistantOpen, setMobileAssistantOpen } = useShell();

  return (
    <MobileAssistantSheet
      open={mobileAssistantOpen}
      onClose={() => setMobileAssistantOpen(false)}
    />
  );
}
