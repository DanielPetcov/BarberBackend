import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BusinessRepository } from './business.repository';
import { CreateBusiness, UpdateBusiness } from '../drizzle/schemas';

@Injectable()
export class BusinessService {
  constructor(private readonly _repo: BusinessRepository) {}

  async getBusiness(businessId: string) {
    const business = await this._repo.get(businessId);
    if (!business) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    return business;
  }

  async createBusiness(dto: CreateBusiness) {
    const business = await this._repo.create(dto);
    return business;
  }

  async updateBusiness(businessId: string, dto: UpdateBusiness) {
    const business = await this._repo.update(businessId, dto);
    return business;
  }
}
