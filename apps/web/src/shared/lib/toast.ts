// ---------------------------------------------------------------------------
// Toast notification wrapper — thin layer over Sileo.
//
// Centralises default options and provides a typed, app-consistent API so
// callers never import Sileo directly. If the underlying library is ever
// swapped, only this file changes.
//
// Usage:
//   import { toast } from '@/shared/lib/toast';
//   toast.success({ title: 'Guardado correctamente' });
//   toast.error({ title: 'Error al guardar', description: 'Intenta de nuevo.' });
// ---------------------------------------------------------------------------

import { type SileoOptions, type SileoPosition, sileo } from 'sileo';

/**
 * Re-export the Sileo option types so consumers don't need a direct
 * dependency on the `sileo` package for type-only imports.
 */
export type { SileoOptions };

/**
 * Promise-based toast options.
 * Defined locally because Sileo v0.1.5 declares but does not export the type.
 */
export interface ToastPromiseOptions<T = unknown> {
  loading: SileoOptions;
  success: SileoOptions | ((data: T) => SileoOptions);
  error: SileoOptions | ((err: unknown) => SileoOptions);
  action?: SileoOptions | ((data: T) => SileoOptions);
  position?: SileoPosition;
}

// ── Thin wrapper ─────────────────────────────────────────────────────────────

export const toast = {
  success: (opts: SileoOptions) => sileo.success(opts),
  error: (opts: SileoOptions) => sileo.error(opts),
  warning: (opts: SileoOptions) => sileo.warning(opts),
  info: (opts: SileoOptions) => sileo.info(opts),
  action: (opts: SileoOptions) => sileo.action(opts),
  show: (opts: SileoOptions) => sileo.show(opts),
  promise: <T>(promise: Promise<T> | (() => Promise<T>), opts: ToastPromiseOptions<T>) =>
    sileo.promise(promise, opts),
  dismiss: (id: string) => sileo.dismiss(id),
  clear: () => sileo.clear(),
} as const;
