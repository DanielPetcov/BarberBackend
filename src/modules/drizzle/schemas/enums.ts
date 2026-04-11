import { pgEnum } from 'drizzle-orm/pg-core';
export const userRoles = pgEnum('user_roles', ['admin', 'client']);
export const reservationRoles = pgEnum('reservation_status', [
  'processing',
  'failed',
  'completed',
]);
