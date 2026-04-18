import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { AvailabilityOverridesService } from './availabilityOverrides.service';
import { isDateOnlyString } from 'src/helpers';
import { CreateAvailabilityOverrideDto } from './domain/create-availability-override.dto';

@Controller('availability-overrides')
export class AvailabilityOverridesController {
  constructor(private readonly _service: AvailabilityOverridesService) {}

  @Get('/:barberId')
  async getAvailabilityOverride(
    @Param('barberId') barberId: string,
    @Query('date') date: string,
  ) {
    if (!date) throw new BadRequestException('missing date');
    if (!isDateOnlyString(date)) {
      throw new BadRequestException('date must be in format YYYY-MM-DD');
    }
    return await this._service.getAvailabilityOverride(barberId, date);
  }

  @Post()
  async createAvailabilityOverride(
    @Req() req: Request,
    @Body() dto: CreateAvailabilityOverrideDto,
  ) {
    return await this._service.createAvailabilityOverride(req.headers, dto);
  }

  @Delete('overrideId')
  async deleteAvailabilityOverride(@Param('overrideId') overrideId: string) {
    return await this._service.deleteAvailabilityOverride(overrideId);
  }
}
