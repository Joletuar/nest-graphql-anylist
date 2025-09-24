import { MiddlewareConsumer, Module } from '@nestjs/common';

import { ItemsModule } from './modules/items/infraestructure/http/nestjs/items.module';
import { AddTrackerIdMiddleware } from './modules/shared/infraestructure/http/nestjs/middlewares/add-tracker-id.middleware';
import { LogsMiddleware } from './modules/shared/infraestructure/http/nestjs/middlewares/logs.middleware';
import { SharedModule } from './modules/shared/infraestructure/http/nestjs/shared.module';
import { UsersModule } from './modules/users/infraestructure/http/nestjs/users.module';

@Module({
  imports: [SharedModule, ItemsModule, UsersModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AddTrackerIdMiddleware, LogsMiddleware).forRoutes('/*path');
  }
}
