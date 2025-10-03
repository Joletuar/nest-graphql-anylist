import { join } from 'node:path';

import 'dotenv/config';

import { TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { DataSourceOptions } from 'typeorm';

import { ItemModel } from '../../../../items/infrastructure/persistence/typeorm/item.model';
import { ListItemModel } from '../../../../lists/infrastructure/persistence/typeorm/list-item.model';
import { ListModel } from '../../../../lists/infrastructure/persistence/typeorm/list.model';
import { UserModel } from '../../../../users/infrastructure/persistence/typeorm/user.model';

export const typeOrmConfig: TypeOrmOptionsFactory | DataSourceOptions = {
  applicationName: 'NEST_GRAPHQL_ANYLIST',
  type: 'postgres',
  host: process.env.TYPE_ORM_HOST,
  port: Number(process.env.TYPE_ORM_PORT),
  username: process.env.TYPE_ORM_USERNAME,
  password: process.env.TYPE_ORM_PASSWORD,
  database: process.env.TYPE_ORM_DATABASE,
  migrations: [join(__dirname, './migrations/*.{ts,js}')],
  entities: [ItemModel, UserModel, ListModel, ListItemModel],
  useUTC: true,
  logging: true,
  synchronize: false,
};
