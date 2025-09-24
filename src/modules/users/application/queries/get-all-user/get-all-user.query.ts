import { Query } from '@nestjs/cqrs';

import { UserDto } from '../../user.dto';

export class GetAllUsersQuery extends Query<UserDto[]> {}
