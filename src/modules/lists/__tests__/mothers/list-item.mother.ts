import { ListItem } from '@lists/domain/list-item.entity';
import { ulid } from 'ulidx';

export class ListItemMother {
  static create(overrides: Partial<ListItem> = {}): ListItem {
    return {
      id: ulid(),
      itemId: ulid(),
      quantity: 1,
      ...overrides,
    };
  }
}
