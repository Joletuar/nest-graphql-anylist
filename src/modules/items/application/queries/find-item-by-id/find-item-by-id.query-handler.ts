import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ItemNotFoundException } from 'src/modules/items/domain/exceptions/item-not-found.exception';
import { UserNotFoundException } from 'src/modules/items/domain/exceptions/user-not-found.exception';
import { ItemRepository } from 'src/modules/items/domain/item.repository';
import { UserDto } from 'src/modules/users/application/user.dto';
import { UserMapper } from 'src/modules/users/application/user.mapper';
import { UserRepository } from 'src/modules/users/domain/user.repository';

import { ItemMapper } from '../../item.mapper';
import { QueryItemDto } from '../query-item.dto';
import { FindItemByIdQuery } from './find-item-by-id.query';

@QueryHandler(FindItemByIdQuery)
export class FinItemByIdQueryHandler
  implements IQueryHandler<FindItemByIdQuery>
{
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: FindItemByIdQuery): Promise<QueryItemDto> {
    const item = await this.itemRepository.findById(query.id);

    if (!item) throw new ItemNotFoundException(query.id);

    const user = await this.findUser(item.userId);

    return ItemMapper.toQueryDto(item, user);
  }

  private async findUser(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new UserNotFoundException(id);

    return UserMapper.toDto(user);
  }
}
