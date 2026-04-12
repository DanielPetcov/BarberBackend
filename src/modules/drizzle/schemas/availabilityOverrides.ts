import { pgTable, uuid, timestamp, boolean, text } from 'drizzle-orm/pg-core';
import { worker } from './worker';
import { date } from 'drizzle-orm/pg-core';
import { business } from './business';

export const availabilityOverrides = pgTable('availability_overrides', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessId: uuid('business_id')
    .references(() => business.id)
    .notNull(),

  workerId: uuid('worker_id')
    .references(() => worker.id)
    .notNull(),

  date: date('date').notNull(),

  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),

  isDayOff: boolean('is_day_off').default(true).notNull(),
  note: text('note'),
});
