import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserNotFoundException } from '@items/domain/exceptions/user-not-found.exception';
import { Item } from '@items/domain/item.entity';
import { ItemRepository } from '@items/domain/item.repository';
import { User } from '@modules/users/domain/user.entity';
import { UserRepository } from '@users/domain/user.repository';

import { ItemMapper } from '../../item.mapper';
import { PaginatedItemsDto } from './paginated-items.dto';
import { SearchItemsByCriteriaQuery } from './search-items-by-criteria.query';

@QueryHandler(SearchItemsByCriteriaQuery)
export class SearchItemsByCriteriaQueryHandler
  implements IQueryHandler<SearchItemsByCriteriaQuery>
{
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: SearchItemsByCriteriaQuery): Promise<PaginatedItemsDto> {
    const { criteria } = query;

    const { data: items, pagination } =
      await this.itemRepository.search(criteria);

    const users = await this.getUsers(items);

    const dtos = ItemMapper.toQueryDtoList(items, users);

    return {
      items: dtos,
      pagination,
    };
  }

  private async getUsers(items: Item[]): Promise<User[]> {
    const users = new Map<string, User>();

    for (const item of items) {
      if (!users.has(item.userIdValue)) {
        const user = await this.findUser(item.userIdValue);

        users.set(item.userIdValue, user);
      }
    }

    return Array.from(users.values());
  }

  private async findUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new UserNotFoundException(id);

    return user;
  }
}
