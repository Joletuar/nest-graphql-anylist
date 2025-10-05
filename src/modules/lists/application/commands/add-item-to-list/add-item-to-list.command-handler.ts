import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Item } from '@items/domain/item.entity';
import { ItemRepository } from '@items/domain/item.repository';
import { ItemNotFoundException } from '@lists/domain/exceptions/item-not-found.exception';
import { ListNotFoundException } from '@lists/domain/exceptions/list-not-found.exception';
import { List } from '@lists/domain/list.entity';
import { ListRespository } from '@lists/domain/list.repository';
import { ulid } from 'ulidx';

import { ListDto } from '../../list.dto';
import { ListMapper } from '../../list.mapper';
import { AddItemToListCommand } from './add-item-to-list.command';

@CommandHandler(AddItemToListCommand)
export class AddItemToListCommandHandler
  implements ICommandHandler<AddItemToListCommand>
{
  constructor(
    private readonly listRepository: ListRespository,
    private readonly itemRepository: ItemRepository,
  ) {}

  async execute(command: AddItemToListCommand): Promise<ListDto> {
    const { listId, itemId, quantity } = command;

    const existingList = await this.ensureExistsList(listId);

    await this.ensureExistsItem(itemId);

    const existingItemIndex = existingList.items.findIndex(
      (listItem) => listItem.itemId === itemId,
    );

    if (existingItemIndex >= 0) {
      existingList.items[existingItemIndex].quantity += quantity;
    } else {
      existingList.items.push({
        id: ulid(),
        itemId,
        quantity,
      });
    }

    const updatedList = await this.listRepository.update(existingList);

    const items: Item[] = [];

    for (const listItem of updatedList.items) {
      const itemEntity = await this.ensureExistsItem(listItem.itemId);

      if (itemEntity) items.push(itemEntity);
    }

    return ListMapper.toDto(updatedList);
  }

  private async ensureExistsList(id: string): Promise<List> {
    const list = await this.listRepository.findById(id);

    if (!list) throw new ListNotFoundException(id);

    return list;
  }

  private async ensureExistsItem(id: string): Promise<Item> {
    const item = await this.itemRepository.findById(id);

    if (!item) throw new ItemNotFoundException(id);

    return item;
  }
}
