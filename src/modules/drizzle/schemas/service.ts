import { boolean } from 'drizzle-orm/pg-core';
import { pgTable, uuid, varchar, text, integer } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { business } from './business';

export const service = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessId: uuid('business_id')
    .references(() => business.id)
    .notNull(),

  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),
  price: integer('price').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  isActive: boolean('is_active').default(true).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
});

export type CreateService = typeof service.$inferInsert;
export type UpdateService = Partial<typeof service.$inferInsert>;
