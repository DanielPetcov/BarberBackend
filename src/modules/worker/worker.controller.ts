import { Controller, Get, Req } from '@nestjs/common';
import { WorkerService } from './worker.service';

@Controller()
export class WorkerController {
  constructor(private readonly _service: WorkerService) {}

  @Get('workers/public')
  async getPublicWorkers(@Req() req: Request) {
    return this._service.getAllPublic();
  }
}
