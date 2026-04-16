export * from './getBusinessId';

export function toTimeString(date: Date): string {
  return date.toISOString().slice(11, 16);
}
