import { Reservation } from 'src/modules/drizzle/schemas';

export interface ReservationResponseWithWorkerDto extends Reservation {
  worker: {
    id: string;
  };
}

export interface ReservationResponse {
  id: string;
  startTime: string; // "HH:mm"
  reservationDate: string; // "YYYY-MM-DD"
}
