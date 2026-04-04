import { Cancel01Icon, SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface MobileAssistantSheetProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Full-screen mobile AI assistant overlay.
 *
 * Uses a simple fixed overlay pattern (not radix Sheet) to match the
 * Rumbo reference's lightweight mobile assistant implementation.
 */
export function MobileAssistantSheet({ open, onClose }: MobileAssistantSheetProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        className="cursor-pointer fixed inset-0 z-40 bg-black/40 md:hidden"
        onClick={onClose}
        aria-label="Cerrar asistente"
      />

      {/* Full-screen panel */}
      <div className="fixed inset-0 z-50 flex flex-col bg-background md:hidden">
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={SparklesIcon} size={20} className="text-muted-foreground" />
            <span className="text-sm font-semibold">Asistente IA</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-accent"
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
