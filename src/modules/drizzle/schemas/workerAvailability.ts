import { pgTable, uuid, timestamp, boolean } from 'drizzle-orm/pg-core';
import { worker } from './worker';

import { dayOfWeek } from './enums';
import { business } from './business';

export const workerAvailability = pgTable('worker_availability', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessId: uuid('business_id')
    .references(() => business.id)
    .notNull(),

  workerId: uuid('worker_id')
    .references(() => worker.id)
    .notNull(),
  dayOfWeek: dayOfWeek('day_of_week').notNull(),

  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),

  isWorkingDay: boolean('is_working_day').default(true).notNull(),
});
