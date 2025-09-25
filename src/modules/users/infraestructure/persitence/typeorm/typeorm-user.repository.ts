import { InjectRepository } from '@nestjs/typeorm';

import { InfraestructureException } from 'src/modules/shared/domain/exceptions/infraestructure.exception';
import { Nullable } from 'src/modules/shared/domain/nullable.type';
import { BaseTypeOrmRepository } from 'src/modules/shared/infraestructure/persitence/typeorm/base-typeorm.repository';
import { TypeOrmException } from 'src/modules/shared/infraestructure/persitence/typeorm/exceptions/typeorm.exceptions';
import { User } from 'src/modules/users/domain/user.entity';
import { UserRepository } from 'src/modules/users/domain/user.repository';
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

  protected handlerError(error: unknown): never {
    if (error instanceof InfraestructureException) {
      throw error;
    }

    throw new TypeOrmException(error);
  }
}
