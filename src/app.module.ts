import { MiddlewareConsumer, Module } from '@nestjs/common';

import { CoreModule } from './modules/shared/infraestructure/http/nestjs/core/core.module';
import { AddTrackerIdMiddleware } from './modules/shared/infraestructure/http/nestjs/core/middlewares/add-tracker-id.middleware';
import { LogsMiddleware } from './modules/shared/infraestructure/http/nestjs/core/middlewares/logs.middleware';
import { SharedModule } from './modules/shared/infraestructure/http/nestjs/shared/shared.module';

@Module({
  imports: [CoreModule, SharedModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AddTrackerIdMiddleware, LogsMiddleware).forRoutes('/*path');
  }
}
