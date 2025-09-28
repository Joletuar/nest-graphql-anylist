import { Paginated } from 'src/modules/shared/domain/paginated.entity';

import { User } from '../domain/user.entity';
import { PaginatedUserDto } from './queries/search-user-by-criteria/paginated-user.dto';
import { UserDto } from './user.dto';

export class UserMapper {
  static toDto(user: User): UserDto {
    const { id, fullName, email, password, roles, isActive } = user;

    return {
      id,
      fullName,
      email,
      password,
      roles: roles.map((role) => role.toString()),
      isActive,
    };
  }

  static toDtoList(users: User[]): UserDto[] {
    return users.map((user) => this.toDto(user));
  }

  static toPaginatedDto(result: Paginated<User>): PaginatedUserDto {
    const { data, pagination } = result;

    return {
      users: this.toDtoList(data),
      pagination,
    };
  }
}
