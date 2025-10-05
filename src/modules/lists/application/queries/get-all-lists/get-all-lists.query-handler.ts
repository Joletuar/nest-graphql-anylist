import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ListRespository } from '@lists/domain/list.repository';

import { ListDto } from '../../list.dto';
import { FindListByIdService } from '../../services/find-list-by-id.service';
import { GetAllListsQuery } from './get-all-lists.query';

@QueryHandler(GetAllListsQuery)
export class GetAllListsQueryHandler
  implements IQueryHandler<GetAllListsQuery>
{
  constructor(
    private readonly repository: ListRespository,
    private readonly findListByIdService: FindListByIdService,
  ) {}

  async execute(): Promise<ListDto[]> {
    const lists = await this.repository.getAll();

    const listsDto: ListDto[] = [];

    for (const list of lists) {
      const listDto = await this.findListByIdService.find(list.id);

      listsDto.push(listDto);
    }

    return listsDto;
  }
}
