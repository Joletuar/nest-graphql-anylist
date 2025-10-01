import { DataSource, DataSourceOptions } from 'typeorm';

import { typeOrmConfig } from './typeorm.config';

const AppDataSource = new DataSource(typeOrmConfig as DataSourceOptions);

export default AppDataSource;
