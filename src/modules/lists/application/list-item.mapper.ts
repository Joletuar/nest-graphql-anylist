import { Item } from 'src/modules/items/domain/item.entity';

import { ItemNotFoundException } from '../domain/exceptions/item-not-found.exception';
import { ListItem } from '../domain/list-item.entity';
import { ListItemDto } from './list-item.dto';

export class ListItemMapper {
  static toDto(listItem: ListItem, item: Item): ListItemDto {
    return {
      id: listItem.id,
      quantity: listItem.quantity,
      itemId: item.id,
      itemName: item.name,
      itemQuantityUnits: item.quantityUnits,
    };
  }

  static toDtoList(listItems: ListItem[], items: Item[]): ListItemDto[] {
    return listItems.map((listItem) => {
      const item = items.find((i) => i.id === listItem.itemId);

      if (!item) throw new ItemNotFoundException(listItem.itemId);

      return this.toDto(listItem, item);
    });
  }
}
