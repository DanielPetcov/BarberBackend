import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { ServiceService } from '../service/service.service';
import { WorkerBusySlotsDto } from './domain/workerBusySlots.dto';
import {
  buildDateTime,
  normalizeTimeString,
  resolveStartAndEndTimeFromSlot,
} from 'src/helpers';
import { WorkerBusyCalendarDto } from './domain/workerBusyCalendar.dto';
import { Reservation } from '../drizzle/schemas';
import { CreateReservationDto } from './domain/create-reservation.dto';
import { BusinessService } from '../business/business.service';
import { ReservationResponse } from './domain/reservation-response.dto';

@Injectable()
export class ReservationService {
  constructor(
    private readonly _repo: ReservationRepository,
    private readonly _serviceService: ServiceService,
    private readonly _businessService: BusinessService,
  ) {}

  private logger = new Logger(ReservationService.name);

  async createReservation(dto: CreateReservationDto, businessSlug: string) {
    try {
      const businessId =
        await this._businessService.getBusinessIdBySlug(businessSlug);
      if (!businessId) throw new Error('Invalid businessSlug');

      const workerService = await this._serviceService.getWorkerService(
        dto.barberId,
        dto.serviceId,
      );
      if (!workerService) throw new Error('Failed to fetch worker service');

      const times = resolveStartAndEndTimeFromSlot(dto.timeSlot, workerService);

      if (!times) throw new Error('Failed to resolve the timeslot');

      const startTime = times.startTime;
      const endTime = times.endTime;
      const reservationDate = dto.date;

      if (!startTime || !endTime) {
        throw new BadRequestException('Invalid reservation date or time');
      }

      const reservation = await this._repo.createReservation({
        businessId,
        startTime,
        endTime,
        workerId: dto.barberId,
        serviceId: dto.serviceId,
        reservationDate,
      });

      return this.toDto(reservation);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getServiceAvailableWorkers(serviceId: string) {
    return await this._serviceService.getServiceAvailableWorkers(serviceId);
  }

  async getWorkerTotalReservations(workerId: string) {
    return await this._repo.getWorkerTotalReservations(workerId);
  }

  async getWorkerBusySlots(
    workerId: string,
    reservationDate: string,
  ): Promise<WorkerBusySlotsDto> {
    const reservations = await this._repo.getWorkerReservationsByDate(
      workerId,
      reservationDate,
    );

    return {
      date: reservationDate,
      busySlots: reservations.map((r) => ({
        startTime: normalizeTimeString(r.startTime),
        endTime: normalizeTimeString(r.endTime),
      })),
    };
  }

  async getWorkerBusyCalendar(
    workerId: string,
    from: string,
    to?: string,
  ): Promise<WorkerBusyCalendarDto> {
    const reservations = await this._repo.getWorkerReservationsInRange(
      workerId,
      from,
      to,
    );

    const grouped = new Map<string, Reservation[]>();

    for (const reservation of reservations) {
      const key = reservation.reservationDate;

      const current = grouped.get(key) ?? [];
      current.push(reservation);
      grouped.set(key, current);
    }

    const fullyBookedDates: string[] = [];

    for (const [date, dayReservations] of grouped.entries()) {
      const occupiedSlots = dayReservations.length;

      if (occupiedSlots >= 18) {
        fullyBookedDates.push(date);
      }
    }

    return { fullyBookedDates };
  }

  private toDto(reservation: Reservation): ReservationResponse {
    return {
      id: reservation.id,
      startTime: normalizeTimeString(reservation.startTime),
      reservationDate: reservation.reservationDate,
    };
  }
}
