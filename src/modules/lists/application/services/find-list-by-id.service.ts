import { Injectable } from '@nestjs/common';

import { Item } from '@items/domain/item.entity';
import { ItemRepository } from '@items/domain/item.repository';

import { ItemNotFoundException } from '../../domain/exceptions/item-not-found.exception';
import { ListNotFoundException } from '../../domain/exceptions/list-not-found.exception';
import { ListRespository } from '../../domain/list.repository';
import { ListDto } from '../list.dto';
import { ListMapper } from '../list.mapper';

@Injectable()
export class FindListByIdService {
  constructor(
    private readonly listRepository: ListRespository,
    private readonly itemRepository: ItemRepository,
  ) {}

  async find(id: string): Promise<ListDto> {
    const list = await this.listRepository.findById(id);

    if (!list) throw new ListNotFoundException(id);

    const items: Item[] = [];

    for (const { itemId } of list.items) {
      const item = await this.getItemInfo(itemId);

      items.push(item);
    }

    return ListMapper.toDto(list);
  }

  private async getItemInfo(id: string): Promise<Item> {
    const item = await this.itemRepository.findById(id);

    if (!item) throw new ItemNotFoundException(id);

    return item;
  }
}
