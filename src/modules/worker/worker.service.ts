import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { auth } from '../../auth';
import { WorkerRepository } from './worker.repository';
import { CreateWorkerDto } from './domain/create-worker.dto';
import { getBusinessIdAdmin } from 'src/helpers';
import { isAdmin } from 'src/helpers/isAdmin';

@Injectable()
export class WorkerService {
  constructor(private readonly _repo: WorkerRepository) {}

  async getAll(headers: Headers) {
    const businessId = await getBusinessIdAdmin(headers);
    return await this._repo.getAll(businessId);
  }

  async getAllPublic() {
    return await this._repo.getAllPublic();
  }

  async get(headers: Headers, workerId: string) {
    const businessId = await getBusinessIdAdmin(headers);
    return await this._repo.get(workerId, businessId);
  }

  async createWorker(headers: Headers, dto: CreateWorkerDto) {
    const admin = await isAdmin(headers);
    if (!admin) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }

    const { user } = await auth.api.signUpEmail({
      body: {
        ...dto,
      },
      headers: headers,
    });

    const businessId = await getBusinessIdAdmin(headers);
    return await this._repo.update(user.id, { businessId: businessId });
  }

  async deactivateWorker(headers: Headers, workerId: string) {
    const admin = await isAdmin(headers);
    if (!admin) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    return await this._repo.update(workerId, { isActive: false });
  }

  async activateWorker(headers: Headers, workerId: string) {
    const admin = await isAdmin(headers);
    if (!admin) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    return await this._repo.update(workerId, { isActive: true });
  }

  async delete(headers: Headers, workerId: string) {
    const admin = await isAdmin(headers);
    if (!admin) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    return await this._repo.delete(workerId);
  }
}
