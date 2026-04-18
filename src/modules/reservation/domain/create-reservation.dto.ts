import { Matches, IsUUID, IsString, IsNotEmpty } from 'class-validator';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export class CreateReservationDto {
  @IsUUID()
  serviceId: string;

  @IsUUID()
  barberId: string;

  @IsString()
  @Matches(DATE_REGEX, {
    message: 'date must be in format YYYY-MM-DD',
  })
  date: string;

  @IsString()
  @Matches(TIME_REGEX, {
    message: 'timeSlot must be in format HH:mm',
  })
  timeSlot: string;
}

// {
//   "serviceId": "f5647f82-3158-43f0-9ffc-c6d2ea841aa6",
//   "barberId": "734b26cb-737b-42d2-bcd6-abdc74e52528",
//   "date": "2026-04-21",
//   "timeSlot": "09:30"
// }
