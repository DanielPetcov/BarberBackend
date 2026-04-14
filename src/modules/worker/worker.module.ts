import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerRepository } from './worker.repository';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { WorkerController } from './worker.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DrizzleModule, UserModule],
  providers: [WorkerService, WorkerRepository],
  controllers: [WorkerController],
  exports: [WorkerService],
})
export class WorkerModule {}
