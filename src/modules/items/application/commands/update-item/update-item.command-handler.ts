import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ItemNotFoundException } from '@items/domain/exceptions/item-not-found.exception';
import { Item } from '@items/domain/item.entity';
import { ItemRepository } from '@items/domain/item.repository';
import { ItemId } from '@modules/items/domain/value-objects/item-id.value-object';

import { ItemDto } from '../../item.dto';
import { ItemMapper } from '../../item.mapper';
import { UpdateItemCommand } from './update-item.command';

@CommandHandler(UpdateItemCommand)
export class UpdateItemCommandHandler
  implements ICommandHandler<UpdateItemCommand>
{
  constructor(private readonly repository: ItemRepository) {}

  async execute(command: UpdateItemCommand): Promise<ItemDto> {
    const { id, name, stock, quantityUnits, userId } = command.dto;

    const currentItem = await this.ensureExistsItem(id);
    const primitiveItem = currentItem.toPrimitives();

    const itemToUpdate = Item.fromPrimitives({
      id,
      name: name ?? primitiveItem.name,
      stock: stock ?? primitiveItem.stock,
      quantityUnits: quantityUnits ?? primitiveItem.quantityUnits,
      userId: userId ?? primitiveItem.userId,
    });

    const updatedItem = await this.repository.update(itemToUpdate);

    return ItemMapper.toDto(updatedItem);
  }

  private async ensureExistsItem(id: string): Promise<Item> {
    const item = await this.repository.findById(new ItemId(id));

    if (!item) throw new ItemNotFoundException(id);

    return item;
  }
}
