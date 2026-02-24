import { List } from '@lists/domain/list.entity';
import { ulid } from 'ulidx';

import { ListItemMother } from './list-item.mother';

export class ListMother {
  static create(overrides: Partial<List> = {}): List {
    return {
      id: ulid(),
      name: 'Groceries',
      userId: ulid(),
      items: [ListItemMother.create()],
      ...overrides,
    };
  }
}
