import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { ServiceService } from '../service/service.service';
import { WorkerBusySlotsDto } from './domain/workerBusySlots.dto';
import {
  buildDateTime,
  getDayOfWeekFromDateString,
  hasOverlap,
  isWithinRange,
  normalizeTimeString,
  resolveStartAndEndTimeFromSlot,
  timeToMinutes,
  toDateOnlyString,
} from 'src/helpers';
import { WorkerBusyCalendarDto } from './domain/workerBusyCalendar.dto';
import { Reservation } from '../drizzle/schemas';
import { CreateReservationDto } from './domain/create-reservation.dto';
import { BusinessService } from '../business/business.service';
import { ReservationResponse } from './domain/reservation-response.dto';
import { ReservationStatus } from 'src/types';
import { WorkerService } from '../worker/worker.service';
import {
  validateNoOverlap,
  validateNotInPast,
  validateSchedule,
} from './helpers';

@Injectable()
export class ReservationService {
  constructor(
    private readonly _repo: ReservationRepository,
    private readonly _serviceService: ServiceService,
    private readonly _businessService: BusinessService,
    private readonly _workerService: WorkerService,
  ) {}

  private logger = new Logger(ReservationService.name);

  async getReservations(businessId: string) {
    return await this._repo.getReservations(businessId);
  }

  async updateReservationStatus(
    reservationId: string,
    status: ReservationStatus,
  ) {
    return await this._repo.updateReservationStatus(reservationId, status);
  }

  async createReservation(dto: CreateReservationDto, businessSlug: string) {
    try {
      const businessId =
        await this._businessService.getBusinessIdBySlug(businessSlug);
      if (!businessId) throw new Error('Invalid businessSlug');

      const workerService = await this._serviceService.getWorkerService(
        dto.barberId,
        dto.serviceId,
      );
      if (!workerService) throw new Error('Failed to fetch barber service');
      if (!workerService.isActive)
        throw new Error('This service is not available for that barber');

      const reservationDate = dto.date;
      const times = resolveStartAndEndTimeFromSlot(dto.timeSlot, workerService);

      if (!times) throw new Error('Failed to resolve the timeslot');

      const startTime = times.startTime;
      const endTime = times.endTime;

      if (!startTime || !endTime) {
        throw new BadRequestException('Invalid reservation date or time');
      }

      const dayNumber = getDayOfWeekFromDateString(reservationDate);

      // 1. No booking in the past
      validateNotInPast(reservationDate, startTime);

      // 2. Validate worker schedule
      const workerSchedule = await this._workerService.getSchedule(
        dto.barberId,
        dayNumber,
      );
      await validateSchedule(startTime, endTime, workerSchedule);

      // 3. Validate blocked / unavailable periods
      // need to verify the existing exceptions of that worker for that day

      // 4. No overlap for same worker and date
      const busySlots = await this.getWorkerBusySlots(
        dto.barberId,
        reservationDate,
      );
      await validateNoOverlap(startTime, endTime, busySlots.busySlots);

      // 5. Create reservation
      const reservation = await this._repo.createReservation({
        businessId,
        startTime,
        endTime,
        workerId: dto.barberId,
        serviceId: dto.serviceId,
        reservationDate,
      });

      return this.toDto(reservation);
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new BadRequestException('Selected slot is already reserved');
      }

      this.logger.error(error);
      throw error;
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
