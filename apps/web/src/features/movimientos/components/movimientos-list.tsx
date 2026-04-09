import type { Movimiento } from '@rumbo/shared';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { MOVIMIENTOS } from '../strings';
import { formatCurrency, formatShortDate, getTypeLabel } from '../utils';

interface MovimientosListProps {
  items: Movimiento[];
  selectedId: string | null;
  onEdit: (item: Movimiento) => void;
  onDelete: (item: Movimiento) => void;
}

export function MovimientosList({ items, selectedId, onEdit, onDelete }: MovimientosListProps) {
  if (!items.length) {
    return (
      <div className="py-8 text-center">
        <h3 className="font-medium">{MOVIMIENTOS.emptyTitle}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{MOVIMIENTOS.emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/60">
      {items.map((item) => {
        const isSelected = item.id === selectedId;

        return (
          <article
            key={item.id}
            className={cn(
              'px-4 py-4 transition-colors sm:px-5',
              isSelected ? 'bg-primary/5' : 'hover:bg-muted/20',
            )}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{item.category}</p>
                  <span className="text-xs text-muted-foreground">{getTypeLabel(item.type)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{formatShortDate(item.date)}</p>
                {item.note ? <p className="text-sm text-muted-foreground">{item.note}</p> : null}
              </div>

              <div className="flex flex-col items-start gap-3 sm:items-end">
                <p
                  className={cn(
                    'text-lg font-semibold',
                    item.type === 'income' ? 'text-emerald-600' : 'text-foreground',
                  )}
                >
                  {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => onEdit(item)}>
                    {MOVIMIENTOS.actions.edit}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(item)}
                  >
                    {MOVIMIENTOS.actions.delete}
                  </Button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
