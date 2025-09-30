import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { FilterOperator } from 'src/modules/shared/domain/criteria/filter-operator.enum';
import { UserAlreadyExistsException } from 'src/modules/users/domain/exceptions/user-already-exists.exception';
import { User } from 'src/modules/users/domain/user.entity';
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

    const userAlreadyExists = await this.findUserByEmail(email);

    if (userAlreadyExists) throw new UserAlreadyExistsException(email);

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

  async findUserByEmail(email: string): Promise<User | null> {
    const users = await this.repository.search({
      filters: [
        {
          field: 'email',
          operator: FilterOperator.EQUAL,
          value: email,
        },
      ],
      pagination: {
        page: 1,
        perPage: 1,
      },
    });

    const [userFound] = users.data;

    if (!userFound) return null;

    return userFound;
  }
}
