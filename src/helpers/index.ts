import { ReservationStatus, reservationStatus } from 'src/types';

export * from './getBusinessId';
export * from './isAdmin';
export * from './resolveStartAndEndTimeFromSlot';
export * from './buildDateTime';

export * from './reservationHelpers';

export function normalizeTimeString(time: string): string {
  return time.slice(0, 5);
}

export function isDateOnlyString(value: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value);
}

export function isReservationStatus(value: string): value is ReservationStatus {
  return reservationStatus.includes(value as ReservationStatus);
}
