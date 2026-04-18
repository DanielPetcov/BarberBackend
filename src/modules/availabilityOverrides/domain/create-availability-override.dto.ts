import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  ValidateIf,
} from 'class-validator';

const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class CreateAvailabilityOverrideDto {
  @IsUUID()
  workerId: string;

  @IsString()
  @Matches(DATE_REGEX, {
    message: 'date must be in format YYYY-MM-DD',
  })
  date: string;

  @IsBoolean()
  isDayOff: boolean;

  @ValidateIf((o) => o.isDayOff === false)
  @IsString()
  @Matches(TIME_REGEX, {
    message: 'startTime must be in format HH:mm',
  })
  startTime?: string;

  @ValidateIf((o) => o.isDayOff === false)
  @IsString()
  @Matches(TIME_REGEX, {
    message: 'endTime must be in format HH:mm',
  })
  endTime?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
