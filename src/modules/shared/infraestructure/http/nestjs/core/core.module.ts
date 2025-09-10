import { Module } from '@nestjs/common';

import { FallbackController } from './controllers/fallback.controller';
import { HealthCheckController } from './controllers/health-check.controller';

@Module({
  controllers: [HealthCheckController, FallbackController],
  providers: [],
  exports: [],
})
export class CoreModule {}
