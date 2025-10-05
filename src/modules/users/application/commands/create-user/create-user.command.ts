import { Command } from '@nestjs/cqrs';

import { Role } from '@users/domain/roles.enum';

import { CreatedUserDto } from './created-user.dto';

export class CreateUserCommand extends Command<CreatedUserDto> {
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
