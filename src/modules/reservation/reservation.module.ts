import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { ReservationService } from './reservation.service';
import { ReservationRepository } from './reservation.repository';
import { ReservationController } from './reservation.controller';
import { ServiceModule } from '../service/service.module';

@Module({
  imports: [DrizzleModule, ServiceModule],
  providers: [ReservationService, ReservationRepository],
  controllers: [ReservationController],
  exports: [ReservationService],
})
export class ReservationModule {}
