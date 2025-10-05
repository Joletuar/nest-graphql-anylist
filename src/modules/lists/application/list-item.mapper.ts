import { ListItem } from '../domain/list-item.entity';
import { ListItemDto } from './list-item.dto';

export class ListItemMapper {
  static toDto(listItem: ListItem): ListItemDto {
    return {
      id: listItem.id,
      itemId: listItem.itemId,
      quantity: listItem.quantity,
    };
  }

  static toDtoList(listItems: ListItem[]): ListItemDto[] {
    return listItems.map((item) => this.toDto(item));
  }
}
