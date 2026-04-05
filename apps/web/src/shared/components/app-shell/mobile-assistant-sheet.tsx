import { Cancel01Icon, SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SHELL } from '@/shared/lib/strings';

interface MobileAssistantSheetProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Full-screen mobile AI assistant overlay with slide-up animation.
 *
 * Uses a two-phase mount (mounted → visible) pattern so CSS transitions
 * can animate both open and close. The panel slides up from the bottom
 * and the backdrop fades in, consistent with the mobile drawer's Sheet
 * animation style.
 *
 * Accessibility: role="dialog", aria-modal, focus trap, Escape key dismiss.
 * Respects prefers-reduced-motion by disabling CSS transitions.
 */
export function MobileAssistantSheet({ open, onClose }: MobileAssistantSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Mount → then trigger visible for enter animation
  useEffect(() => {
    if (open) {
      // Store the element that had focus before opening
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      setMounted(true);
      // Small RAF delay so the browser paints the initial state before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      setVisible(false);
    }
  }, [open]);

  // Focus close button when fully visible
  useEffect(() => {
    if (visible) {
      closeButtonRef.current?.focus();
    }
  }, [visible]);

  // Unmount after exit transition ends + restore focus
  function handleTransitionEnd() {
    if (!visible) {
      setMounted(false);
      // Restore focus to the element that triggered the opening
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    }
  }

  // Escape key to dismiss
  useEffect(() => {
    if (!mounted) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mounted, onClose]);

  // Focus trap — keep focus within the dialog while open
  const handleFocusTrap = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !panelRef.current) return;

    const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusableElements.length === 0) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (!first || !last) return;

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    document.addEventListener('keydown', handleFocusTrap);
    return () => document.removeEventListener('keydown', handleFocusTrap);
  }, [mounted, handleFocusTrap]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        className="cursor-pointer fixed inset-0 z-40 md:hidden motion-safe:transition-opacity motion-safe:duration-200 motion-safe:ease-out"
        style={{
          backgroundColor: 'rgb(0 0 0 / 0.4)',
          opacity: visible ? 1 : 0,
        }}
        onClick={onClose}
        onTransitionEnd={handleTransitionEnd}
        aria-label={SHELL.closeAssistant}
      />

      {/* Full-screen panel — slides up from bottom */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={SHELL.assistantLabel}
        className="fixed inset-0 z-50 flex flex-col bg-background md:hidden motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className="flex h-14 items-center justify-between border-b border-border/60 px-4">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={SparklesIcon} size={20} className="text-muted-foreground" />
            <span className="text-sm font-semibold">{SHELL.assistantLabel}</span>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={SHELL.closeAssistant}
            className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-accent active:opacity-60 transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} />
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <HugeiconsIcon icon={SparklesIcon} size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">{SHELL.comingSoon}</h3>
          <p className="text-sm text-muted-foreground max-w-xs">{SHELL.comingSoonAssistant}</p>
        </div>
      </div>
    </>
  );
}
