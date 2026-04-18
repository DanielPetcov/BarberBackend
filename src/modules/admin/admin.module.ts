import { Module } from '@nestjs/common';
import { ServiceModule } from '../service/service.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { WorkerModule } from '../worker/worker.module';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  imports: [ServiceModule, WorkerModule, ReservationModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
