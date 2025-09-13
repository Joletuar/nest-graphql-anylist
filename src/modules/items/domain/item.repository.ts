import { Nullable } from 'src/modules/shared/domain/nullable.type';

import { Item } from './item.entity';

export abstract class ItemRepository {
  abstract getAll(): Promise<Item[]> | Item[];

  abstract getById(id: string): Promise<Nullable<Item>> | Nullable<Item>;
}
