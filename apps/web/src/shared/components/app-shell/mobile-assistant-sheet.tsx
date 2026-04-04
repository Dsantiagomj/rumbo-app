import { Cancel01Icon, SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useState } from 'react';

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
 */
export function MobileAssistantSheet({ open, onClose }: MobileAssistantSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Mount → then trigger visible for enter animation
  useEffect(() => {
    if (open) {
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

  // Unmount after exit transition ends
  function handleTransitionEnd() {
    if (!visible) {
      setMounted(false);
    }
  }

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        className="cursor-pointer fixed inset-0 z-40 md:hidden transition-opacity duration-200 ease-out"
        style={{
          backgroundColor: 'rgb(0 0 0 / 0.4)',
          opacity: visible ? 1 : 0,
        }}
        onClick={onClose}
        onTransitionEnd={handleTransitionEnd}
        aria-label="Cerrar asistente"
      />

      {/* Full-screen panel — slides up from bottom */}
      <div
        className="fixed inset-0 z-50 flex flex-col bg-background md:hidden transition-transform duration-200 ease-out"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className="flex h-14 items-center justify-between border-b border-border/60 px-4">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={SparklesIcon} size={20} className="text-muted-foreground" />
            <span className="text-sm font-semibold">Asistente IA</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-accent active:opacity-60 transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} />
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <HugeiconsIcon icon={SparklesIcon} size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Proximamente</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Tu asistente financiero con IA te ayudara a analizar gastos, categorizar transacciones y
            gestionar presupuestos.
          </p>
        </div>
      </div>
    </>
  );
}
