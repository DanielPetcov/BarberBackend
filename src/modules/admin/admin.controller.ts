import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateServiceDto } from '../service/domain/create-service.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly _service: AdminService) {}

  @Get('/services')
  async getServices() {
    const res = await this._service.getServices();
    return res;
  }

  @Get('/services/:id')
  async getService(@Param('id') id: string) {
    const res = await this._service.getService(id);
    return res;
  }

  @Post('/services')
  async createService(@Body() dto: CreateServiceDto) {
    const res = await this._service.createService(dto);
    return res;
  }
}
