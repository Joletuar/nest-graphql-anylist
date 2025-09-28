import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/modules/auth/infraestructure/https/nestjs/auth.module';
import { CreateUserCommandHanlder } from 'src/modules/users/application/commands/create-user/create-user.command-handler';
import { UpdateUserCommandHanlder } from 'src/modules/users/application/commands/update-user/update-user.command-handler';
import { FindUserByIdQueryHandler } from 'src/modules/users/application/queries/find-user-by-id/find-user-by-id.query-handler';
import { GetAllUsersQueryHandler } from 'src/modules/users/application/queries/get-all-user/get-all-user.query-handler';
import { SearchUserByCriteriaQueryHandler } from 'src/modules/users/application/queries/search-user-by-criteria/search-user.query-handler';
import { UserRepository } from 'src/modules/users/domain/user.repository';

import { TypeOrmUserRepository } from '../../persitence/typeorm/typeorm-user.repository';
import { UserModel } from '../../persitence/typeorm/user.model';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel]),
    forwardRef(() => AuthModule),
  ],

  providers: [
    // Resolvers
    UsersResolver,

    // Repositories
    {
      provide: UserRepository,
      useClass: TypeOrmUserRepository,
    },

    // Command Handlers
    CreateUserCommandHanlder,
    UpdateUserCommandHanlder,

    // Query Handlers
    FindUserByIdQueryHandler,
    GetAllUsersQueryHandler,
    SearchUserByCriteriaQueryHandler,
  ],

  exports: [UserRepository],
})
export class UsersModule {}
