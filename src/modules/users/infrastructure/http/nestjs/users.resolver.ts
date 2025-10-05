import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Auth } from '@auth/infrastructure/https/nestjs/decorators/auth.decorator';
import { ParseUlidPipe } from '@shared/infrastructure/http/nestjs/pipes/parse-ulid.pipe';
import { CreateUserCommand } from '@users/application/commands/create-user/create-user.command';
import { CreatedUserDto } from '@users/application/commands/create-user/created-user.dto';
import { UpdateUserCommand } from '@users/application/commands/update-user/update-user.command';
import { UpdatedUserDto } from '@users/application/commands/update-user/updated-user.dto';
import { FindUserByIdQuery } from '@users/application/queries/find-user-by-id/find-user-by-id.query';
import { GetAllUsersQuery } from '@users/application/queries/get-all-user/get-all-user.query';
import { UserDto } from '@users/application/user.dto';
import { Role } from '@users/domain/roles.enum';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { UserSchema } from './user.schema';

@Auth(Role.ADMIN)
@Resolver(() => UserSchema)
export class UsersResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Query(() => [UserSchema], {
    name: 'GetAllUsers',
    description: 'Get users list',
  })
  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.queryBus.execute(new GetAllUsersQuery());

    return users;
  }

  @Query(() => UserSchema, {
    name: 'FindUserById',
    description: 'Find an user by id',
  })
  async findUserById(
    @Args(
      'id',
      {
        description: 'User id',
        type: () => ID,
        nullable: false,
      },
      ParseUlidPipe,
    )
    id: string,
  ): Promise<UserDto> {
    const user = await this.queryBus.execute(new FindUserByIdQuery(id));

    return user;
  }

  @Mutation(() => UserSchema, {
    name: 'CreateUser',
    description: 'Create new user',
    nullable: false,
  })
  async createUser(
    @Args('input', {
      type: () => CreateUserInput,
      nullable: false,
      description: 'Args to create new User',
    })
    createUserInput: CreateUserDto,
  ): Promise<CreatedUserDto> {
    const { fullName, email, password, roles, isActive } = createUserInput;

    const createdUser = await this.commandBus.execute(
      new CreateUserCommand(fullName, email, password, roles, isActive),
    );

    return createdUser;
  }

  @Mutation(() => UserSchema, {
    name: 'UpdateUser',
    nullable: false,
    description: 'Update an existing user',
  })
  async updateUser(
    @Args(
      'id',
      {
        description: 'User id',
        type: () => ID,
        nullable: false,
      },
      ParseUlidPipe,
    )
    id: string,
    @Args('input', {
      nullable: false,
      type: () => UpdateUserInput,
      description: 'Input to update User',
    })
    updateUserInput: UpdateUserDto,
  ): Promise<UpdatedUserDto> {
    const { fullName, email, roles, isActive } = updateUserInput;

    const updatedUser = await this.commandBus.execute(
      new UpdateUserCommand(id, fullName, email, roles, isActive),
    );

    return updatedUser;
  }
}
