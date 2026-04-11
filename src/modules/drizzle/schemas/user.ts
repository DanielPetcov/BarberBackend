import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { userRoles } from './enums';

export const user = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),

  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),

  role: userRoles('role').notNull(),
});
