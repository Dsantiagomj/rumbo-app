import { create } from 'zustand';

interface MobileDrawerState {
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
}

/**
 * Client-side store for mobile drawer UI state only.
 *
 * Desktop sidebar state is now fully managed by shadcn's SidebarProvider.
 * This store only controls the mobile secondary drawer (Sheet).
 */
export const useSidebarState = create<MobileDrawerState>((set) => ({
  mobileDrawerOpen: false,
  setMobileDrawerOpen: (open) => set({ mobileDrawerOpen: open }),
}));
