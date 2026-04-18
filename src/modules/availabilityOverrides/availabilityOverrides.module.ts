import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { AvailabilityOverridesService } from './availabilityOverrides.service';
import { AvailabilityOverridesRepositor } from './availabilityOverrides.repository';
import { AvailabilityOverridesController } from './availabilityOverrides.controller';

@Module({
  imports: [DrizzleModule],
  providers: [AvailabilityOverridesService, AvailabilityOverridesRepositor],
  controllers: [AvailabilityOverridesController],
  exports: [AvailabilityOverridesService],
})
export class AvailabilityOverridesModule {}
