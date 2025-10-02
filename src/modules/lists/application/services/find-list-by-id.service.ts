import { Item } from 'src/modules/items/domain/item.entity';
import { ItemRepository } from 'src/modules/items/domain/item.repository';
import { User } from 'src/modules/users/domain/user.entity';
import { UserRepository } from 'src/modules/users/domain/user.repository';

import { ItemNotFoundException } from '../../domain/exceptions/item-not-found.exception';
import { ListNotFoundException } from '../../domain/exceptions/list-not-found.exception';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { ListRespository } from '../../domain/list.repository';
import { ListDto } from '../list.dto';
import { ListMapper } from '../list.mapper';

export class FindListByIdService {
  constructor(
    private readonly listRepository: ListRespository,
    private readonly itemRepository: ItemRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async find(id: string): Promise<ListDto> {
    const list = await this.listRepository.findById(id);

    if (!list) throw new ListNotFoundException(id);

    const items: Item[] = [];

    for (const { itemId } of list.items) {
      const item = await this.getItemInfo(itemId);

      items.push(item);
    }

    const user = await this.getUserInfo(list.userId);

    return ListMapper.toDto(list, user, items);
  }

  private async getUserInfo(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new UserNotFoundException(id);

    return user;
  }

  private async getItemInfo(id: string): Promise<Item> {
    const item = await this.itemRepository.findById(id);

    if (!item) throw new ItemNotFoundException(id);

    return item;
  }
}
