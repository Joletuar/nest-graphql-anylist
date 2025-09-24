import { BadRequestException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ParseUlidPipe } from 'src/modules/shared/infraestructure/http/nestjs/pipes/parse-ulid.pipe';
import { CreateUserCommand } from 'src/modules/users/application/commands/create-user/create-user.command';
import { UpdateUserCommand } from 'src/modules/users/application/commands/update-user/update-user.command';
import { FindUserByIdQuery } from 'src/modules/users/application/queries/find-user-by-id/find-user-by-id.query';
import { GetAllUsersQuery } from 'src/modules/users/application/queries/get-all-user/get-all-user.query';
import { UserDto } from 'src/modules/users/application/user.dto';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { UserSchema } from './user.schema';

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
    createUserInput: CreateUserInput,
  ): Promise<UserDto> {
    const instance = plainToInstance(CreateUserDto, createUserInput);

    const errors = await validate(instance);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { fullName, email, password, roles, isActive } = instance;

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
    updateUserInput: UpdateUserInput,
  ): Promise<UserDto> {
    const instance = plainToInstance(UpdateUserDto, updateUserInput);

    const errors = await validate(instance);

    if (errors.length > 0) throw new BadRequestException(errors);

    const { fullName, email, password, roles, isActive } = updateUserInput;

    const updatedUser = await this.commandBus.execute(
      new UpdateUserCommand(id, fullName, email, password, roles, isActive),
    );

    return updatedUser;
  }
}
