import { Query } from '@nestjs/cqrs';

import { ItemDto } from '../../item.dto';

export class FindItemByIdQuery extends Query<ItemDto> {
  constructor(readonly id: string) {
    super();
  }
}
