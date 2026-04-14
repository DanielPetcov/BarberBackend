import { Controller, Get } from '@nestjs/common';
import { ServiceService } from './service.service';

import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('services')
export class ServiceController {
  constructor(private readonly _service: ServiceService) {}

  @AllowAnonymous()
  @Get()
  async getAllPublic() {
    return await this._service.getAllPublic();
  }
}
