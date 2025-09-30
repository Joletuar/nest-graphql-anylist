import { Command } from '@nestjs/cqrs';

import { UpdatedUserDto } from './updated-user.dto';

export class UpdateUserCommand extends Command<UpdatedUserDto> {
  constructor(
    readonly id: string,
    readonly fullName?: string,
    readonly email?: string,
    readonly roles?: string[],
    readonly isActive?: boolean,
  ) {
    super();
  }
}
