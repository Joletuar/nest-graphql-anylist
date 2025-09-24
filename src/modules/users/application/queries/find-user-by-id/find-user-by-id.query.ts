import { Query } from '@nestjs/cqrs';

import { UserDto } from '../../user.dto';

export class FindUserByIdQuery extends Query<UserDto> {
  constructor(readonly id: string) {
    super();
  }
}
