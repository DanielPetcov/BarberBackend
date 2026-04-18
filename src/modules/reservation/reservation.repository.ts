import { Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '../drizzle/schemas';
import { and, eq, gte, lte } from 'drizzle-orm';
import { ReservationResponseWithWorkerDto } from './domain/reservation-response.dto';

import { Reservation } from '../drizzle/schemas';

interface CreateReservationRepoDto {
  businessId: string;
  workerId: string;
  serviceId: string;
  reservationDate: string;
  startTime: string;
  endTime: string;
}

// {
//   businessId: "1ac3b679-fe4f-4c42-a9eb-0cb28e303d85",
//   workerId: "734b26cb-737b-42d2-bcd6-abdc74e52528",
//   serviceId: "f5647f82-3158-43f0-9ffc-c6d2ea841aa6",
//   reservationDate: "2026-04-21",
//   startTime: "09:30:00",
//   endTime: "10:00:00"
// }

@Injectable()
export class ReservationRepository {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly _db: NodePgDatabase<typeof schema>,
  ) {}

  async createReservation(dto: CreateReservationRepoDto) {
    const [reservation] = await this._db
      .insert(schema.reservation)
      .values(dto)
      .returning();

    return reservation;
  }

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
    reservationDate: string,
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
    from: string,
    to?: string,
  ): Promise<Reservation[]> {
    return await this._db.query.reservation.findMany({
      where: and(
        eq(schema.reservation.workerId, workerId),
        gte(schema.reservation.reservationDate, from),
        ...(to ? [lte(schema.reservation.reservationDate, to)] : []),
      ),
      orderBy: (reservation, { asc }) => [
        asc(reservation.reservationDate),
        asc(reservation.startTime),
      ],
    });
  }
}
