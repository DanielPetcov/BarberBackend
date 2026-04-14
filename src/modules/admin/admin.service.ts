import { Injectable } from '@nestjs/common';
import { ServiceService } from '../service/service.service';
import { getBusinessIdAdmin } from 'src/helpers';
import { CreateServiceDto } from '../service/domain/create-service.dto';
import { WorkerService } from '../worker/worker.service';
import { CreateWorkerDto } from '../worker/domain/create-worker.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly _serviceService: ServiceService,
    private readonly _workerService: WorkerService,
  ) {}

  // services

  async getServices(headers: Headers) {
    const businessId = await getBusinessIdAdmin(headers);
    return await this._serviceService.getAll(businessId);
  }

  async getService(headers: Headers, serviceId: string) {
    const businessId = await getBusinessIdAdmin(headers);
    return await this._serviceService.get(serviceId, businessId);
  }

  async createService(headers: Headers, dto: CreateServiceDto) {
    const businessId = await getBusinessIdAdmin(headers);
    return await this._serviceService.create(businessId, dto);
  }

  async deleteService(headers: Headers, serviceId: string) {
    const businessId = await getBusinessIdAdmin(headers);
    return await this._serviceService.delete(serviceId, businessId);
  }

  // workers

  async getWorkers(headers: Headers) {
    return await this._workerService.getAll(headers);
  }

  async getWorker(headers: Headers, workerId: string) {
    return await this._workerService.get(headers, workerId);
  }

  async createWorker(headers: Headers, dto: CreateWorkerDto) {
    return await this._workerService.createWorker(headers, dto);
  }

  async deactivateWorker(headers: Headers, workerId: string) {
    return await this._workerService.deactivateWorker(headers, workerId);
  }

  async activateWorker(headers: Headers, workerId: string) {
    return await this._workerService.activateWorker(headers, workerId);
  }

  async deleteWorker(headers: Headers, workerId: string) {
    return await this._workerService.delete(headers, workerId);
  }
}
