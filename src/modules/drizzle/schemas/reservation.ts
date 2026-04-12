import { timestamp } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable, date, text } from 'drizzle-orm/pg-core';
import { reservationStatuses } from './enums';
import { business } from './business';

export const reservation = pgTable('reservations', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessId: uuid('business_id')
    .references(() => business.id)
    .notNull(),

  reservationDate: date('reservation_date', { mode: 'date' }).notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  status: reservationStatuses('reservation_roles').default('pending').notNull(),
  notes: text('notes'),
  cancelReason: text('notes'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
});
