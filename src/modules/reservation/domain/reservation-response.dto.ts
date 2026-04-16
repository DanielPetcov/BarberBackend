import { Reservation } from 'src/modules/drizzle/schemas';

export interface ReservationResponseWithWorkerDto extends Reservation {
  worker: {
    id: string;
  };
}
