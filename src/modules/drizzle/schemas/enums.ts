import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoles = pgEnum('user_roles', ['admin', 'worker']);
export const reservationStatuses = pgEnum('reservation_statuses', [
  'pending',
  'confirmed',
  'completed',
  'canceled_by_client',
  'canceled_by_staff',
  'declined',
  'no_show',
]);

export const dayOfWeek = pgEnum('day_of_week', [
  'monday',
  'tuesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]);
