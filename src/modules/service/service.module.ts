import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { ServiceService } from './service.service';
import { ServiceRepository } from './service.repository';

@Module({
  imports: [DrizzleModule],
  providers: [ServiceService, ServiceRepository],
  exports: [ServiceService],
})
export class ServiceModule {}
