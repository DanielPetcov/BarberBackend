import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { CreateReservationDto } from './domain/create-reservation.dto';
import { isDateOnlyString } from 'src/helpers';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly _service: ReservationService) {}

  @AllowAnonymous()
  @Get('/service/:serviceId/barbers')
  async getServiceAvailableWorkers(@Param('serviceId') serviceId: string) {
    return await this._service.getServiceAvailableWorkers(serviceId);
  }

  @AllowAnonymous()
  @Get('/barbers/:barberId/slots')
  async getWorkerBusySlots(
    @Query('date') date: string,
    @Param('barberId') barberId: string,
  ) {
    if (!date) throw new BadRequestException('missing date');
    if (!isDateOnlyString(date)) {
      throw new BadRequestException('date must be in format YYYY-MM-DD');
    }

    return await this._service.getWorkerBusySlots(barberId, date);
  }

  @AllowAnonymous()
  @Get('/barbers/:barberId/calendar')
  async getWorker(
    @Param('barberId') barberId: string,
    @Query('from') from: string,
    @Query('to') to?: string,
  ) {
    if (!from) throw new BadRequestException('missing from');
    if (!isDateOnlyString(from)) {
      throw new BadRequestException('from must be in format YYYY-MM-DD');
    }

    if (to && !isDateOnlyString(to)) {
      throw new BadRequestException('to must be in format YYYY-MM-DD');
    }

    return await this._service.getWorkerBusyCalendar(barberId, from, to);
  }

  @AllowAnonymous()
  @Post(':businessSlug')
  async createReservation(
    @Param('businessSlug') businessSlug: string,
    @Body() dto: CreateReservationDto,
  ) {
    return await this._service.createReservation(dto, businessSlug);
  }
}
