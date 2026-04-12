import { Injectable } from '@nestjs/common';
import { ServiceService } from '../service/service.service';
import { getBusinessIdAdmin } from 'src/helpers';
import { CreateServiceDto } from '../service/domain/create-service.dto';
import { UserService } from '../user/user.service';
import { CreateWorkerDto } from '../user/domain/create-worker.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly _serviceService: ServiceService,
    private readonly _userService: UserService,
  ) {}

  // services

  async getServices() {
    const businessId = await getBusinessIdAdmin();
    return await this._serviceService.getAll(businessId);
  }

  async getService(serviceId: string) {
    const businessId = await getBusinessIdAdmin();
    return await this._serviceService.get(serviceId, businessId);
  }

  async createService(dto: CreateServiceDto) {
    const businessId = await getBusinessIdAdmin();
    return await this._serviceService.create(businessId, dto);
  }

  async deleteService(serviceId: string) {
    const businessId = await getBusinessIdAdmin();
    return await this._serviceService.delete(serviceId, businessId);
  }

  // workers

  async getWorkers() {
    return await this._userService.getAllWorkers();
  }

  async getWorker(workerId: string) {
    return await this._userService.getWorker(workerId);
  }

  async createWorker(dto: CreateWorkerDto) {
    return await this._userService.createWorker(dto);
  }

  async deactivateWorker(workerId: string) {
    return await this._userService.deactivateWorker(workerId);
  }

  async activateWorker(workerId: string) {
    return await this._userService.activateWorker(workerId);
  }

  async deleteWorker(workerId: string) {
    return await this._userService.deleteWorker(workerId);
  }
}
