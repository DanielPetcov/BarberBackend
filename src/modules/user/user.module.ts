import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { UserController } from './user.controller';

@Module({
  imports: [DrizzleModule],
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
