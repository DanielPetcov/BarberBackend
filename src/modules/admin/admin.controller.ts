import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateServiceDto } from '../service/domain/create-service.dto';
import { CreateWorkerDto } from '../user/domain/create-worker.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly _service: AdminService) {}

  // services

  @Get('/services')
  async getServices() {
    return await this._service.getServices();
  }

  @Get('/services/:id')
  async getService(@Param('id') id: string) {
    return await this._service.getService(id);
  }

  @Post('/services')
  async createService(@Body() dto: CreateServiceDto) {
    return await this._service.createService(dto);
  }

  @Delete('/services/:id')
  async deleteService(@Param('id') id: string) {
    return await this._service.deleteService(id);
  }

  // workers

  @Get('/workers')
  async getWorkers() {
    return await this._service.getWorkers();
  }

  @Get('/workers/:id')
  async getWorker(@Param('id') id: string) {
    return await this._service.getWorker(id);
  }

  @Post('/workers')
  async createWorker(@Body() dto: CreateWorkerDto) {
    return await this._service.createWorker(dto);
  }

  @Post('/workers/:id/deactivate')
  async deactivateWorker(@Param('id') id: string) {
    return await this._service.deactivateWorker(id);
  }

  @Post('/workers/:id/activate')
  async activateWorker(@Param('id') id: string) {
    return await this._service.activateWorker(id);
  }

  @Delete('/workers/:id')
  async deleteWorker(@Param('id') id: string) {
    return await this._service.deleteWorker(id);
  }
}
