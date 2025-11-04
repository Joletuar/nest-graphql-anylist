import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UlidValueObject } from '@modules/shared/domain/value-objects/ulid.valu-object';
import { FilterOperator } from '@shared/domain/criteria/filter-operator.enum';
import { UserAlreadyExistsException } from '@users/domain/exceptions/user-already-exists.exception';
import { User } from '@users/domain/user.entity';
import { UserRepository } from '@users/domain/user.repository';

import { UserWithoutPasswordDto } from '../../user-without-password.dto';
import { UserMapper } from '../../user.mapper';
import { CreateUserCommand } from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<UserWithoutPasswordDto> {
    const { email, fullName, password, roles, isActive } = command.dto;

    const userAlreadyExists = await this.findUserByEmail(email);

    if (userAlreadyExists) throw new UserAlreadyExistsException(email);

    const newUser = User.fromPrimitives({
      id: UlidValueObject.generateUlid(),
      fullName,
      email,
      password,
      roles,
      isActive,
    });

    const createdUser = await this.repository.create(newUser);

    return UserMapper.toDtoWithoutPassword(createdUser);
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
