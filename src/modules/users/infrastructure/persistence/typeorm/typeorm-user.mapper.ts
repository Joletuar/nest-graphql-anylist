import { User } from '@users/domain/user.entity';

import { UserModel } from './user.model';

export class TypeOrmUserMapper {
  static toDomain(model: UserModel): User {
    const { id, fullName, email, password, roles, isActive } = model;

    return { id, fullName, email, password, roles, isActive };
  }

  static toDomainList(models: UserModel[]): User[] {
    return models.map((user) => TypeOrmUserMapper.toDomain(user));
  }
}
