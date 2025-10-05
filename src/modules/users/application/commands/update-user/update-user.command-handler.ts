import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserNotFoundException } from '@users/domain/exceptions/user-not-found.exception';
import { Role } from '@users/domain/roles.enum';
import { User } from '@users/domain/user.entity';
import { UserRepository } from '@users/domain/user.repository';

import { UserMapper } from '../../user.mapper';
import { UpdateUserCommand } from './update-user.command';
import { UpdatedUserDto } from './updated-user.dto';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHanlder
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: UpdateUserCommand): Promise<UpdatedUserDto> {
    const { id, email, fullName, roles, isActive } = command;

    const currentUser = await this.ensureExistsUser(id);

    const userToUpdate: User = {
      id,
      email: email ?? currentUser.email,
      fullName: fullName ?? currentUser.fullName,
      password: currentUser.password,
      roles: roles && roles.length > 0 ? (roles as Role[]) : currentUser.roles,
      isActive:
        isActive !== undefined && isActive !== null
          ? isActive
          : currentUser.isActive,
    };

    const updatedUser = await this.repository.update(userToUpdate);

    return UserMapper.toDtoWithoutPassword(updatedUser);
  }

  private async ensureExistsUser(id: string): Promise<User> {
    const user = await this.repository.findById(id);

    if (!user) throw new UserNotFoundException(id);

    return user;
  }
}
