import { Query } from '@nestjs/cqrs';

import { Criteria } from 'src/modules/shared/domain/criteria/criteria.interface';

import { PaginatedUsersDto } from './paginated-users.dto';

export class SearchUserByCriteriaQuery extends Query<PaginatedUsersDto> {
  constructor(readonly criteria: Criteria) {
    super();
  }
}
