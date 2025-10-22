import { InjectRepository } from '@nestjs/typeorm';

import { CacheService } from '@modules/shared/application/cache/cache.service';
import { Criteria } from '@shared/domain/criteria/criteria.interface';
import { InfraestructureException } from '@shared/domain/exceptions/infraestructure.exception';
import { Nullable } from '@shared/domain/nullable.type';
import { Paginated } from '@shared/domain/paginated.entity';
import { BaseTypeOrmRepository } from '@shared/infrastructure/persistence/typeorm/base-typeorm.repository';
import { TypeOrmException } from '@shared/infrastructure/persistence/typeorm/exceptions/typeorm.exception';
import { TypeOrmCriteriaConverter } from '@shared/infrastructure/persistence/typeorm/typeorm-criteria-converter';
import { User } from '@users/domain/user.entity';
import { UserRepository } from '@users/domain/user.repository';
import { Repository } from 'typeorm';

import { NotFoundUserModelException } from './exceptions/not-found-user-model.exception';
import { TypeOrmUserMapper } from './typeorm-user.mapper';
import { UserModel } from './user.model';

export class TypeOrmUserRepository
  extends BaseTypeOrmRepository<UserModel>
  implements UserRepository
{
  private readonly GET_ALL_USERS_CACHE_KEY = 'GET_ALL_USERS' as const;

  constructor(
    @InjectRepository(UserModel)
    repository: Repository<UserModel>,
    private readonly cacheService: CacheService,
  ) {
    super(repository);
  }

  async create(user: User): Promise<User> {
    try {
      const instance = this.repository.create(user);

      await this.repository.insert(instance);

      const createdUser = await this.repository.findOneBy({
        id: user.id,
      });

      if (!createdUser) throw new NotFoundUserModelException(user.id);

      const domainUser = TypeOrmUserMapper.toDomain(createdUser);

      await this.setInCache(domainUser.id, domainUser);

      return domainUser;
    } catch (error) {
      this.handlerError(error);
    }
  }

  async update(user: User): Promise<User> {
    try {
      const currentUser = await this.repository.preload(user);

      if (!currentUser) throw new NotFoundUserModelException(user.id);

      await this.repository.update(user.id, currentUser);

      const updatedUser = await this.repository.findOneBy({ id: user.id });

      if (!updatedUser) throw new NotFoundUserModelException(user.id);

      const domainUser = TypeOrmUserMapper.toDomain(updatedUser);

      await this.setInCache(domainUser.id, domainUser);

      return domainUser;
    } catch (error) {
      this.handlerError(error);
    }
  }

  async getAll(): Promise<User[]> {
    const cachedUsers = await this.getFromCache<User[]>(
      this.GET_ALL_USERS_CACHE_KEY,
    );

    if (cachedUsers) return cachedUsers;

    try {
      const users = await this.repository.find();

      const domainUsers = TypeOrmUserMapper.toDomainList(users);

      await this.setInCache(this.GET_ALL_USERS_CACHE_KEY, domainUsers);

      return domainUsers;
    } catch (error) {
      this.handlerError(error);
    }
  }

  async findById(id: string): Promise<Nullable<User>> {
    const cachedUser = await this.getFromCache<User>(id);

    if (cachedUser) return cachedUser;

    try {
      const user = await this.repository.findOneBy({ id });

      if (!user) return null;

      const domainUser = TypeOrmUserMapper.toDomain(user);

      await this.setInCache(id, domainUser);

      return domainUser;
    } catch (error) {
      this.handlerError(error);
    }
  }

  async search(criteria: Criteria): Promise<Paginated<User>> {
    try {
      const where = TypeOrmCriteriaConverter.convert<UserModel>(criteria);

      const [users, total] = await this.repository.findAndCount(where);

      const {
        pagination: { page, perPage },
      } = criteria;

      return {
        data: TypeOrmUserMapper.toDomainList(users),
        pagination: {
          page,
          perPage,
          total,
        },
      };
    } catch (error) {
      this.handlerError(error);
    }
  }

  protected handlerError(error: unknown): never {
    if (error instanceof InfraestructureException) {
      throw error;
    }

    throw new TypeOrmException(error);
  }

  private async setInCache(
    key: string,
    value: User | User[] | Paginated<User>,
  ): Promise<void> {
    try {
      await this.cacheService.setValue<User | User[] | Paginated<User>>(
        key,
        value,
        {
          ttl: 5000,
        },
      );
    } catch {
      // TODO: we need to manage the errors without affecting the normal flow of repo, but keeping in mind that we must be aware of the error in the cache service

      return;
    }
  }

  private async getFromCache<T>(key: string): Promise<Nullable<T>> {
    try {
      const result = await this.cacheService.getValue<T>(key);

      return result;
    } catch {
      return null;
    }
  }
}
