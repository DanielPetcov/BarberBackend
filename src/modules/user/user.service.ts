import { Injectable } from '@nestjs/common';

import { auth } from '../../auth';
import { UserRepository } from './user.repository';
import { CreateWorkerDto } from './domain/create-worker.dto';
import { getBusinessId } from 'src/helpers';

@Injectable()
export class UserService {
  constructor(private readonly _repo: UserRepository) {}

  async createWorker(dto: CreateWorkerDto) {
    const businessId = await getBusinessId();
    const { user } = await auth.api.signUpEmail({
      body: {
        ...dto,
      },
    });

    await this._repo.update(user.id, { businessId });
  }
}
