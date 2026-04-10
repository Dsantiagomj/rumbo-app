import { Delete01Icon, MoreHorizontalIcon, PencilEdit01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Transaction } from '@rumbo/shared';
import { Link } from '@tanstack/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';
import { TRANSACTIONS } from '../strings';
import { formatCurrency, groupByDate } from '../utils';

interface TransactionsListProps {
  items: Transaction[];
  searchQuery?: string;
  onDelete: (item: Transaction) => void;
}

export function TransactionsList({ items, searchQuery, onDelete }: TransactionsListProps) {
  if (!items.length) {
    const isSearchEmptyState = Boolean(searchQuery);

    return (
      <div className="py-8 text-center">
        <h3 className="font-medium">
          {isSearchEmptyState ? TRANSACTIONS.emptySearchTitle : TRANSACTIONS.emptyTitle}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {isSearchEmptyState ? TRANSACTIONS.emptySearchDescription : TRANSACTIONS.emptyDescription}
        </p>
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
              className="group/row mx-1 flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/30 sm:px-4"
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
                  <p className="text-sm font-medium">
                    <HighlightMatch text={item.category} query={searchQuery} />
                  </p>
                  {item.note ? (
                    <p className="truncate text-xs text-muted-foreground">
                      <HighlightMatch text={item.note} query={searchQuery} />
                    </p>
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
                  {item.type === 'income' ? '+' : '-'}{' '}
                  <HighlightMatch text={formatCurrency(item.amount)} query={searchQuery} />
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground focus-visible:opacity-100 group-hover/row:opacity-100 sm:[.group\/row:hover_&]:opacity-100 [div:hover>&]:opacity-100"
                      aria-label={TRANSACTIONS.actions.menuLabel}
                    >
                      <HugeiconsIcon icon={MoreHorizontalIcon} size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[140px]">
                    <DropdownMenuItem asChild>
                      <Link to="/transactions/$id" params={{ id: item.id }}>
                        <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                        {TRANSACTIONS.actions.edit}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(item)}
                    >
                      <HugeiconsIcon icon={Delete01Icon} size={14} />
                      {TRANSACTIONS.actions.delete}
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

function HighlightMatch({ text, query }: { text: string; query?: string }) {
  const normalizedQuery = query?.trim();

  if (!normalizedQuery) {
    return text;
  }

  const normalizedText = text.toLowerCase();
  const normalizedNeedle = normalizedQuery.toLowerCase();

  if (!normalizedText.includes(normalizedNeedle)) {
    return text;
  }

  const segments: Array<{ value: string; highlighted: boolean }> = [];
  let cursor = 0;

  while (cursor < text.length) {
    const matchIndex = normalizedText.indexOf(normalizedNeedle, cursor);

    if (matchIndex === -1) {
      segments.push({ value: text.slice(cursor), highlighted: false });
      break;
    }

    if (matchIndex > cursor) {
      segments.push({ value: text.slice(cursor, matchIndex), highlighted: false });
    }

    const end = matchIndex + normalizedNeedle.length;
    segments.push({ value: text.slice(matchIndex, end), highlighted: true });
    cursor = end;
  }

  return (
    <>
      {segments.map((segment, index) =>
        segment.highlighted ? (
          <mark
            key={`${segment.value}-${index}`}
            className="rounded bg-primary/15 px-0.5 text-current"
          >
            {segment.value}
          </mark>
        ) : (
          <span key={`${segment.value}-${index}`}>{segment.value}</span>
        ),
      )}
    </>
  );
}
