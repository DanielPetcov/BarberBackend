import { timestamp } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable, date, text } from 'drizzle-orm/pg-core';
import { reservationRoles } from './enums';

export const reservation = pgTable('reservations', {
  id: uuid('id').defaultRandom().primaryKey(),

  reservationDate: date('reservation_date', { mode: 'date' }).notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  status: reservationRoles('reservation_roles').notNull(),
  notes: text('notes'),
  cancelReason: text('notes'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
});
