import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Auth } from 'src/modules/auth/infrastructure/https/nestjs/decorators/auth.decorator';
import { ItemDto } from 'src/modules/items/application/item.dto';
import { FindItemByIdQuery } from 'src/modules/items/application/queries/find-item-by-id/find-item-by-id.query';
import { ItemSchema } from 'src/modules/items/infrastructure/http/nestjs/schemas/item.schema';
import { AddItemToListCommand } from 'src/modules/lists/application/commands/add-item-to-list/add-item-to-list.command';
import { CreateListCommand } from 'src/modules/lists/application/commands/create-list/create-list.command';
import { RemoveItemFromListCommand } from 'src/modules/lists/application/commands/remove-item-from-list/remove-item-from-list.command';
import { UpdateListItemQuantityCommand } from 'src/modules/lists/application/commands/update-list-item-quantity/update-list-item-quantity.command';
import { UpdateListCommand } from 'src/modules/lists/application/commands/update-list/update-list.command';
import { ListItemDto } from 'src/modules/lists/application/list-item.dto';
import { ListDto } from 'src/modules/lists/application/list.dto';
import { FindListByIdQuery } from 'src/modules/lists/application/queries/find-list-by-id/find-list-by-id.query';
import { GetAllListsQuery } from 'src/modules/lists/application/queries/get-all-lists/get-all-lists.query';
import { SearchListItemsByCriteriaQuery } from 'src/modules/lists/application/queries/search-list-items-by-criteria/search-list-items-by-criteria.query';
import { Criteria } from 'src/modules/shared/domain/criteria/criteria.interface';
import { FilterOperator } from 'src/modules/shared/domain/criteria/filter-operator.enum';
import { ParseUlidPipe } from 'src/modules/shared/infrastructure/http/nestjs/pipes/parse-ulid.pipe';
import { FindUserByIdQuery } from 'src/modules/users/application/queries/find-user-by-id/find-user-by-id.query';
import { UserDto } from 'src/modules/users/application/user.dto';
import { Role } from 'src/modules/users/domain/roles.enum';
import { UserSchema } from 'src/modules/users/infrastructure/http/nestjs/user.schema';

import { GetListItemsArgs } from './args/get-list-items.args';
import { CreateListDto } from './dto/request/create-list.dto';
import { GetListItemsDto } from './dto/request/get-list-items.dto';
import { UpdateListDto } from './dto/request/update-list.dto';
import { AddItemToListInput } from './inputs/add-item-to-list.input';
import { CreateListInput } from './inputs/create-list.input';
import { RemoveItemFromListInput } from './inputs/remove-item-from-list.input';
import { UpdateListItemQuantityInput } from './inputs/update-list-item-quantity.input';
import { UpdateListInput } from './inputs/update-list.input';
import { ListItemSchema } from './schemas/list-item.schema';
import { ListSchema } from './schemas/list.schema';

@Auth(Role.GUEST, Role.ADMIN)
@Resolver(() => ListSchema)
export class ListsResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Query(() => [ListSchema], {
    name: 'GetAllLists',
    description: 'Get all lists',
    nullable: false,
  })
  async getAllLists(): Promise<ListDto[]> {
    const lists = await this.queryBus.execute(new GetAllListsQuery());

    return lists;
  }

  @Query(() => ListSchema, {
    name: 'FindListById',
    description: 'Find a list by id',
  })
  async findListById(
    @Args(
      'id',
      {
        description: 'List id',
        type: () => ID,
        nullable: false,
      },
      ParseUlidPipe,
    )
    id: string,
  ): Promise<ListDto> {
    const list = await this.queryBus.execute(new FindListByIdQuery(id));

    return list;
  }

  @Mutation(() => ListSchema, {
    name: 'CreateList',
    description: 'Create new list',
    nullable: false,
  })
  async createList(
    @Args('input', {
      type: () => CreateListInput,
      nullable: false,
      description: 'Args to create new List',
    })
    createListInput: CreateListDto,
  ): Promise<ListDto> {
    const { name, userId, items = [] } = createListInput;

    const createdList = await this.commandBus.execute(
      new CreateListCommand(name, userId, items),
    );

    return createdList;
  }

  @Mutation(() => ListSchema, {
    name: 'UpdateList',
    nullable: false,
    description: 'Update an existing list',
  })
  async updateList(
    @Args(
      'id',
      {
        description: 'List id',
        type: () => ID,
        nullable: false,
      },
      ParseUlidPipe,
    )
    id: string,
    @Args('input', {
      nullable: false,
      type: () => UpdateListInput,
      description: 'Input to update list',
    })
    updateListInput: UpdateListDto,
  ): Promise<ListDto> {
    const { name, userId, items } = updateListInput;

    const updatedList = await this.commandBus.execute(
      new UpdateListCommand(id, name, userId, items),
    );

    return updatedList;
  }

  @Mutation(() => ListSchema, {
    name: 'AddItemToList',
    nullable: false,
    description: 'Add item to an existing list',
  })
  async addItemToList(
    @Args('input', {
      nullable: false,
      type: () => AddItemToListInput,
      description: 'Input to add item to list',
    })
    input: AddItemToListInput,
  ): Promise<ListDto> {
    const { listId, itemId, quantity } = input;

    const updatedList = await this.commandBus.execute(
      new AddItemToListCommand(listId, itemId, quantity),
    );

    return updatedList;
  }

  @Mutation(() => ListSchema, {
    name: 'RemoveItemFromList',
    nullable: false,
    description: 'Remove item from an existing list',
  })
  async removeItemFromList(
    @Args('input', {
      nullable: false,
      type: () => RemoveItemFromListInput,
      description: 'Input to remove item from list',
    })
    input: RemoveItemFromListInput,
  ): Promise<ListDto> {
    const { listId, itemId } = input;

    const updatedList = await this.commandBus.execute(
      new RemoveItemFromListCommand(listId, itemId),
    );

    return updatedList;
  }

  @Mutation(() => ListSchema, {
    name: 'UpdateListItemQuantity',
    nullable: false,
    description: 'Update quantity of an item in a list',
  })
  async updateListItemQuantity(
    @Args('input', {
      nullable: false,
      type: () => UpdateListItemQuantityInput,
      description: 'Input to update list item quantity',
    })
    input: UpdateListItemQuantityInput,
  ): Promise<ListDto> {
    const { listId, itemId, quantity } = input;

    const updatedList = await this.commandBus.execute(
      new UpdateListItemQuantityCommand(listId, itemId, quantity),
    );

    return updatedList;
  }

  @ResolveField('user', () => UserSchema, {
    nullable: true,
    description: 'The user that owns the list',
  })
  async getUser(@Parent() list: ListDto): Promise<UserDto> {
    const user = await this.queryBus.execute(
      new FindUserByIdQuery(list.userId),
    );

    return user;
  }

  @ResolveField('items', () => ListItemSchema)
  async getListItems(
    @Parent() list: ListDto,
    @Args({
      type: () => GetListItemsArgs,
      description: 'Criteria to filter, paginate and sort',
    })
    getListItemsDto: GetListItemsDto,
  ): Promise<ListItemDto[]> {
    const criteria: Criteria = {
      filters: [
        {
          field: 'listId',
          operator: FilterOperator.EQUAL,
          value: list.id,
        },
      ],
      pagination: {
        page: getListItemsDto.page,
        perPage: getListItemsDto.limit,
      },
    };

    const { items } = await this.queryBus.execute(
      new SearchListItemsByCriteriaQuery(criteria),
    );

    return items;
  }

  @ResolveField('item', () => ItemSchema)
  async getItem(@Parent() listItem: ListItemDto): Promise<ItemDto> {
    const {
      id,
      name,
      quantityUnits,
      stock,
      user: { id: userId },
    } = await this.queryBus.execute(new FindItemByIdQuery(listItem.itemId));

    return {
      id,
      name,
      quantityUnits,
      stock,
      userId,
    };
  }
}
