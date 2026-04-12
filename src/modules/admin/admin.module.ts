import { Module } from '@nestjs/common';
import { ServiceModule } from '../service/service.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [ServiceModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
