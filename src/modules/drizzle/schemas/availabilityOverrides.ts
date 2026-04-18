import { pgTable, uuid, boolean, text, time, date } from 'drizzle-orm/pg-core';
import { worker } from './worker';
import { business } from './business';

export const availabilityOverrides = pgTable('availability_overrides', {
  id: uuid('id').defaultRandom().primaryKey(),

  businessId: uuid('business_id')
    .references(() => business.id)
    .notNull(),

  workerId: uuid('worker_id')
    .references(() => worker.id)
    .notNull(),

  date: date('date', { mode: 'string' }).notNull(),

  startTime: time('start_time', { precision: 0 }),
  endTime: time('end_time', { precision: 0 }),

  isDayOff: boolean('is_day_off').default(true).notNull(),
  note: text('note'),
});

export type CreateAvailabilityOverride =
  typeof availabilityOverrides.$inferInsert;
