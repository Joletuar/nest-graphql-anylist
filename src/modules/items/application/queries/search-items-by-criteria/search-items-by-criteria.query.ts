import { Query } from '@nestjs/cqrs';

import { Criteria } from '@shared/domain/criteria/criteria.interface';

import { PaginatedItemsDto } from './paginated-items.dto';

export class SearchItemsByCriteriaQuery extends Query<PaginatedItemsDto> {
  constructor(readonly criteria: Criteria) {
    super();
  }
}
