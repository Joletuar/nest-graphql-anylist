import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Item } from 'src/modules/items/domain/item.entity';
import { ItemRepository } from 'src/modules/items/domain/item.repository';
import { ItemNotFoundException } from 'src/modules/lists/domain/exceptions/item-not-found.exception';
import { ListItemNotFoundException } from 'src/modules/lists/domain/exceptions/list-item-not-found.exception';
import { ListNotFoundException } from 'src/modules/lists/domain/exceptions/list-not-found.exception';
import { List } from 'src/modules/lists/domain/list.entity';
import { ListRespository } from 'src/modules/lists/domain/list.repository';

import { ListDto } from '../../list.dto';
import { ListMapper } from '../../list.mapper';
import { UpdateListItemQuantityCommand } from './update-list-item-quantity.command';

@CommandHandler(UpdateListItemQuantityCommand)
export class UpdateListItemQuantityCommandHandler
  implements ICommandHandler<UpdateListItemQuantityCommand>
{
  constructor(
    private readonly listRepository: ListRespository,
    private readonly itemRepository: ItemRepository,
  ) {}

  async execute(command: UpdateListItemQuantityCommand): Promise<ListDto> {
    const { listId, itemId, quantity } = command;

    const existingList = await this.ensureExistsList(listId);

    const itemIndex = existingList.items.findIndex(
      (listItem) => listItem.itemId === itemId,
    );

    if (itemIndex === -1) throw new ListItemNotFoundException(itemId);

    if (quantity <= 0) {
      existingList.items.splice(itemIndex, 1);
    } else {
      existingList.items[itemIndex].quantity = quantity;
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
