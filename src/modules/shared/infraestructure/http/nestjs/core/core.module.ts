import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { EnviromentsFactory } from '../../../config/enviroments';
import {
  typeOrmConfig,
  TypeOrmConfigFactory,
} from '../../../persitence/typeorm/typeorm-config';
import { FallbackController } from './controllers/fallback.controller';
import { HealthCheckController } from './controllers/health-check.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnviromentsFactory, TypeOrmConfigFactory],
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (): TypeOrmModuleOptions => typeOrmConfig,
    }),
  ],

  providers: [],

  controllers: [HealthCheckController, FallbackController],

  exports: [],
})
export class CoreModule {}
