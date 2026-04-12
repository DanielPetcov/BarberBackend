import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { auth } from '../../auth';
import { UserRepository } from './user.repository';
import { CreateWorkerDto } from './domain/create-worker.dto';
import { getBusinessIdAdmin } from 'src/helpers';
import { isAdmin } from 'src/helpers/isAdmin';

@Injectable()
export class UserService {
  constructor(private readonly _repo: UserRepository) {}

  async getAllWorkers(businessId?: string) {
    if (businessId) return await this._repo.getAllWorkers(businessId);

    const localBusinessId = await getBusinessIdAdmin();
    return await this._repo.getAllWorkers(localBusinessId);
  }

  async getWorker(workerId: string, businessId?: string) {
    if (businessId) return await this._repo.getWorker(workerId, businessId);

    const localBusinessId = await getBusinessIdAdmin();
    return await this._repo.getWorker(workerId, localBusinessId);
  }

  async createWorker(dto: CreateWorkerDto, businessId?: string) {
    const admin = await isAdmin();
    if (!admin) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }

    const { user } = await auth.api.signUpEmail({
      body: {
        ...dto,
      },
    });

    if (businessId) {
      return await this._repo.update(user.id, { businessId });
    }

    const localBusinessId = await getBusinessIdAdmin();
    return await this._repo.update(user.id, { businessId: localBusinessId });
  }

  async deactivateWorker(workerId: string) {
    const admin = await isAdmin();
    if (!admin) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    return await this._repo.update(workerId, { isActive: false });
  }

  async activateWorker(workerId: string) {
    const admin = await isAdmin();
    if (!admin) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    return await this._repo.update(workerId, { isActive: true });
  }

  async deleteWorker(workerId: string) {
    const admin = await isAdmin();
    if (!admin) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    return await this._repo.deleteWorker(workerId);
  }
}
