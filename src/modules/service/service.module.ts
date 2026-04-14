import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { ServiceService } from './service.service';
import { ServiceRepository } from './service.repository';
import { ServiceController } from './service.controller';

@Module({
  imports: [DrizzleModule],
  providers: [ServiceService, ServiceRepository],
  controllers: [ServiceController],
  exports: [ServiceService],
})
export class ServiceModule {}
