import { Injectable } from '@nestjs/common';
import { ServiceService } from '../service/service.service';
import { getBusinessId } from 'src/helpers';
import { CreateServiceDto } from '../service/domain/create-service.dto';

@Injectable()
export class AdminService {
  constructor(private readonly _serviceService: ServiceService) {}

  async getServices() {
    const businessId = await getBusinessId();
    return await this._serviceService.getAll(businessId);
  }

  async getService(serviceId: string) {
    const businessId = await getBusinessId();
    return await this._serviceService.get(serviceId, businessId);
  }

  async createService(dto: CreateServiceDto) {
    const businessId = await getBusinessId();
    return await this._serviceService.create(businessId, dto);
  }
}
