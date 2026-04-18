import { WorkerServiceTableType } from 'src/modules/drizzle/schemas';

interface WorkerServiceWithService extends WorkerServiceTableType {
  service: {
    durationMinutes: number;
  };
}

export function resolveStartAndEndTimeFromSlot(
  timeSlot: string,
  workerService: WorkerServiceWithService,
): { startTime: string; endTime: string } | null {
  const defaultDuration = workerService.service.durationMinutes;
  const workerCustomDuration = workerService.customDurationMinutes;
  const durationMinutes = workerCustomDuration ?? defaultDuration;

  const parts = timeSlot.split(':');
  if (parts.length !== 2) return null;

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  const startTotalMinutes = hours * 60 + minutes;
  const endTotalMinutes = startTotalMinutes + durationMinutes;

  const endHours = Math.floor(endTotalMinutes / 60);
  const endMinutes = endTotalMinutes % 60;

  if (endHours > 23 || (endHours === 23 && endMinutes > 59)) {
    return null;
  }

  return {
    startTime: formatTime(hours, minutes),
    endTime: formatTime(endHours, endMinutes),
  };
}

function formatTime(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
}
