import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';
import { userRoles } from './enums';

import { v4 as uuidv4 } from 'uuid';
import { business } from './business';

export const user = pgTable('users', {
  id: text('id')
    .$defaultFn(() => uuidv4())
    .primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),

  // @ Custom attributes
  isActive: boolean('is_active').default(true).notNull(),
  role: userRoles('role').default('worker').notNull(),
  businessId: uuid('business_id').references(() => business.id),
});

export type UpdateUser = Partial<typeof user.$inferInsert>;
