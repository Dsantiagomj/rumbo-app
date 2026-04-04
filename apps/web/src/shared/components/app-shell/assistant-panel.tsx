import { SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { MouseEvent as ReactMouseEvent } from 'react';

export interface AssistantPanelProps {
  open: boolean;
  width: number;
  isDragging: boolean;
  onDragStart: (event: ReactMouseEvent) => void;
}

/**
 * Desktop-only AI assistant side panel with drag-to-resize handle.
 *
 * Renders inline next to `<main>` inside a flex row. The resize handle is
 * a zero-width separator that expands on hover for a precise grab target.
 *
 * Adapted from the Rumbo reference project's AssistantPanel.
 */
export function AssistantPanel({ open, width, isDragging, onDragStart }: AssistantPanelProps) {
  return (
    <>
      {/* Resize handle — only visible when panel is open */}
      {open && (
        // biome-ignore lint/a11y/useSemanticElements: vertical resize handle, not a horizontal rule
        <div
          className="hidden md:flex items-center w-0 relative cursor-col-resize group"
          onMouseDown={onDragStart}
          role="separator"
          aria-orientation="vertical"
          aria-valuenow={width}
          aria-valuemin={280}
          aria-valuemax={600}
          tabIndex={0}
        >
          <div
            className={`absolute inset-y-0 -left-[3px] w-[6px] flex items-center justify-center ${
              isDragging ? 'z-10' : ''
            }`}
          >
            <div
              className={`w-px h-full transition-colors duration-150 ${
                isDragging
                  ? 'bg-gradient-to-b from-transparent via-primary to-transparent'
                  : 'bg-gradient-to-b from-transparent via-border/60 to-transparent group-hover:via-primary/60'
              }`}
            />
          </div>
        </div>
      )}

      {/* Panel content */}
      <aside
        className={`hidden md:flex flex-col overflow-hidden border-l border-border/40 ${
          open ? '' : 'w-0 border-l-0'
        } ${isDragging ? '' : 'transition-[width] duration-200'}`}
        style={open ? { width } : undefined}
      >
        <div
          className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center"
          style={{ minWidth: width }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <HugeiconsIcon icon={SparklesIcon} size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Proximamente</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Tu asistente financiero con IA te ayudara a analizar gastos, categorizar transacciones y
            gestionar presupuestos.
          </p>
        </div>
      </aside>
    </>
  );
}
