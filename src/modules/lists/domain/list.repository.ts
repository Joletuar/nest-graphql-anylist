import { Nullable } from '@shared/domain/nullable.type';

import { List } from './list.entity';

export abstract class ListRespository {
  abstract create(list: List): Promise<List>;

  abstract update(list: List): Promise<List>;

  abstract getAll(): Promise<List[]>;

  abstract findById(id: string): Promise<Nullable<List>>;
}
