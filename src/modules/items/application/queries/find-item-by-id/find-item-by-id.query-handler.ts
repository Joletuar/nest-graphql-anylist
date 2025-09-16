import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ItemNotFoundException } from 'src/modules/items/domain/exceptions/item-not-found.exception';
import { ItemRepository } from 'src/modules/items/domain/item.repository';

import { ItemDto } from '../../item.dto';
import { ItemMapper } from '../../item.mapper';
import { FindItemByIdQuery } from './find-item-by-id.query';

@QueryHandler(FindItemByIdQuery)
export class FinItemByIdQueryHandler
  implements IQueryHandler<FindItemByIdQuery>
{
  constructor(private readonly repository: ItemRepository) {}

  async execute(query: FindItemByIdQuery): Promise<ItemDto> {
    const item = await this.repository.findById(query.id);

    if (!item) throw new ItemNotFoundException(query.id);

    return ItemMapper.toDto(item);
  }
}
