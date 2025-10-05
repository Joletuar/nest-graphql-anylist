import { ListItem } from '@lists/domain/list-item.entity';

import { ListItemModel } from './list-item.model';

export class TypeOrmListItemMapper {
  static toDomain(model: ListItemModel): ListItem {
    const { id, itemId, quantity } = model;

    return {
      id,
      itemId,
      quantity,
    };
  }

  static toDomainList(models: ListItemModel[]): ListItem[] {
    return models.map((model) => this.toDomain(model));
  }
}
