import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { typeOrmConfig } from './typeorm.config';

export const createTypeOrmConfig = (): TypeOrmModuleOptions =>
  typeOrmConfig as TypeOrmModuleOptions;
