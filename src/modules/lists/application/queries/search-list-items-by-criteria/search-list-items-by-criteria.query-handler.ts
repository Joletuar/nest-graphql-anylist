import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ListItemRepository } from '../../../domain/list-item.repository';
import { ListItemMapper } from '../../list-item.mapper';
import { PaginatedListItemsDto } from './paginated-list-items.dto';
import { SearchListItemsByCriteriaQuery } from './search-list-items-by-criteria.query';

@QueryHandler(SearchListItemsByCriteriaQuery)
export class SearchListItemsByCriteriaQueryHandler
  implements IQueryHandler<SearchListItemsByCriteriaQuery>
{
  constructor(private readonly listItemRepository: ListItemRepository) {}

  async execute(
    query: SearchListItemsByCriteriaQuery,
  ): Promise<PaginatedListItemsDto> {
    const { criteria } = query;

    const { data: listItems, pagination } =
      await this.listItemRepository.search(criteria);

    const dtos = ListItemMapper.toDtoList(listItems);

    return {
      items: dtos,
      pagination,
    };
  }
}
