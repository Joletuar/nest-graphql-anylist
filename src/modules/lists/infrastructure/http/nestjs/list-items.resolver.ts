import { QueryBus } from '@nestjs/cqrs';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Auth } from 'src/modules/auth/infrastructure/https/nestjs/decorators/auth.decorator';
import { ItemDto } from 'src/modules/items/application/item.dto';
import { FindItemByIdQuery } from 'src/modules/items/application/queries/find-item-by-id/find-item-by-id.query';
import { ItemSchema } from 'src/modules/items/infrastructure/http/nestjs/schemas/item.schema';
import { ListItemDto } from 'src/modules/lists/application/list-item.dto';
import { Role } from 'src/modules/users/domain/roles.enum';

import { ListItemSchema } from './schemas/list-item.schema';

@Auth(Role.GUEST, Role.ADMIN)
@Resolver(() => ListItemSchema)
export class ListItemsResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @ResolveField('item', () => ItemSchema, {
    description: 'The item associated with the list item',
    nullable: false,
  })
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
