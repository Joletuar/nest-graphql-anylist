import { Criteria } from '@shared/domain/criteria/criteria.interface';
import { Nullable } from '@shared/domain/nullable.type';
import { Paginated } from '@shared/domain/paginated.entity';

import { User } from './user.entity';
import { UserId } from './value-objects/user-id.value-object';

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;

  abstract update(user: User): Promise<User>;

  abstract getAll(): Promise<User[]>;

  abstract findById(id: UserId): Promise<Nullable<User>>;

  abstract search(criteria: Criteria): Promise<Paginated<User>>;
}
