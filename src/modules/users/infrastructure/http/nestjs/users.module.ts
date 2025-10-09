import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateUserCommandHandler } from '@users/application/commands/create-user/create-user.command-handler';
import { UpdateUserCommandHanlder } from '@users/application/commands/update-user/update-user.command-handler';
import { FindUserByIdQueryHandler } from '@users/application/queries/find-user-by-id/find-user-by-id.query-handler';
import { GetAllUsersQueryHandler } from '@users/application/queries/get-all-user/get-all-user.query-handler';
import { SearchUserByCriteriaQueryHandler } from '@users/application/queries/search-user-by-criteria/search-user.query-handler';
import { UserRepository } from '@users/domain/user.repository';

import { TypeOrmUserRepository } from '../../persistence/typeorm/typeorm-user.repository';
import { UserModel } from '../../persistence/typeorm/user.model';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],

  providers: [
    // Resolvers
    UsersResolver,

    // Repositories
    {
      provide: UserRepository,
      useClass: TypeOrmUserRepository,
    },

    // Command Handlers
    CreateUserCommandHandler,
    UpdateUserCommandHanlder,

    // Query Handlers
    FindUserByIdQueryHandler,
    GetAllUsersQueryHandler,
    SearchUserByCriteriaQueryHandler,
  ],

  exports: [UserRepository],
})
export class UsersModule {}
