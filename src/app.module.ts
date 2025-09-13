import { MiddlewareConsumer, Module } from '@nestjs/common';

import { ItemsModule } from './modules/items/infraestructure/http/nestjs/items.module';
import { SharedModule } from './modules/shared/infraestructure/http/nestjs/core.module';
import { AddTrackerIdMiddleware } from './modules/shared/infraestructure/http/nestjs/middlewares/add-tracker-id.middleware';
import { LogsMiddleware } from './modules/shared/infraestructure/http/nestjs/middlewares/logs.middleware';

@Module({
  imports: [SharedModule, ItemsModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AddTrackerIdMiddleware, LogsMiddleware).forRoutes('/*path');
  }
}
