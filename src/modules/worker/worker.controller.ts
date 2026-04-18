import { Controller, Get, Req } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('barbers')
export class WorkerController {
  constructor(private readonly _service: WorkerService) {}

  @AllowAnonymous()
  @Get('/public')
  async getPublicWorkers(@Req() req: Request) {
    return this._service.getAllPublic();
  }
}
