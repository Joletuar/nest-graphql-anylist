import { Query } from '@nestjs/cqrs';

import { Criteria } from '@shared/domain/criteria/criteria.interface';

import { PaginatedListItemsDto } from './paginated-list-items.dto';

export class SearchListItemsByCriteriaQuery extends Query<PaginatedListItemsDto> {
  constructor(readonly criteria: Criteria) {
    super();
  }
}
