import { Command } from '@nestjs/cqrs';

import { UserWithoutPasswordDto } from '../../user-without-password.dto';
import { UpdateUserDto } from './update-user.dto';

export class UpdateUserCommand extends Command<UserWithoutPasswordDto> {
  constructor(readonly dto: UpdateUserDto) {
    super();
  }
}
