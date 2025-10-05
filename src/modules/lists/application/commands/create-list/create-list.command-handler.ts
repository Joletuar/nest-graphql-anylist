import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Item } from 'src/modules/items/domain/item.entity';
import { ItemRepository } from 'src/modules/items/domain/item.repository';
import { ItemNotFoundException } from 'src/modules/lists/domain/exceptions/item-not-found.exception';
import { UserNotFoundException } from 'src/modules/lists/domain/exceptions/user-not-found.exception';
import { ListRespository } from 'src/modules/lists/domain/list.repository';
import { User } from 'src/modules/users/domain/user.entity';
import { UserRepository } from 'src/modules/users/domain/user.repository';
import { ulid } from 'ulidx';

import { ListDto } from '../../list.dto';
import { ListMapper } from '../../list.mapper';
import { CreateListCommand } from './create-list.command';

@CommandHandler(CreateListCommand)
export class CreateListCommandHandler
  implements ICommandHandler<CreateListCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly itemRepository: ItemRepository,
    private readonly listRepository: ListRespository,
  ) {}

  async execute(command: CreateListCommand): Promise<ListDto> {
    const { userId, items: itemsInput = [], name } = command;

    const user = await this.ensureExistsUser(userId);

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

    return ListMapper.toDto(createdList, user, items);
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
