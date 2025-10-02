import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ListDto } from '../../list.dto';
import { FindListByIdService } from '../../services/find-list-by-id.service';
import { FindListByIdQuery } from './find-list-by-id.query';

@QueryHandler(FindListByIdQuery)
export class FindListByIdQueryHandler
  implements IQueryHandler<FindListByIdQuery>
{
  constructor(private readonly findListByIdService: FindListByIdService) {}

  async execute(query: FindListByIdQuery): Promise<ListDto> {
    const list = await this.findListByIdService.find(query.id);

    return list;
  }
}
