import { Paginated } from '@shared/domain/paginated.entity';

import { User } from '../domain/user.entity';
import { PaginatedUsersDto } from './queries/search-user-by-criteria/paginated-users.dto';
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

  static toPaginatedDto(result: Paginated<User>): PaginatedUsersDto {
    const { data, pagination } = result;

    return {
      users: this.toDtoList(data),
      pagination,
    };
  }

  static toDtoWithoutPassword(user: User): Omit<UserDto, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
    };
  }

  static toDtoListWithoutPassword(users: User[]): Omit<UserDto, 'password'>[] {
    return users.map((user) => this.toDtoWithoutPassword(user));
  }

  static toPaginatedDtoWithoutPassword(
    result: Paginated<User>,
  ): Omit<PaginatedUsersDto, 'users'> & { users: Omit<UserDto, 'password'>[] } {
    const { data, pagination } = result;

    return {
      users: this.toDtoListWithoutPassword(data),
      pagination,
    };
  }
}
