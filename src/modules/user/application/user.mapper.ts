import { User } from '../domain/user.entity';
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
}
