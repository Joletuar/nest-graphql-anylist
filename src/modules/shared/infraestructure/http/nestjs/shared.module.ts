import { join } from 'node:path';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ItemModel } from 'src/modules/items/infraestructure/persitence/typeorm/item.model';
import { UserModel } from 'src/modules/users/infraestructure/persitence/typeorm/user.model';

import { FallbackController } from './controllers/fallback.controller';
import { HealthCheckController } from './controllers/health-check.controller';
import { ParseUlidPipe } from './pipes/parse-ulid.pipe';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get<string>('TYPE_ORM_HOST'),
        port: configService.get<number>('TYPE_ORM_PORT'),
        username: configService.get<string>('TYPE_ORM_USERNAME'),
        password: configService.get<string>('TYPE_ORM_PASSWORD'),
        database: configService.get<string>('TYPE_ORM_DATABASE'),
        applicationName: 'NEST_GRAPHQL_ANYLIST',
        migrations: [
          `${process.cwd()}/dist/src/modules/shared/infraestructure/persitence/typeorm/migrations/**`,
        ],
        entities: [ItemModel, UserModel],
        migrationsRun: false,
        useUTC: true,
        logging: true,
        synchronize: false,
      }),
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

  providers: [ParseUlidPipe],

  controllers: [HealthCheckController, FallbackController],

  exports: [],
})
export class SharedModule {}
