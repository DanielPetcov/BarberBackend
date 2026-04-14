import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerRepository } from './worker.repository';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { WorkerController } from './worker.controller';

@Module({
  imports: [DrizzleModule],
  providers: [WorkerService, WorkerRepository],
  controllers: [WorkerController],
  exports: [WorkerService],
})
export class WorkerModule {}
