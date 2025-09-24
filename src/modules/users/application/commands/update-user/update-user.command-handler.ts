import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserNotFoundException } from 'src/modules/user/domain/exceptions/user-not-found.exception';
import { Role } from 'src/modules/user/domain/roles.enum';
import { User } from 'src/modules/user/domain/user.entity';
import { UserRepository } from 'src/modules/user/domain/user.repository';

import { UserDto } from '../../user.dto';
import { UserMapper } from '../../user.mapper';
import { UpdateUserCommand } from './update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHanlder
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: UpdateUserCommand): Promise<UserDto> {
    const { id, email, fullName, password, roles, isActive } = command;

    const currentUser = await this.ensureExistsUser(id);

    const userToUpdate: User = {
      id,
      email: email || currentUser.email,
      fullName: fullName || currentUser.fullName,
      password: password || currentUser.password,
      roles: roles && roles.length > 0 ? (roles as Role[]) : currentUser.roles,
      isActive:
        isActive !== undefined && isActive !== null
          ? isActive
          : currentUser.isActive,
    };

    const updatedUser = await this.repository.update(userToUpdate);

    return UserMapper.toDto(updatedUser);
  }

  private async ensureExistsUser(id: string): Promise<User> {
    const user = await this.repository.findById(id);

    if (!user) throw new UserNotFoundException(id);

    return user;
  }
}
