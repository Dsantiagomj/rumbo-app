import {
  date as dateColumn,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from './auth.js';

export const movimientos = pgTable(
  'movimientos',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
    date: dateColumn('date').notNull(),
    time: text('time').notNull().default('12:00:00'),
    category: text('category').notNull(),
    note: text('note'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    index('movimientos_user_id_date_idx').on(table.userId, table.date),
    index('movimientos_user_id_created_at_idx').on(table.userId, table.createdAt),
  ],
);
