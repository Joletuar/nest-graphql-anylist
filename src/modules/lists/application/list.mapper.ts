import { Item } from 'src/modules/items/domain/item.entity';
import { User } from 'src/modules/users/domain/user.entity';

import { List } from '../domain/list.entity';
import { ListItemMapper } from './list-item.mapper';
import { ListDto } from './list.dto';

export class ListMapper {
  static toDto(list: List, user: User, items: Item[]): ListDto {
    return {
      id: list.id,
      name: list.name,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
      items: ListItemMapper.toDtoList(list.items, items),
    };
  }

  static toDtoList(lists: List[], user: User, items: Item[]): ListDto[] {
    return lists.map((list) => this.toDto(list, user, items));
  }
}
