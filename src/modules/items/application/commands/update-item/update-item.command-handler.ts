import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ItemNotFoundException } from 'src/modules/items/domain/exceptions/item-not-found.exception';
import { Item } from 'src/modules/items/domain/item.entity';
import { ItemRepository } from 'src/modules/items/domain/item.repository';

import { ItemDto } from '../../item.dto';
import { ItemMapper } from '../../item.mapper';
import { UpdateItemCommand } from './update-item.command';

@CommandHandler(UpdateItemCommand)
export class UpdateItemCommandHandler
  implements ICommandHandler<UpdateItemCommand>
{
  constructor(private readonly repository: ItemRepository) {}

  async execute(command: UpdateItemCommand): Promise<ItemDto> {
    const { id, name, stock, quantityUnits, userId } = command;

    const currentItem = await this.ensureExistsItem(id);

    const itemToUpdate: Item = {
      id,
      name: name ?? currentItem.name,
      stock: stock ?? currentItem.stock,
      quantityUnits: quantityUnits ?? currentItem.quantityUnits,
      userId: userId ?? currentItem.userId,
    };

    const updatedItem = await this.repository.update(itemToUpdate);

    return ItemMapper.toDto(updatedItem);
  }

  private async ensureExistsItem(id: string): Promise<Item> {
    const item = await this.repository.findById(id);

    if (!item) throw new ItemNotFoundException(id);

    return item;
  }
}
