import { pgTable, uuid, integer, primaryKey, index } from 'drizzle-orm/pg-core';
import { worker } from './worker';
import { service } from './service';
import { boolean } from 'drizzle-orm/pg-core';
import { business } from './business';

export const workerServices = pgTable(
  'workerServices',
  {
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

    customPrice: integer('custom_price'),
    customDurationMinutes: integer('custom_duration_minutes'),

    isActive: boolean('is_active').default(true).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.workerId, table.serviceId] }),
    index('worker_services_worker_id_idx').on(table.workerId),
    index('worker_services_service_id_idx').on(table.serviceId),
  ],
);
