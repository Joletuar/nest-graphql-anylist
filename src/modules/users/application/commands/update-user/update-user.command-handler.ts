import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserId } from '@modules/users/domain/value-objects/user-id.value-object';
import { UserNotFoundException } from '@users/domain/exceptions/user-not-found.exception';
import { User } from '@users/domain/user.entity';
import { UserRepository } from '@users/domain/user.repository';

import { UserWithoutPasswordDto } from '../../user-without-password.dto';
import { UserMapper } from '../../user.mapper';
import { UpdateUserCommand } from './update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: UpdateUserCommand): Promise<UserWithoutPasswordDto> {
    const { id } = command.dto;

    const currentUser = await this.ensureExistsUser(id);
    this.updateUser(currentUser, command);

    const updatedUser = await this.repository.update(currentUser);

    return UserMapper.toDtoWithoutPassword(updatedUser);
  }

  private async ensureExistsUser(id: string): Promise<User> {
    const user = await this.repository.findById(new UserId(id));

    if (!user) throw new UserNotFoundException(id);

    return user;
  }

  private updateUser(user: User, command: UpdateUserCommand): User {
    const { email, fullName, roles, isActive } = command.dto;

    const primitives = user.toPrimitives();
    user.updateEmail(email ?? primitives.email);
    user.updateFullName(fullName ?? primitives.fullName);
    user.updateIsActive(
      isActive !== undefined && isActive !== null
        ? isActive
        : primitives.isActive,
    );
    user.updateRoles(roles ?? primitives.roles);

    return user;
  }
}
