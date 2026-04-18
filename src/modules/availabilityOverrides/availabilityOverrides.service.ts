import { Injectable } from '@nestjs/common';
import { AvailabilityOverridesRepositor } from './availabilityOverrides.repository';
import { CreateAvailabilityOverrideDto } from './domain/create-availability-override.dto';
import { getBusinessIdAdmin } from 'src/helpers';

@Injectable()
export class AvailabilityOverridesService {
  constructor(private readonly _repo: AvailabilityOverridesRepositor) {}

  async getAvailabilityOverride(barberId: string, date: string) {
    return await this._repo.get(barberId, date);
  }

  async createAvailabilityOverride(
    headers: Headers,
    dto: CreateAvailabilityOverrideDto,
  ) {
    const businessId = await getBusinessIdAdmin(headers);
    if (!businessId) throw new Error('Missing businessId');

    return await this._repo.create({ ...dto, businessId: businessId });
  }

  async deleteAvailabilityOverride(availabilityOverrideId: string) {
    return await this._repo.delete(availabilityOverrideId);
  }
}
