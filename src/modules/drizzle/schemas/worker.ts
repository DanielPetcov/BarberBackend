import { pgTable, uuid, varchar, text } from 'drizzle-orm/pg-core';
import { user } from './user';
import { boolean } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';

export const worker = pgTable('workers', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: uuid('user_id')
    .references(() => user.id)
    .notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 255 }),

  photoUrl: text('photo_url'),
  bio: text('bio'),
  telegramChatId: text('telegram_chat_id'),
  isActive: boolean('is_active').default(true).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
});
