import { pgTable, uuid, timestamp, boolean } from 'drizzle-orm/pg-core';
import { worker } from './worker';
import { pgEnum } from 'drizzle-orm/pg-core';

const dayOfWeek = pgEnum('day_of_week', [
  'monday',
  'tuesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]);

export const workerAvailability = pgTable('worker_availability', {
  id: uuid('id').defaultRandom().primaryKey(),

  workerId: uuid('worker_id')
    .references(() => worker.id)
    .notNull(),
  dayOfWeek: dayOfWeek('day_of_week').notNull(),

  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),

  isWorkingDay: boolean('is_working_day').default(true).notNull(),
});
