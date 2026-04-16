import { Injectable } from '@nestjs/common';
import { ServiceRepository } from './service.repository';
import { CreateServiceDto } from './domain/create-service.dto';

@Injectable()
export class ServiceService {
  constructor(private readonly _repo: ServiceRepository) {}

  async getAll(businessId: string) {
    return await this._repo.getAll(businessId);
  }

  async get(serviceId: string, businessId: string) {
    return await this._repo.get(serviceId, businessId);
  }

  async create(businessId: string, dto: CreateServiceDto) {
    return await this._repo.create({ ...dto, businessId: businessId });
  }

  async delete(serviceId: string, businessId: string) {
    return await this._repo.delete(serviceId, businessId);
  }

  async getServiceAvailableWorkers(serviceId: string) {
    return await this._repo.getServiceAvailableWorkers(serviceId);
  }

  // public
  async getAllPublic() {
    return await this._repo.getAllPublic();
  }
}
