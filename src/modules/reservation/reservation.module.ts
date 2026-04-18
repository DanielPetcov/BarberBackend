import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { ReservationService } from './reservation.service';
import { ReservationRepository } from './reservation.repository';
import { ReservationController } from './reservation.controller';
import { ServiceModule } from '../service/service.module';
import { BusinessModule } from '../business/business.module';
import { WorkerModule } from '../worker/worker.module';

@Module({
  imports: [DrizzleModule, ServiceModule, BusinessModule, WorkerModule],
  providers: [ReservationService, ReservationRepository],
  controllers: [ReservationController],
  exports: [ReservationService],
})
export class ReservationModule {}
