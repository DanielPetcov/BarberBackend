import { BadRequestException } from '@nestjs/common';
import {
  getDayOfWeekFromDateString,
  hasOverlap,
  isWithinRange,
  timeToMinutes,
  toDateOnlyString,
} from 'src/helpers';
import { WorkerSchedule } from 'src/types';

export function validateNotInPast(reservationDate: string, startTime: string) {
  const now = new Date();

  const today = toDateOnlyString(now);

  if (reservationDate < today) {
    throw new BadRequestException('Cannot create reservation in the past');
  }

  if (reservationDate === today) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = timeToMinutes(startTime);

    if (startMinutes <= currentMinutes) {
      throw new BadRequestException('Cannot create reservation in the past');
    }
  }
}

export async function validateSchedule(
  startTime: string,
  endTime: string,
  workerSchedule: WorkerSchedule | null,
) {
  if (!workerSchedule || !workerSchedule.isWorking) {
    throw new BadRequestException('Barber is not working on the selected day');
  }

  if (
    !isWithinRange(
      startTime,
      endTime,
      workerSchedule.startTime,
      workerSchedule.endTime,
    )
  ) {
    throw new BadRequestException(
      'Selected slot is outside barber working hours',
    );
  }
}

export async function validateNoOverlap(
  startTime: string,
  endTime: string,
  sameDayReservations: { startTime: string; endTime: string }[],
) {
  const overlapsExisting = sameDayReservations.some((reservation) =>
    hasOverlap(startTime, endTime, reservation.startTime, reservation.endTime),
  );

  if (overlapsExisting) {
    throw new BadRequestException('Selected slot is already reserved');
  }
}
