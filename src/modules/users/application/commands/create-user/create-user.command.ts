import { Command } from '@nestjs/cqrs';

import { Role } from 'src/modules/users/domain/roles.enum';

import { UserDto } from '../../user.dto';

export class CreateUserCommand extends Command<UserDto> {
  constructor(
    readonly fullName: string,
    readonly email: string,
    readonly password: string,
    readonly roles: Role[],
    readonly isActive: boolean,
  ) {
    super();
  }
}
