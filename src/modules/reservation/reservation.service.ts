import { Injectable } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { ServiceService } from '../service/service.service';
import { WorkerBusySlotsDto } from './domain/workerBusySlots.dto';
import { toTimeString } from 'src/helpers';
import { WorkerBusyCalendarDto } from './domain/workerBusyCalendar.dto';
import { Reservation } from '../drizzle/schemas';

@Injectable()
export class ReservationService {
  constructor(
    private readonly _repo: ReservationRepository,
    private readonly _serviceService: ServiceService,
  ) {}

  async getServiceAvailableWorkers(serviceId: string) {
    return await this._serviceService.getServiceAvailableWorkers(serviceId);
  }

  async getWorkerTotalReservations(workerId: string) {
    return await this._repo.getWorkerTotalReservations(workerId);
  }

  async getWorkerBusySlots(
    workerId: string,
    reservationDate: Date,
  ): Promise<WorkerBusySlotsDto> {
    const reservations = await this._repo.getWorkerReservationsByDate(
      workerId,
      reservationDate,
    );

    return {
      date: reservationDate,
      busySlots: reservations.map((r) => toTimeString(r.startTime)),
    };
  }

  async getWorkerBusyCalendar(
    workerId: string,
    from: Date,
    to: Date,
  ): Promise<WorkerBusyCalendarDto> {
    const reservations = await this._repo.getWorkerReservationsInRange(
      workerId,
      from,
      to,
    );

    const grouped = new Map<string, Reservation[]>();

    for (const reservation of reservations) {
      const key = reservation.reservationDate.toISOString().slice(0, 10);

      const current = grouped.get(key) ?? [];
      current.push(reservation);
      grouped.set(key, current);
    }

    const fullyBookedDates: string[] = [];

    for (const [date, dayReservations] of grouped.entries()) {
      const occupiedSlots = dayReservations.length; // temporary simple version

      if (occupiedSlots >= 18) {
        fullyBookedDates.push(date);
      }
    }

    return { fullyBookedDates };
  }
}
