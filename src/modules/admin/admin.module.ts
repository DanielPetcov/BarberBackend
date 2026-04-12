import { Module } from '@nestjs/common';
import { ServiceModule } from '../service/service.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ServiceModule, UserModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
