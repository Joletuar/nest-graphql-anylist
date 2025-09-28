import { Query } from '@nestjs/cqrs';

import { Criteria } from 'src/modules/shared/domain/criteria/criteria.interface';

import { PaginatedUserDto } from './paginated-user.dto';

export class SearchUserByCriteriaQuery extends Query<PaginatedUserDto> {
  constructor(readonly criteria: Criteria) {
    super();
  }
}
