import { Command } from '@nestjs/cqrs';

import { UserDto } from '../../user.dto';

export class UpdateUserCommand extends Command<UserDto> {
  constructor(
    readonly id: string,
    readonly fullName?: string,
    readonly email?: string,
    readonly password?: string,
    readonly roles?: string[],
    readonly isActive?: boolean,
  ) {
    super();
  }
}
