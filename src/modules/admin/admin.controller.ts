import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateServiceDto } from '../service/domain/create-service.dto';
import { CreateWorkerDto } from '../worker/domain/create-worker.dto';

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
    console.log(dto);

    return await this._service.createService(req.headers, dto);
  }

  @Delete('/services/:id')
  async deleteService(@Req() req: Request, @Param('id') id: string) {
    return await this._service.deleteService(req.headers, id);
  }

  // workers

  @Get('/workers')
  async getWorkers(@Req() req: Request) {
    return await this._service.getWorkers(req.headers);
  }

  @Get('/workers/:id')
  async getWorker(@Req() req: Request, @Param('id') id: string) {
    return await this._service.getWorker(req.headers, id);
  }

  @Post('/workers')
  async createWorker(@Req() req: Request, @Body() dto: CreateWorkerDto) {
    return await this._service.createWorker(req.headers, dto);
  }

  @Post('/workers/:id/deactivate')
  async deactivateWorker(@Req() req: Request, @Param('id') id: string) {
    return await this._service.deactivateWorker(req.headers, id);
  }

  @Post('/workers/:id/activate')
  async activateWorker(@Req() req: Request, @Param('id') id: string) {
    return await this._service.activateWorker(req.headers, id);
  }

  @Delete('/workers/:id')
  async deleteWorker(@Req() req: Request, @Param('id') id: string) {
    return await this._service.deleteWorker(req.headers, id);
  }

  @Post('/workers/:workerId/service/:serviceId')
  async addWorkerService(
    @Req() req: Request,
    @Param('workerId') workerId: string,
    @Param('serviceId') serviceId: string,
  ) {
    return await this._service.assignServiceToWorker(
      req.headers,
      workerId,
      serviceId,
    );
  }

  @Delete('/workers/:workerId/service/:serviceId')
  async removeServiceFromWorker(
    @Req() req: Request,
    @Param('workerId') workerId: string,
    @Param('serviceId') serviceId: string,
  ) {
    return await this._service.removeServiceFromWorker(
      req.headers,
      workerId,
      serviceId,
    );
  }
}
