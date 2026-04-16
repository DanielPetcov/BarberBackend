import { pgTable, uuid, integer, varchar, boolean } from 'drizzle-orm/pg-core';
import { worker } from './worker';

export const workerSchedule = pgTable('worker_schedule', {
  id: uuid('id').defaultRandom().primaryKey(),

  workerId: uuid('worker_id')
    .references(() => worker.id)
    .notNull(),

  dayOfWeek: integer('day_of_week').notNull(), // 0-6
  startTime: varchar('start_time', { length: 5 }).notNull(), // "09:00"
  endTime: varchar('end_time', { length: 5 }).notNull(), // "18:00"
  isWorking: boolean('is_working').default(true).notNull(),
});
