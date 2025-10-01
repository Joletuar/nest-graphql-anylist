import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserNotFoundException } from 'src/modules/items/domain/exceptions/user-not-found.exception';
import { Item } from 'src/modules/items/domain/item.entity';
import { ItemRepository } from 'src/modules/items/domain/item.repository';
import { UserDto } from 'src/modules/users/application/user.dto';
import { UserMapper } from 'src/modules/users/application/user.mapper';
import { UserRepository } from 'src/modules/users/domain/user.repository';

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

  private async getUsers(items: Item[]): Promise<UserDto[]> {
    const users = new Map<string, UserDto>();

    for (const item of items) {
      if (!users.has(item.userId)) {
        const user = await this.findUser(item.userId);

        users.set(item.userId, user);
      }
    }

    return Array.from(users.values());
  }

  private async findUser(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new UserNotFoundException(id);

    return UserMapper.toDto(user);
  }
}
