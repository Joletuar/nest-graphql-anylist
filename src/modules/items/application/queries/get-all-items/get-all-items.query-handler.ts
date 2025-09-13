import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ItemRepository } from '../../../domain/item.repository';
import { ItemDto } from '../../item.dto';
import { ItemMapper } from '../../item.mapper';
import { GetAllItemsQuery } from './get-all-items.query';

@QueryHandler(GetAllItemsQuery)
export class GetAllItemsQueryHandler
  implements IQueryHandler<GetAllItemsQuery>
{
  constructor(private readonly repository: ItemRepository) {}

  async execute(): Promise<ItemDto[]> {
    const items = await this.repository.getAll();

    return ItemMapper.toDtoList(items);
  }
}
