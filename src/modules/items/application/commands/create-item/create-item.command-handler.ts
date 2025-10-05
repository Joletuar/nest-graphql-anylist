import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Item } from '@items/domain/item.entity';
import { ItemRepository } from '@items/domain/item.repository';
import { ulid } from 'ulidx';

import { ItemDto } from '../../item.dto';
import { ItemMapper } from '../../item.mapper';
import { CreateItemCommand } from './create-item.command';

@CommandHandler(CreateItemCommand)
export class CreateItemCommandHandler
  implements ICommandHandler<CreateItemCommand>
{
  constructor(private readonly repository: ItemRepository) {}

  async execute(command: CreateItemCommand): Promise<ItemDto> {
    const { name, stock, quantityUnits, userId } = command;

    const item: Item = {
      id: ulid(),
      name,
      stock,
      quantityUnits,
      userId,
    };

    const createdItem = await this.repository.create(item);

    return ItemMapper.toDto(createdItem);
  }
}
