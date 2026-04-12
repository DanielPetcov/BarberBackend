import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { BusinessRepository } from './business.repository';
import { BusinessController } from './business.controller';

@Module({
  imports: [DrizzleModule],
  providers: [BusinessService, BusinessRepository],
  controllers: [BusinessController],
})
export class BusinessModule {}
