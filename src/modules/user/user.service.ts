import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly _repo: UserRepository) {}

  async updateUserBusinessId(userId: string, businessId: string) {
    return await this._repo.update(userId, { businessId });
  }
}
