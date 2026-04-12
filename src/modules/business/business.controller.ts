import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BusinessService } from './business.service';
import type { UpdateBusiness, CreateBusiness } from '../drizzle/schemas';

@Controller('businesses')
export class BusinessController {
  constructor(private readonly _businessService: BusinessService) {}

  @Get(':id')
  async aboutBusiness(@Param('id') id: string) {
    return await this._businessService.getBusiness(id);
  }

  @Post()
  async creataBusiness(@Body() dto: CreateBusiness) {
    return await this._businessService.createBusiness(dto);
  }

  @Patch(':id')
  async updateBusiness(@Param('id') id: string, @Body() dto: UpdateBusiness) {
    return await this._businessService.updateBusiness(id, dto);
  }
}
