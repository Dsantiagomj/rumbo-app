import { Delete01Icon, MoreHorizontalIcon, PencilEdit01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Movimiento } from '@rumbo/shared';
import { Link } from '@tanstack/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';
import { MOVIMIENTOS } from '../strings';
import { formatCurrency, groupByDate } from '../utils';

interface MovimientosListProps {
  items: Movimiento[];
  onDelete: (item: Movimiento) => void;
}

export function MovimientosList({ items, onDelete }: MovimientosListProps) {
  if (!items.length) {
    return (
      <div className="py-8 text-center">
        <h3 className="font-medium">{MOVIMIENTOS.emptyTitle}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{MOVIMIENTOS.emptyDescription}</p>
      </div>
    );
  }

  const groups = groupByDate(items);

  return (
    <div>
      {groups.map((group) => (
        <div key={group.date}>
          <div className="sticky top-0 z-10 bg-background px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground first:pt-0 sm:px-5">
            {group.label}
          </div>

          {group.items.map((item) => (
            <div
              key={item.id}
              className="mx-1 flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/30 sm:px-4"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span
                  className={cn(
                    'size-2 flex-shrink-0 rounded-full',
                    item.type === 'income' ? 'bg-emerald-500' : 'bg-muted-foreground/50',
                  )}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.category}</p>
                  {item.note ? (
                    <p className="truncate text-xs text-muted-foreground">{item.note}</p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center gap-2">
                <span
                  className={cn(
                    'text-sm font-semibold tabular-nums',
                    item.type === 'income' ? 'text-emerald-600' : 'text-foreground',
                  )}
                >
                  {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground focus-visible:opacity-100 group-hover/row:opacity-100 sm:[.group\/row:hover_&]:opacity-100 [div:hover>&]:opacity-100"
                      aria-label={MOVIMIENTOS.actions.menuLabel}
                    >
                      <HugeiconsIcon icon={MoreHorizontalIcon} size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[140px]">
                    <DropdownMenuItem asChild>
                      <Link to="/transactions/$id" params={{ id: item.id }}>
                        <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                        {MOVIMIENTOS.actions.edit}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(item)}
                    >
                      <HugeiconsIcon icon={Delete01Icon} size={14} />
                      {MOVIMIENTOS.actions.delete}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
