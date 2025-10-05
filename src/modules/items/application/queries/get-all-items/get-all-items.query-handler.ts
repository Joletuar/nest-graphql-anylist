import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserNotFoundException } from '@items/domain/exceptions/user-not-found.exception';
import { Item } from '@items/domain/item.entity';
import { ItemRepository } from '@modules/items/domain/item.repository';
import { UserDto } from '@users/application/user.dto';
import { UserMapper } from '@users/application/user.mapper';
import { UserRepository } from '@users/domain/user.repository';

import { ItemMapper } from '../../item.mapper';
import { QueryItemDto } from '../query-item.dto';
import { GetAllItemsQuery } from './get-all-items.query';

@QueryHandler(GetAllItemsQuery)
export class GetAllItemsQueryHandler
  implements IQueryHandler<GetAllItemsQuery>
{
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(): Promise<QueryItemDto[]> {
    const items = await this.itemRepository.getAll();

    const users = await this.getUsers(items);

    return ItemMapper.toQueryDtoList(items, users);
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
