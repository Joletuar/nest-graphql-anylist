import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Item } from 'src/modules/items/domain/item.entity';
import { ItemRepository } from 'src/modules/items/domain/item.repository';
import { ItemNotFoundException } from 'src/modules/lists/domain/exceptions/item-not-found.exception';
import { ListNotFoundException } from 'src/modules/lists/domain/exceptions/list-not-found.exception';
import { UserNotFoundException } from 'src/modules/lists/domain/exceptions/user-not-found.exception';
import { ListItem } from 'src/modules/lists/domain/list-item.entity';
import { List } from 'src/modules/lists/domain/list.entity';
import { ListRespository } from 'src/modules/lists/domain/list.repository';
import { User } from 'src/modules/users/domain/user.entity';
import { UserRepository } from 'src/modules/users/domain/user.repository';

import { ListDto } from '../../list.dto';
import { ListMapper } from '../../list.mapper';
import { UpdateListCommand } from './update-list.command';

@CommandHandler(UpdateListCommand)
export class UpdateListCommandHandler
  implements ICommandHandler<UpdateListCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly itemRepository: ItemRepository,
    private readonly listRepository: ListRespository,
  ) {}

  async execute(command: UpdateListCommand): Promise<ListDto> {
    const { id, name, userId, items: inputItems } = command;

    const existingList = await this.ensureExistsList(id);

    let user: User | null = null;

    if (userId) user = await this.ensureExistsUser(userId);

    const listItems: ListItem[] = [];
    const items: Item[] = [];

    if (inputItems !== undefined && inputItems.length > 0) {
      for (const { id, itemId, quantity } of inputItems) {
        const item = await this.ensureExistsItem(itemId);
        items.push(item);

        listItems.push({ id, itemId: item.id, quantity });
      }
    }

    const listToUpdate: List = {
      id: existingList.id,
      name: name ?? existingList.name,
      userId: user ? user.id : existingList.userId,
      items: listItems.length > 0 ? listItems : existingList.items,
    };

    const updatedList = await this.listRepository.update(listToUpdate);

    return ListMapper.toDto(updatedList, user!, items);
  }

  async ensureExistsList(id: string): Promise<List> {
    const list = await this.listRepository.findById(id);

    if (!list) throw new ListNotFoundException(id);

    return list;
  }

  async ensureExistsUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new UserNotFoundException(id);

    return user;
  }

  async ensureExistsItem(id: string): Promise<Item> {
    const item = await this.itemRepository.findById(id);

    if (!item) throw new ItemNotFoundException(id);

    return item;
  }
}
