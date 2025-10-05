import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Item } from '@items/domain/item.entity';
import { ItemRepository } from '@items/domain/item.repository';
import { ItemNotFoundException } from '@lists/domain/exceptions/item-not-found.exception';
import { ListRespository } from '@lists/domain/list.repository';
import { ulid } from 'ulidx';

import { ListDto } from '../../list.dto';
import { ListMapper } from '../../list.mapper';
import { CreateListCommand } from './create-list.command';

@CommandHandler(CreateListCommand)
export class CreateListCommandHandler
  implements ICommandHandler<CreateListCommand>
{
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly listRepository: ListRespository,
  ) {}

  async execute(command: CreateListCommand): Promise<ListDto> {
    const { userId, items: itemsInput = [], name } = command;

    const items: Item[] = [];

    for (const { itemId } of itemsInput) {
      const item = await this.ensureExistsItem(itemId);

      items.push(item);
    }

    const createdList = await this.listRepository.create({
      id: ulid(),
      name,
      userId,
      items: itemsInput.map((item) => ({
        id: ulid(),
        itemId: item.itemId,
        quantity: item.quantity,
      })),
    });

    return ListMapper.toDto(createdList);
  }

  async ensureExistsItem(id: string): Promise<Item> {
    const item = await this.itemRepository.findById(id);

    if (!item) throw new ItemNotFoundException(id);

    return item;
  }
}
