import { Nullable } from 'src/modules/shared/domain/nullable.type';

import { Item } from './item.entity';

export abstract class ItemRepository {
  abstract getAll(): Promise<Item[]>;

  abstract findById(id: string): Promise<Nullable<Item>>;

  abstract create(item: Item): Promise<Item>;

  abstract update(item: Item): Promise<Item>;
}
