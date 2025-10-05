import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Auth } from '@auth/infrastructure/https/nestjs/decorators/auth.decorator';
import { CreateItemCommand } from '@items/application/commands/create-item/create-item.command';
import { UpdateItemCommand } from '@items/application/commands/update-item/update-item.command';
import { ItemDto } from '@items/application/item.dto';
import { FindItemByIdQuery } from '@items/application/queries/find-item-by-id/find-item-by-id.query';
import { GetAllItemsQuery } from '@items/application/queries/get-all-items/get-all-items.query';
import { QueryItemDto } from '@items/application/queries/query-item.dto';
import { PaginatedItemsDto } from '@items/application/queries/search-items-by-criteria/paginated-items.dto';
import { SearchItemsByCriteriaQuery } from '@items/application/queries/search-items-by-criteria/search-items-by-criteria.query';
import { CriteriaDto } from '@shared/infrastructure/http/nestjs/dtos/criteria.dto';
import { CriteriaInput } from '@shared/infrastructure/http/nestjs/inputs/criteria.input';
import { ParseUlidPipe } from '@shared/infrastructure/http/nestjs/pipes/parse-ulid.pipe';
import { Role } from '@users/domain/roles.enum';

import { CreateItemDto } from './dtos/create-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { CreateItemInput } from './inputs/create-item.input';
import { UpdateItemInput } from './inputs/update-item.input';
import { ItemSchema } from './schemas/item.schema';
import { PaginatedItemsSchema } from './schemas/paginated-items.schema';
import { QueryItemSchema } from './schemas/query-item.schema';

@Auth(Role.GUEST, Role.ADMIN)
@Resolver(() => ItemSchema)
export class ItemsResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Query(() => [QueryItemSchema], {
    name: 'GetAllItems',
    description: 'Get an items list',
  })
  async getAllItems(): Promise<QueryItemDto[]> {
    const items = await this.queryBus.execute(new GetAllItemsQuery());

    return items;
  }

  @Query(() => QueryItemSchema, {
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
  ): Promise<QueryItemDto> {
    const item = await this.queryBus.execute(new FindItemByIdQuery(id));

    return item;
  }

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
    createItemInput: CreateItemDto,
  ): Promise<ItemDto> {
    const { name, quantity, quantityUnits, userId } = createItemInput;

    const createdItem = await this.commandBus.execute(
      new CreateItemCommand(name, quantity, quantityUnits, userId),
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
    updateItemInput: UpdateItemDto,
  ): Promise<ItemDto> {
    const { name, quantity, quantityUnits, userId } = updateItemInput;

    const updatedItem = await this.commandBus.execute(
      new UpdateItemCommand(id, name, quantity, quantityUnits, userId),
    );

    return updatedItem;
  }

  @Query(() => PaginatedItemsSchema, {
    name: 'SearchItems',
    description: 'Search items with filters, pagination and sort',
  })
  async searchItems(
    @Args('criteria', {
      type: () => CriteriaInput,
      description: 'Criteria to filter, paginate and sort',
    })
    criteriaInput: CriteriaDto,
  ): Promise<PaginatedItemsDto> {
    const { filters, pagination, sort } = criteriaInput;

    const { items, pagination: paginationInfo } = await this.queryBus.execute(
      new SearchItemsByCriteriaQuery({ filters, pagination, sort }),
    );

    return { items, pagination: paginationInfo };
  }
}
