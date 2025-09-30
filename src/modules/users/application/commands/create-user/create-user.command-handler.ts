import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserRepository } from 'src/modules/users/domain/user.repository';
import { ulid } from 'ulidx';

import { UserDto } from '../../user.dto';
import { UserMapper } from '../../user.mapper';
import { CreateUserCommand } from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHanlder
  implements ICommandHandler<CreateUserCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<UserDto> {
    const { email, fullName, password, roles, isActive } = command;

    const createdUser = await this.repository.create({
      id: ulid(),
      fullName,
      email,
      password,
      roles,
      isActive,
    });

    return UserMapper.toDto(createdUser);
  }
}
