import { Item } from 'src/modules/items/domain/item.entity';

import { ItemModel } from './item.model';

export class TypeOrmItemMapper {
  static toDomain(model: ItemModel): Item {
    const { id, name, quantity, quantityUnits, userId } = model;

    return {
      id,
      name,
      quantity,
      quantityUnits,
      userId,
    };
  }

  static toDomainList(models: ItemModel[]): Item[] {
    return models.map((model) => this.toDomain(model));
  }
}
