import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserRepository } from 'src/modules/users/domain/user.repository';

import { UserMapper } from '../../user.mapper';
import { PaginatedUsersDto } from './paginated-users.dto';
import { SearchUserByCriteriaQuery } from './search-user-by-criteria.query';

@QueryHandler(SearchUserByCriteriaQuery)
export class SearchUserByCriteriaQueryHandler
  implements IQueryHandler<SearchUserByCriteriaQuery>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(query: SearchUserByCriteriaQuery): Promise<PaginatedUsersDto> {
    const result = await this.repository.search(query.criteria);

    return UserMapper.toPaginatedDto(result);
  }
}
