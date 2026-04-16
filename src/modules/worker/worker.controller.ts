import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { WorkerService } from './worker.service';
import { CreateWorkerScheduleDto } from './domain/create-worker-schedule.dto';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('workers')
export class WorkerController {
  constructor(private readonly _service: WorkerService) {}

  @AllowAnonymous()
  @Get('/public')
  async getPublicWorkers(@Req() req: Request) {
    return this._service.getAllPublic();
  }
}
