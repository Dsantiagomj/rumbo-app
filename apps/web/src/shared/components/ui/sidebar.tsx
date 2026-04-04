'use client';

/*
 * Vendored shadcn sidebar primitive adapted for RumboApp.
 * It intentionally stays co-located because the provider, trigger,
 * menu button, and responsive container share the same state contract.
 */

import { SidebarLeftIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { cn } from '@/shared/lib/utils';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '14rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3.5rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type SidebarContextProps = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: boolean | ((open: boolean) => boolean)) => {
      const nextOpen = typeof value === 'function' ? value(open) : value;

      onOpenChange?.(nextOpen);

      if (openProp === undefined) {
        setUncontrolledOpen(nextOpen);
      }

      // biome-ignore lint/suspicious/noDocumentCookie: lightweight UI preference persistence
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${nextOpen}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [onOpenChange, open, openProp],
  );

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((current) => !current);
      return;
    }

    setOpen((current) => !current);
  }, [isMobile, setOpen]);

  const handleKeyDownCapture = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== SIDEBAR_KEYBOARD_SHORTCUT
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const isEditable =
        !!target &&
        (target.isContentEditable ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT');

      if (isEditable) {
        return;
      }

      event.preventDefault();
      toggleSidebar();
    },
    [toggleSidebar],
  );

  const state: SidebarContextProps['state'] = open ? 'expanded' : 'collapsed';
  const contextValue = React.useMemo(
    () => ({ state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar }),
    [state, open, setOpen, openMobile, isMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        onKeyDownCapture={handleKeyDownCapture}
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn('group/sidebar-wrapper flex min-h-svh w-full bg-muted', className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === 'none') {
    return (
      <div
        className={cn(
          'flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side={side}
          className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={{ '--sidebar-width': SIDEBAR_WIDTH_MOBILE } as React.CSSProperties}
          {...props}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Barra lateral</SheetTitle>
            <SheetDescription>Muestra la barra lateral en movil.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  const collapsedWidth =
    variant === 'floating' || variant === 'inset'
      ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
      : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)';

  return (
    <div
      className="group peer hidden text-sidebar-foreground md:block"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      <div
        className={cn(
          'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
          collapsedWidth,
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
          side === 'left' ? 'left-0' : 'right-0',
          collapsedWidth,
          variant === 'floating' || variant === 'inset' ? 'p-2' : '',
          className,
        )}
        {...props}
      >
        <div className="flex size-full flex-col bg-transparent group-data-[variant=floating]:rounded-2xl group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border">
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();
  const modKey = React.useMemo(() => {
    if (typeof navigator !== 'undefined' && /Mac|iPhone|iPod|iPad/.test(navigator.platform)) {
      return '⌘';
    }

    return 'Ctrl+';
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-slot="sidebar-trigger"
          variant="ghost"
          size="icon-sm"
          className={cn(className)}
          onClick={(event) => {
            onClick?.(event);
            toggleSidebar();
          }}
          {...props}
        >
          <HugeiconsIcon icon={SidebarLeftIcon} strokeWidth={2} />
          <span className="sr-only">Alternar barra lateral</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <span className="flex items-center gap-2">
          Alternar barra lateral
          <kbd className="rounded bg-background/20 px-1.5 py-0.5 font-mono text-[10px]">
            {modKey}B
          </kbd>
        </span>
      </TooltipContent>
    </Tooltip>
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        'relative flex w-full flex-1 flex-col overflow-hidden bg-background',
        'md:my-2 md:mr-2 md:rounded-xl md:shadow-md md:ring-1 md:ring-border/50',
        className,
      )}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      {...props}
    />
  );
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="sidebar-group-content" className={cn('w-full text-sm', className)} {...props} />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn('flex w-full min-w-0 flex-col gap-0.5', className)}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn('group/menu-item relative', className)}
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  'peer/menu-button group/menu-button flex w-full items-center gap-3 overflow-hidden rounded-lg px-2.5 py-2 text-left text-sm outline-hidden transition-[width,height,padding] group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-5 [&_svg]:shrink-0 [&>span:last-child]:truncate',
  {
    variants: {
      variant: {
        default: '',
        outline: 'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))]',
      },
      size: {
        default: 'h-9 text-sm',
        sm: 'h-8 text-xs',
        lg: 'h-14 px-3 text-sm group-data-[collapsible=icon]:p-0!',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot.Root : 'button';
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  const tooltipProps = typeof tooltip === 'string' ? { children: tooltip } : tooltip;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== 'collapsed' || isMobile}
        {...tooltipProps}
      />
    </Tooltip>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
};
