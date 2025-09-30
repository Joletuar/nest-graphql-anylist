import { BadRequestException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Auth } from 'src/modules/auth/infraestructure/https/nestjs/decorators/auth.decorator';
import { CreateItemCommand } from 'src/modules/items/application/commands/create-item/create-item.command';
import { UpdateItemCommand } from 'src/modules/items/application/commands/update-item/update-item.command';
import { ItemDto } from 'src/modules/items/application/item.dto';
import { FindItemByIdQuery } from 'src/modules/items/application/queries/find-item-by-id/find-item-by-id.query';
import { GetAllItemsQuery } from 'src/modules/items/application/queries/get-all-items/get-all-items.query';
import { ParseUlidPipe } from 'src/modules/shared/infraestructure/http/nestjs/pipes/parse-ulid.pipe';
import { Role } from 'src/modules/users/domain/roles.enum';

import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CreateItemInput } from './inputs/create-item.input';
import { UpdateItemInput } from './inputs/update-item.input';
import { ItemSchema } from './item.schema';

@Resolver(() => ItemSchema)
export class ItemsResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Auth(Role.ADMIN)
  @Query(() => [ItemSchema], {
    name: 'GetAllItems',
    description: 'Get an items list',
  })
  async getAllItems(): Promise<ItemDto[]> {
    const items = await this.queryBus.execute(new GetAllItemsQuery());

    return items;
  }

  @Query(() => ItemSchema, {
    name: 'FindItemById',
    description: 'Find an item by id',
  })
  async findItemById(
    @Args(
      'id',
      {
        description: 'Item id',
        type: () => ID,
        nullable: false,
      },
      ParseUlidPipe,
    )
    id: string,
  ): Promise<ItemDto> {
    const item = await this.queryBus.execute(new FindItemByIdQuery(id));

    return item;
  }

  @Auth(Role.ADMIN)
  @Mutation(() => ItemSchema, {
    name: 'CreateItem',
    description: 'Create new item',
    nullable: false,
  })
  async createItem(
    @Args('input', {
      type: () => CreateItemInput,
      nullable: false,
      description: 'Args to create new Item',
    })
    createItemInput: CreateItemInput,
  ): Promise<ItemDto> {
    const instance = plainToInstance(CreateItemDto, createItemInput);

    const errors = await validate(instance);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { name, quantity, quantityUnits } = instance;

    const createdItem = await this.commandBus.execute(
      new CreateItemCommand(name, quantity, quantityUnits),
    );

    return createdItem;
  }

  @Mutation(() => ItemSchema, {
    name: 'UpdateItem',
    nullable: false,
    description: 'Update an existing item',
  })
  async updateItem(
    @Args(
      'id',
      {
        description: 'Item id',
        type: () => ID,
        nullable: false,
      },
      ParseUlidPipe,
    )
    id: string,
    @Args('input', {
      nullable: false,
      type: () => UpdateItemInput,
      description: 'Input to update item',
    })
    updateItemInput: UpdateItemInput,
  ): Promise<ItemDto> {
    const instance = plainToInstance(UpdateItemDto, updateItemInput);

    const errors = await validate(instance);

    if (errors.length > 0) throw new BadRequestException(errors);

    const { name, quantity, quantityUnits } = updateItemInput;

    const updatedItem = await this.commandBus.execute(
      new UpdateItemCommand(id, name, quantity, quantityUnits),
    );

    return updatedItem;
  }
}
