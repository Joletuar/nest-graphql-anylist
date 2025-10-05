import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserNotFoundException } from '@users/domain/exceptions/user-not-found.exception';
import { UserRepository } from '@users/domain/user.repository';

import { UserDto } from '../../user.dto';
import { UserMapper } from '../../user.mapper';
import { FindUserByIdQuery } from './find-user-by-id.query';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdQueryHandler
  implements IQueryHandler<FindUserByIdQuery>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(query: FindUserByIdQuery): Promise<UserDto> {
    const user = await this.repository.findById(query.id);

    if (!user) throw new UserNotFoundException(query.id);

    return UserMapper.toDto(user);
  }
}
