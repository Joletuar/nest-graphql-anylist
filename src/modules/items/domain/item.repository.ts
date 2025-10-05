import { Criteria } from '@shared/domain/criteria/criteria.interface';
import { Nullable } from '@shared/domain/nullable.type';
import { Paginated } from '@shared/domain/paginated.entity';

import { Item } from './item.entity';

export abstract class ItemRepository {
  abstract getAll(): Promise<Item[]>;

  abstract findById(id: string): Promise<Nullable<Item>>;

  abstract create(item: Item): Promise<Item>;

  abstract update(item: Item): Promise<Item>;

  abstract search(criteria: Criteria): Promise<Paginated<Item>>;
}
