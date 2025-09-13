import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ItemNotFoundException } from 'src/modules/items/domain/exceptions/item-not-found.exception';
import { ItemRepository } from 'src/modules/items/domain/item.repository';

import { ItemDto } from '../../item.dto';
import { ItemMapper } from '../../item.mapper';
import { GetItemByIdQuery } from './get-item-by-id.query';

@Injectable()
@QueryHandler(GetItemByIdQuery)
export class GetItemByIdQueryHandler
  implements IQueryHandler<GetItemByIdQuery>
{
  constructor(private readonly repository: ItemRepository) {}

  async execute(query: GetItemByIdQuery): Promise<ItemDto> {
    const item = await this.repository.getById(query.id);

    if (!item) throw new ItemNotFoundException(query.id);

    return ItemMapper.toDto(item);
  }
}
