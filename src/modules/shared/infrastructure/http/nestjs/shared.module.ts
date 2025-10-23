import { join } from 'node:path';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import KeyvRedis from '@keyv/redis';
import { CacheService } from '@modules/shared/application/cache/cache.service';
import { Request, Response } from 'express';
import { LoggerModule } from 'nestjs-pino';

import { RedisCacheService } from '../../caching/redis/redis-cache.service';
import { createTypeOrmConfig } from '../../persistence/typeorm/nest-typeorm.config';
import { HealthCheckController } from './controllers/health-check.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const env = configService.get<
          'local' | 'production' | 'development' | 'testing'
        >('NODE_ENV');

        const isProduction = env === 'production';

        return {
          pinoHttp: {
            level: isProduction ? 'info' : 'debug',
            transport: isProduction ? undefined : { target: 'pino-pretty' },
            genReqId: (req: Request, res): string => {
              const existingID = req.trackId!;

              res.setHeader('X-Track-Id', existingID ?? 'NO_TRACK_ID');

              return existingID;
            },
            serializers: {
              req: (req: Request): Record<string, any> => ({
                trackId: req.id,
                method: req.method,
                url: req.url,
                headers: {
                  'user-agent': req.headers['user-agent'],
                  'content-type': req.headers['content-type'],
                  'authorization': req.headers.authorization
                    ? '[HIDDEN]'
                    : undefined,
                },
              }),
              res: (res: Response): Record<string, any> => ({
                statusCode: res.statusCode,
              }),
            },
          },
        };
      },
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

    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('CACHE_HOST');
        const port = configService.get<number>('CACHE_PORT');
        const URL = `redis://${host}:${port}`;

        return {
          stores: [new KeyvRedis(URL)],
        };
      },
    }),
  ],

  providers: [
    RedisCacheService,

    {
      provide: CacheService,
      useClass: RedisCacheService,
    },
  ],

  controllers: [HealthCheckController],

  exports: [CacheService],
})
export class SharedModule {}
