import { Item } from '@items/domain/item.entity';
import { ulid } from 'ulidx';

export class ItemMother {
  static create(overrides: Partial<Item> = {}): Item {
    return {
      id: ulid(),
      name: 'Rice',
      stock: 10,
      quantityUnits: 'kg',
      userId: ulid(),
      ...overrides,
    };
  }
}
