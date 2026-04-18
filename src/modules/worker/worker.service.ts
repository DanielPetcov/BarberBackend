import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { auth } from '../../auth';
import { WorkerRepository } from './worker.repository';
import { CreateWorkerDto } from './domain/create-worker.dto';
import { getBusinessIdAdmin } from 'src/helpers';
import { isAdmin } from 'src/helpers/isAdmin';
import { UserService } from '../user/user.service';
import { CreateWorkerScheduleDto } from './domain/create-worker-schedule.dto';

@Injectable()
export class WorkerService {
  constructor(
    private readonly _repo: WorkerRepository,
    private readonly _userService: UserService,
  ) {}

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
    await this._userService.updateUserBusinessId(user.id, businessId);

    return await this._repo.create({
      businessId,
      userId: user.id,
      fullName: user.name,
    });
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

  async assignService(
    headers: Headers,
    workerId: string,
    serviceId: string,
    businessId: string,
  ): Promise<string> {
    const admin = await isAdmin(headers);
    if (!admin) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }

    const assigned = await this._repo.assignService(
      workerId,
      serviceId,
      businessId,
    );
    if (!assigned)
      throw new HttpException(
        'The relation could not be made',
        HttpStatus.NOT_IMPLEMENTED,
      );
    return assigned;
  }

  async removeSerivce(
    headers: Headers,
    workerId: string,
    serviceId: string,
    businessId: string,
  ): Promise<string> {
    const admin = await isAdmin(headers);
    if (!admin) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }

    const removed = await this._repo.removeService(
      workerId,
      serviceId,
      businessId,
    );
    if (!removed)
      throw new HttpException(
        'The relation could not be deleted',
        HttpStatus.NOT_IMPLEMENTED,
      );
    return removed;
  }

  async getSchedule(workerId: string) {
    return await this._repo.getSchedule(workerId);
  }

  async createSchedule(workerId: string, dto: CreateWorkerScheduleDto) {
    return await this._repo.createSchedule(workerId, dto);
  }

  async deleteSchedule(workerId: string, day: number) {
    return await this._repo.deleteSchedule(workerId, day);
  }
}
