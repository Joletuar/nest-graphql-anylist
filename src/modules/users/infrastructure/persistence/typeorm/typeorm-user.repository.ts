import { InjectRepository } from '@nestjs/typeorm';

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
  constructor(
    @InjectRepository(UserModel)
    repository: Repository<UserModel>,
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

      return TypeOrmUserMapper.toDomain(createdUser);
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

      return TypeOrmUserMapper.toDomain(updatedUser);
    } catch (error) {
      this.handlerError(error);
    }
  }

  async getAll(): Promise<User[]> {
    try {
      const users = await this.repository.find();

      return TypeOrmUserMapper.toDomainList(users);
    } catch (error) {
      this.handlerError(error);
    }
  }

  async findById(id: string): Promise<Nullable<User>> {
    try {
      const user = await this.repository.findOneBy({ id });

      if (!user) return null;

      return TypeOrmUserMapper.toDomain(user);
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
}
