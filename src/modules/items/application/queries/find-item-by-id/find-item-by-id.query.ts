import { Query } from '@nestjs/cqrs';

import { QueryItemDto } from '../query-item.dto';

export class FindItemByIdQuery extends Query<QueryItemDto> {
  constructor(readonly id: string) {
    super();
  }
}
