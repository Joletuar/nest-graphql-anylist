import { join } from 'node:path';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { createTypeOrmConfig } from 'src/modules/shared/infrastructure/persistence/typeorm/typeorm.config';

import { HealthCheckController } from './controllers/health-check.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      useFactory: createTypeOrmConfig,
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        playground:
          configService.get<'local' | 'production' | 'development' | 'testing'>(
            'NODE_ENV',
          ) === 'local',
        debug:
          configService.get<'local' | 'production' | 'development' | 'testing'>(
            'NODE_ENV',
          ) === 'local',
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      }),
    }),

    CqrsModule.forRoot({ rethrowUnhandled: true }),
  ],

  providers: [],

  controllers: [HealthCheckController],

  exports: [],
})
export class SharedModule {}
