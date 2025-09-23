import { Module } from '@nestjs/common';

import { CreateUserCommandHanlder } from 'src/modules/user/application/commands/create-user/create-user.command-handler';
import { UpdateUserCommandHanlder } from 'src/modules/user/application/commands/update-user/update-user.command-handler';

@Module({
  imports: [],

  providers: [
    // Command Handlers
    CreateUserCommandHanlder,
    UpdateUserCommandHanlder,

    // Query Handlers
  ],
})
export class UserModule {}
