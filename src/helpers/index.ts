export * from './getBusinessId';
export * from './isAdmin';
export * from './resolveStartAndEndTimeFromSlot';
export * from './buildDateTime';

export function normalizeTimeString(time: string): string {
  return time.slice(0, 5);
}

export function isDateOnlyString(value: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value);
}
