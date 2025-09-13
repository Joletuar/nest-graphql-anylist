import { ParseUUIDPipe } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { ItemDto } from 'src/modules/items/application/item.dto';
import { GetAllItemsQuery } from 'src/modules/items/application/queries/get-all-items/get-all-items.query';
import { GetItemByIdQuery } from 'src/modules/items/application/queries/get-item-by-id/get-item-by-id.query';

import { ItemSchema } from './item.schema';

@Resolver(() => ItemSchema)
export class ItemsResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => [ItemSchema], {
    name: 'GetAllItems',
    description: 'Obtener el listado completo de items',
  })
  async getAllItems(): Promise<ItemDto[]> {
    const items = await this.queryBus.execute(new GetAllItemsQuery());

    return items;
  }

  @Query(() => ItemSchema, {
    name: 'GetItemById',
    description: 'Obtener un item por su id',
  })
  async getItemById(
    @Args(
      'id',
      {
        description: 'Id del item a obtener',
        type: () => String,
        nullable: false,
      },
      ParseUUIDPipe,
    )
    id: string,
  ): Promise<ItemDto> {
    const item = await this.queryBus.execute(new GetItemByIdQuery(id));

    return item;
  }
}
