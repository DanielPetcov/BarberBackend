import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateWorkerDto } from './domain/create-worker.dto';

@Controller('users')
export class UserController {
  constructor(private readonly _service: UserService) {}

  @Post('worker')
  async newWorker(@Body() dto: CreateWorkerDto) {
    return await this._service.createWorker(dto);
  }
}
