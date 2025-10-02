import { Query } from '@nestjs/cqrs';

import { ListDto } from '../../list.dto';

export class FindListByIdQuery extends Query<ListDto> {
  constructor(public readonly id: string) {
    super();
  }
}
