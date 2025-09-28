import { Criteria } from 'src/modules/shared/domain/criteria/criteria.interface';
import { Nullable } from 'src/modules/shared/domain/nullable.type';
import { Paginated } from 'src/modules/shared/domain/paginated.entity';

import { User } from './user.entity';

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;

  abstract update(user: User): Promise<User>;

  abstract getAll(): Promise<User[]>;

  abstract findById(id: string): Promise<Nullable<User>>;

  abstract search(criteria: Criteria): Promise<Paginated<User>>;
}
