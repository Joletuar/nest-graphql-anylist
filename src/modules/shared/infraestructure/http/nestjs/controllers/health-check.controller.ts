import { Controller, Get } from '@nestjs/common';

@Controller('health-check')
export class HealthCheckController {
  @Get('/')
  ok(): string {
    return 'Systems OK';
  }
}
