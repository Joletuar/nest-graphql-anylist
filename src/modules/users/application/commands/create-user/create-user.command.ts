import { Command } from '@nestjs/cqrs';

import { UserWithoutPasswordDto } from '../../user-without-password.dto';
import { CreateUserDto } from './create-user.dto';

export class CreateUserCommand extends Command<UserWithoutPasswordDto> {
  constructor(readonly dto: CreateUserDto) {
    super();
  }
}
