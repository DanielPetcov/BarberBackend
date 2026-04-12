import { Injectable } from '@nestjs/common';
import { ServiceRepository } from './service.repository';
import { CreateServiceDto } from './domain/create-service.dto';

@Injectable()
export class ServiceService {
  constructor(private readonly _repo: ServiceRepository) {}

  async getAll(businessId: string) {
    const res = await this._repo.getAll(businessId);
    return res;
  }

  async get(serviceId: string, businessId: string) {
    const res = await this._repo.get(serviceId, businessId);
    return res;
  }

  async create(businessId: string, dto: CreateServiceDto) {
    const res = await this._repo.create({ ...dto, businessId: businessId });
    return res;
  }
}
