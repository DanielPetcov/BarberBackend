import { timestamp } from 'drizzle-orm/pg-core';
import { uuid, time } from 'drizzle-orm/pg-core';
import { pgTable, date, text } from 'drizzle-orm/pg-core';
import { reservationStatuses } from './enums';
import { business } from './business';
import { worker } from './worker';
import { service } from './service';

export const reservation = pgTable('reservations', {
  id: uuid('id').defaultRandom().primaryKey(),

  businessId: uuid('business_id')
    .references(() => business.id)
    .notNull(),

  workerId: uuid('worker_id')
    .references(() => worker.id)
    .notNull(),

  serviceId: uuid('service_id')
    .references(() => service.id)
    .notNull(),

  reservationDate: date('reservation_date', { mode: 'string' }).notNull(),
  startTime: time('start_time', { precision: 0 }).notNull(),
  endTime: time('end_time', { precision: 0 }).notNull(),

  status: reservationStatuses('status').default('pending').notNull(),
  notes: text('notes'),
  cancelReason: text('cancel_reason'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
});

export type Reservation = typeof reservation.$inferSelect;
