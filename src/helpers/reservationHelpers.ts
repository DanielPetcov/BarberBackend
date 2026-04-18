export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.slice(0, 5).split(':').map(Number);
  return hours * 60 + minutes;
}

export function toDateOnlyString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getDayOfWeekFromDateString(date: string): number {
  const [year, month, day] = date.split('-').map(Number);
  const localDate = new Date(year, month - 1, day);
  return localDate.getDay(); // 0 Sunday ... 6 Saturday
}

export function hasOverlap(
  newStart: string,
  newEnd: string,
  existingStart: string,
  existingEnd: string,
): boolean {
  const ns = timeToMinutes(newStart);
  const ne = timeToMinutes(newEnd);
  const es = timeToMinutes(existingStart);
  const ee = timeToMinutes(existingEnd);

  return ns < ee && ne > es;
}

export function isWithinRange(
  start: string,
  end: string,
  rangeStart: string,
  rangeEnd: string,
): boolean {
  const s = timeToMinutes(start);
  const e = timeToMinutes(end);
  const rs = timeToMinutes(rangeStart);
  const re = timeToMinutes(rangeEnd);

  return s >= rs && e <= re;
}
