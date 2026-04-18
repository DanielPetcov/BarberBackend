import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateServiceDto } from '../service/domain/create-service.dto';
import { CreateWorkerDto } from '../worker/domain/create-worker.dto';
import { CreateWorkerScheduleDto } from '../worker/domain/create-worker-schedule.dto';
import { isReservationStatus } from 'src/helpers';

@Controller('admin')
export class AdminController {
  constructor(private readonly _service: AdminService) {}

  // services

  @Get('/services')
  async getServices(@Req() req: Request) {
    const data = await this._service.getServices(req.headers);
    console.log(data);
    return data;
  }

  @Get('/services/:id')
  async getService(@Req() req: Request, @Param('id') id: string) {
    return await this._service.getService(req.headers, id);
  }

  @Post('/services')
  async createService(@Req() req: Request, @Body() dto: CreateServiceDto) {
    return await this._service.createService(req.headers, dto);
  }

  @Delete('/services/:id')
  async deleteService(@Req() req: Request, @Param('id') id: string) {
    return await this._service.deleteService(req.headers, id);
  }

  // barbers

  @Get('/barbers')
  async getWorkers(@Req() req: Request) {
    return await this._service.getWorkers(req.headers);
  }

  @Get('/barbers/:id')
  async getWorker(@Req() req: Request, @Param('id') id: string) {
    return await this._service.getWorker(req.headers, id);
  }

  @Post('/barbers')
  async createWorker(@Req() req: Request, @Body() dto: CreateWorkerDto) {
    return await this._service.createWorker(req.headers, dto);
  }

  @Post('/barbers/:id/deactivate')
  async deactivateWorker(@Req() req: Request, @Param('id') id: string) {
    return await this._service.deactivateWorker(req.headers, id);
  }

  @Post('/barbers/:id/activate')
  async activateWorker(@Req() req: Request, @Param('id') id: string) {
    return await this._service.activateWorker(req.headers, id);
  }

  @Delete('/barbers/:id')
  async deleteWorker(@Req() req: Request, @Param('id') id: string) {
    return await this._service.deleteWorker(req.headers, id);
  }

  @Post('/barbers/:barberId/service/:serviceId')
  async addWorkerService(
    @Req() req: Request,
    @Param('barberId') barberId: string,
    @Param('serviceId') serviceId: string,
  ) {
    return await this._service.assignServiceToWorker(
      req.headers,
      barberId,
      serviceId,
    );
  }

  @Delete('/barbers/:barberId/service/:serviceId')
  async removeServiceFromWorker(
    @Req() req: Request,
    @Param('barberId') barberId: string,
    @Param('serviceId') serviceId: string,
  ) {
    return await this._service.removeServiceFromWorker(
      req.headers,
      barberId,
      serviceId,
    );
  }

  @Post('/barbers/:barberId/schedules')
  async createWorkerSchedule(
    @Req() req: Request,
    @Param('barberId') barberId: string,
    @Body() dto: CreateWorkerScheduleDto,
  ) {
    return await this._service.createSchedule(req.headers, barberId, dto);
  }

  @Delete('/barbers/:barberId/schedules/:day')
  async deleteWorkerSchedule(
    @Req() req: Request,
    @Param('barberId') barberId: string,
    @Param('day') day: number,
  ) {
    return await this._service.deleteSchedule(req.headers, barberId, day);
  }

  // reservations

  @Get('/reservations')
  async getReservations(@Req() req: Request) {
    return await this._service.getReservations(req.headers);
  }

  @Patch('/reservations/:reservationId/status/:status')
  async updateReservationStatus(
    @Param('reservationId') reservationId: string,
    @Param('status') status: string,
  ) {
    if (!isReservationStatus(status))
      throw new BadRequestException('status type is invalid');

    return await this._service.updateReservationStatus(reservationId, status);
  }
}
