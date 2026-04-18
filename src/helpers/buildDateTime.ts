export function buildDateTime(date: string, time: string): Date | null {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);

  if (
    [year, month, day, hours, minutes].some(Number.isNaN) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  const value = new Date(year, month - 1, day, hours, minutes, 0, 0);

  if (Number.isNaN(value.getTime())) {
    return null;
  }

  return value;
}
