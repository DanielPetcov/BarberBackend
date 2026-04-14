import { relations } from 'drizzle-orm';

import { user } from './user';
import { session, account } from './auth';

import { worker } from './worker';
import { service } from './service';
import { workerServices } from './workerServices';

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const workerRelations = relations(worker, ({ one, many }) => ({
  user: one(user, {
    fields: [worker.userId],
    references: [user.id],
  }),
  workerServices: many(workerServices),
}));

export const serviceRelations = relations(service, ({ many }) => ({
  workerServices: many(workerServices),
}));

export const workerServicesRelations = relations(workerServices, ({ one }) => ({
  worker: one(worker, {
    fields: [workerServices.workerId],
    references: [worker.id],
  }),
  service: one(service, {
    fields: [workerServices.serviceId],
    references: [service.id],
  }),
}));
