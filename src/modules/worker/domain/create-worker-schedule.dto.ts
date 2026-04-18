import {
  IsInt,
  Min,
  Max,
  Matches,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  IsBoolean,
} from 'class-validator';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

@ValidatorConstraint({ name: 'isEndAfterStart', async: false })
class IsEndAfterStartConstraint implements ValidatorConstraintInterface {
  validate(endHour: string, args: ValidationArguments) {
    const object = args.object as CreateWorkerScheduleDto;
    if (!object.startHour || !endHour) return true;
    return endHour > object.startHour;
  }

  defaultMessage() {
    return 'endHour must be later than startHour';
  }
}

export class CreateWorkerScheduleDto {
  @IsInt()
  @Min(0)
  @Max(6)
  day: number;

  @Matches(TIME_REGEX, { message: 'startHour must be in HH:mm format' })
  startHour: string;

  @Matches(TIME_REGEX, { message: 'endHour must be in HH:mm format' })
  @Validate(IsEndAfterStartConstraint)
  endHour: string;

  @IsBoolean()
  isWorking: boolean;
}
