import { ConfigFactory } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env['TYPE_ORM_HOST'],
  port: process.env['TYPE_ORM_PORT'],
  username: process.env['TYPE_ORM_USERNAME'],
  password: process.env['TYPE_ORM_PASSWORD'],
  database: process.env['TYPE_ORM_DATABASE'],
  applicationName: 'NEST_GRAPHQL_ANYLIST',
  synchronize: false,
  migrations: [
    `${process.cwd()}/dist/src/modules/shared/infraestructure/persitence/typeorm/migrations/**`,
  ],
  migrationsRun: false,
  useUTC: true,
  logging: true,
};

export const TypeOrmConfigFactory: ConfigFactory = () => typeOrmConfig;
