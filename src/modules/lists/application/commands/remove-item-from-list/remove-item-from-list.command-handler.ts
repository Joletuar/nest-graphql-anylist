import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Item } from '@items/domain/item.entity';
import { ItemRepository } from '@items/domain/item.repository';
import { ItemNotFoundException } from '@lists/domain/exceptions/item-not-found.exception';
import { ListItemNotFoundException } from '@lists/domain/exceptions/list-item-not-found.exception';
import { ListNotFoundException } from '@lists/domain/exceptions/list-not-found.exception';
import { List } from '@lists/domain/list.entity';
import { ListRespository } from '@lists/domain/list.repository';

import { ListDto } from '../../list.dto';
import { ListMapper } from '../../list.mapper';
import { RemoveItemFromListCommand } from './remove-item-from-list.command';

@CommandHandler(RemoveItemFromListCommand)
export class RemoveItemFromListCommandHandler
  implements ICommandHandler<RemoveItemFromListCommand>
{
  constructor(
    private readonly listRepository: ListRespository,
    private readonly itemRepository: ItemRepository,
  ) {}

  async execute(command: RemoveItemFromListCommand): Promise<ListDto> {
    const { listId, itemId } = command;

    const existingList = await this.ensureExistsList(listId);

    const itemIndex = existingList.items.findIndex(
      (listItem) => listItem.itemId === itemId,
    );

    if (itemIndex === -1) {
      throw new ListItemNotFoundException(itemId);
    }

    existingList.items.splice(itemIndex, 1);

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
