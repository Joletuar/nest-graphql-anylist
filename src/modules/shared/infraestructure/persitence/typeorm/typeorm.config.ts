import { join } from 'node:path';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ItemModel } from 'src/modules/items/infraestructure/persitence/typeorm/item.model';
import { UserModel } from 'src/modules/users/infraestructure/persitence/typeorm/user.model';
import { DataSource, DataSourceOptions } from 'typeorm';

const getDataSourceOptions = (): DataSourceOptions => {
  return {
    applicationName: 'NEST_GRAPHQL_ANYLIST',
    type: 'postgres',
    host: process.env.TYPE_ORM_HOST,
    port: Number(process.env.TYPE_ORM_PORT),
    username: process.env.TYPE_ORM_USERNAME,
    password: process.env.TYPE_ORM_PASSWORD,
    database: process.env.TYPE_ORM_DATABASE,
    migrations: [join(__dirname, './migrations/**/*.{ts,js}')],
    entities: [ItemModel, UserModel],
    useUTC: true,
    logging: true,
    synchronize: false,
  };
};

export const createTypeOrmConfig = (): TypeOrmModuleOptions => ({
  ...getDataSourceOptions(),
});

export const AppDataSource = new DataSource(getDataSourceOptions());
export default AppDataSource;
