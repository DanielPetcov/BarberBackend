import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [DrizzleModule],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
