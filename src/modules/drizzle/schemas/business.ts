import { pgTable, uuid, varchar, text } from 'drizzle-orm/pg-core';

export const business = pgTable('businesses', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar({ length: 255 }).notNull().default('test').unique(),

  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  address: varchar('address', { length: 255 }).notNull(),
  city: varchar('city', { length: 255 }),
  description: text('description'),

  timezone: text('timezone').default('Europe/Chisinau').notNull(),

  logoUrl: text('logo_url'),
  telegramChatId: text('telegram_chat_id'),
});

export type CreateBusiness = typeof business.$inferInsert;
export type UpdateBusiness = Partial<typeof business.$inferInsert>;
