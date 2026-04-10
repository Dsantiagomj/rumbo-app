import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { MOVIMIENTOS } from '../strings';
import { formatCurrency, getMonthLabel } from '../utils';

interface PeriodNavProps {
  month: string | undefined;
  availableMonths: string[];
  balance: number;
  count: number;
  onMonthChange: (month: string | undefined) => void;
}

export function PeriodNav({
  month,
  availableMonths,
  balance,
  count,
  onMonthChange,
}: PeriodNavProps) {
  const currentIndex = month ? availableMonths.indexOf(month) : -1;
  const hasPrev = currentIndex >= 0 && currentIndex < availableMonths.length - 1;
  const hasNext = currentIndex > 0;
  const periodLabel = month ? getMonthLabel(month) : MOVIMIENTOS.allTimeTitle;

  function handlePrev() {
    if (hasPrev) {
      onMonthChange(availableMonths[currentIndex + 1]);
    }
  }

  function handleNext() {
    if (hasNext) {
      onMonthChange(availableMonths[currentIndex - 1]);
    }
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
      <div className="grid grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] items-center gap-4 sm:flex sm:items-center sm:gap-0.5">
        <Button
          variant="outline"
          size="icon"
          className="size-9 rounded-lg"
          onClick={handlePrev}
          disabled={!hasPrev}
          aria-label={MOVIMIENTOS.nav.prev}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="min-w-0 rounded-lg px-3 py-3 text-center text-lg font-semibold transition-colors hover:bg-muted/50 sm:min-w-[10rem] sm:py-2"
            >
              {periodLabel}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="max-h-72 overflow-y-auto">
            <DropdownMenuItem
              className={!month ? 'font-medium' : ''}
              onClick={() => onMonthChange(undefined)}
            >
              {MOVIMIENTOS.allTimeTitle}
            </DropdownMenuItem>
            {availableMonths.length > 0 ? <DropdownMenuSeparator /> : null}
            {availableMonths.map((m) => (
              <DropdownMenuItem
                key={m}
                className={m === month ? 'font-medium' : ''}
                onClick={() => onMonthChange(m)}
              >
                {getMonthLabel(m)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="icon"
          className="size-9 rounded-lg"
          onClick={handleNext}
          disabled={!hasNext}
          aria-label={MOVIMIENTOS.nav.next}
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </Button>
      </div>

      <div className="flex items-center justify-center sm:justify-end">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-4 py-2 text-sm">
          <span className="font-semibold tabular-nums">{formatCurrency(balance)}</span>
          <span className="text-muted-foreground/40">|</span>
          <span>
            <span className="font-semibold tabular-nums">{count}</span>{' '}
            <span className="text-muted-foreground">{MOVIMIENTOS.nav.movLabel}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
