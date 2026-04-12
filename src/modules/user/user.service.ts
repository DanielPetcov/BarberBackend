import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { auth } from '../../auth';
import { UserRepository } from './user.repository';
import { CreateWorkerDto } from './domain/create-worker.dto';

@Injectable()
export class UserService {
  constructor(private readonly _repo: UserRepository) {}

  async createWorker(dto: CreateWorkerDto) {
    const session = await auth.api.getSession();
    if (!session || !session.user.businessId || session.user.role === 'client')
      throw new HttpException('Session not present', HttpStatus.FORBIDDEN);

    const businessId = session.user.businessId;
    const { user } = await auth.api.signUpEmail({
      body: {
        ...dto,
      },
    });

    await this._repo.update(user.id, { businessId });
  }
}
