import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useLocalStorage } from './use-local-storage';

const ASSISTANT_MIN_WIDTH = 280;
const ASSISTANT_MAX_WIDTH = 600;
const ASSISTANT_DEFAULT_WIDTH = 384;

function clampAssistantWidth(width: number) {
  return Math.max(ASSISTANT_MIN_WIDTH, Math.min(ASSISTANT_MAX_WIDTH, width));
}

interface ShellContextValue {
  assistantOpen: boolean;
  assistantWidth: number;
  mobileAssistantOpen: boolean;
  isDragging: boolean;
  modKey: string;
  toggleAssistant: () => void;
  setAssistantOpen: (open: boolean) => void;
  setMobileAssistantOpen: (open: boolean) => void;
  handleDragStart: (e: ReactMouseEvent) => void;
}

const ShellContext = createContext<ShellContextValue | null>(null);

export function ShellProvider({ children }: { children: ReactNode }) {
  const [assistantOpen, setAssistantOpen] = useLocalStorage('rumbo-assistant-open', false);
  const [assistantWidth, setAssistantWidth] = useLocalStorage(
    'rumbo-assistant-width',
    ASSISTANT_DEFAULT_WIDTH,
  );
  const [mobileAssistantOpen, setMobileAssistantOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startWidth: 0 });
  const cleanupDragRef = useRef<null | (() => void)>(null);

  const isMac = useMemo(
    () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent),
    [],
  );
  const modKey = isMac ? '⌘' : 'Ctrl+';

  const setClampedAssistantWidth = useCallback(
    (value: number | ((value: number) => number)) => {
      setAssistantWidth((current) => {
        const nextValue = typeof value === 'function' ? value(current) : value;
        return clampAssistantWidth(nextValue);
      });
    },
    [setAssistantWidth],
  );

  const toggleAssistant = useCallback(() => setAssistantOpen((prev) => !prev), [setAssistantOpen]);

  const handleDragStart = useCallback(
    (e: ReactMouseEvent) => {
      e.preventDefault();
      dragRef.current = { startX: e.clientX, startWidth: assistantWidth };
      setIsDragging(true);

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      const handleMouseMove = (event: MouseEvent) => {
        const delta = dragRef.current.startX - event.clientX;
        setClampedAssistantWidth(dragRef.current.startWidth + delta);
      };

      const cleanup = () => {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', cleanup);
        cleanupDragRef.current = null;
        setIsDragging(false);
      };

      cleanupDragRef.current?.();
      cleanupDragRef.current = cleanup;

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', cleanup);
    },
    [assistantWidth, setClampedAssistantWidth],
  );

  const handleKeyDownCapture = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
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

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'i') {
        event.preventDefault();
        toggleAssistant();
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        const searchInput = document.querySelector<HTMLInputElement>(
          '[data-rumbo-search="transactions"]',
        );

        if (searchInput) {
          event.preventDefault();
          searchInput.focus();
          searchInput.select();
          return;
        }
      }

      if (event.key === 'Escape' && assistantOpen) {
        setAssistantOpen(false);
      }
    },
    [assistantOpen, setAssistantOpen, toggleAssistant],
  );

  const value = useMemo<ShellContextValue>(
    () => ({
      assistantOpen,
      assistantWidth,
      mobileAssistantOpen,
      isDragging,
      modKey,
      toggleAssistant,
      setAssistantOpen,
      setMobileAssistantOpen,
      handleDragStart,
    }),
    [
      assistantOpen,
      assistantWidth,
      mobileAssistantOpen,
      isDragging,
      modKey,
      toggleAssistant,
      setAssistantOpen,
      setMobileAssistantOpen,
      handleDragStart,
    ],
  );

  return (
    <ShellContext.Provider value={value}>
      <div className="contents" onKeyDownCapture={handleKeyDownCapture}>
        {children}
      </div>
    </ShellContext.Provider>
  );
}

export function useShell(): ShellContextValue {
  const ctx = useContext(ShellContext);

  if (!ctx) {
    throw new Error('useShell must be used within a <ShellProvider>');
  }

  return ctx;
}
