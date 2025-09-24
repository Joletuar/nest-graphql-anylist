import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserRepository } from 'src/modules/users/domain/user.repository';

import { UserDto } from '../../user.dto';
import { UserMapper } from '../../user.mapper';
import { GetAllUsersQuery } from './get-all-user.query';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersQueryHandler
  implements IQueryHandler<GetAllUsersQuery>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(): Promise<UserDto[]> {
    const users = await this.repository.getAll();

    return UserMapper.toDtoList(users);
  }
}
