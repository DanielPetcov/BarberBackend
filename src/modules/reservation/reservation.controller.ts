import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly _service: ReservationService) {}

  @AllowAnonymous()
  @Get('/service/:serviceId/workers')
  async getServiceAvailableWorkers(@Param('serviceId') serviceId: string) {
    return await this._service.getServiceAvailableWorkers(serviceId);
  }

  @AllowAnonymous()
  @Get('/workers/:workerId/slots')
  async getWorkerBusySlots(
    @Query('date') date: Date,
    @Query('serviceId') serviceId: string,
  ) {
    return await this._service.getWorkerBusySlots(serviceId, date);
  }

  @AllowAnonymous()
  @Get('/workers/:workerId/calendar')
  async getWorker(
    @Param('workerId') workerId: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ) {
    return await this._service.getWorkerBusyCalendar(workerId, from, to);
  }
}
