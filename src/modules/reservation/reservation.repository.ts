import { Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '../drizzle/schemas';
import { and, eq, gte, lte } from 'drizzle-orm';
import { ReservationResponseWithWorkerDto } from './domain/reservation-response.dto';

import { Reservation } from '../drizzle/schemas';
import { WorkerBusySlotsDto } from './domain/workerBusySlots.dto';

@Injectable()
export class ReservationRepository {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly _db: NodePgDatabase<typeof schema>,
  ) {}

  async getWorkerTotalReservations(
    workerId: string,
  ): Promise<ReservationResponseWithWorkerDto[]> {
    const reservations = this._db.query.reservation.findMany({
      where: eq(schema.reservation.workerId, workerId),
      with: {
        worker: {
          columns: {
            id: true,
          },
        },
      },
    });

    return reservations;
  }

  async getWorkerReservationsByDate(
    workerId: string,
    reservationDate: Date,
  ): Promise<Reservation[]> {
    return await this._db.query.reservation.findMany({
      where: and(
        eq(schema.reservation.workerId, workerId),
        eq(schema.reservation.reservationDate, reservationDate),
      ),
      orderBy: (reservation, { asc }) => [asc(reservation.startTime)],
    });
  }

  async getWorkerReservationsInRange(
    workerId: string,
    from: Date,
    to: Date,
  ): Promise<Reservation[]> {
    return await this._db.query.reservation.findMany({
      where: and(
        eq(schema.reservation.workerId, workerId),
        gte(schema.reservation.reservationDate, from),
        lte(schema.reservation.reservationDate, to),
      ),
      orderBy: (reservation, { asc }) => [
        asc(reservation.reservationDate),
        asc(reservation.startTime),
      ],
    });
  }
}
