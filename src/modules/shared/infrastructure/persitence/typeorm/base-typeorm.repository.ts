import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';

import { BaseModel } from './base.model';

export abstract class BaseTypeOrmRepository<T extends BaseModel> {
  protected abstract handlerError(error: unknown): never;

  constructor(protected readonly repository: Repository<T>) {}

  getRepository(): Repository<T> {
    return this.repository;
  }

  getDataSource(): DataSource {
    return this.repository.manager.connection;
  }

  createQueryRunner(): QueryRunner {
    return this.getDataSource().createQueryRunner();
  }

  getManager(): EntityManager {
    return this.repository.manager;
  }
}
