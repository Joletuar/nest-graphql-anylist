import { Nullable } from 'src/modules/shared/domain/nullable.type';

import { User } from './user.entity';

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;

  abstract update(user: User): Promise<User>;

  abstract getAll(): Promise<User[]>;

  abstract findById(id: string): Promise<Nullable<User>>;
}
